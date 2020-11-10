<template>
    <div id="calendar" class="calendar">
        <transition-group :name="state.direction" tag="div" mode="in-out" class="slider__container">
            <div key="lorem">
                <div>{{ state.currentMonthName }}</div>
                <div>{{ state.currentYear }}</div>
                <div>
                    <ul class="weekDays">
                        <li v-for="days in state.weekNames" :key="days">{{ days }}</li>
                    </ul>
                </div>
                <div class="days">
                    <span
                        @click="
                            selectDate(state.currentYear, state.currentMonth - 1, state.getLastDayOfPreviousMonth - state.startDay + day);
                            goPrev();
                        "
                        class="lastMonth"
                        v-for="day in state.startDay"
                        :key="'empty' + day"
                        >{{ state.getLastDayOfPreviousMonth - state.startDay + day }}</span
                    >
                    <span :class="currenDateClass(state.currentYear, state.currentMonth, day)" @click="selectDate(state.currentYear, state.currentMonth, day)" v-for="day in state.getLastDayOfMonth" :key="day">{{ day }}</span>
                    <span
                        @click="
                            goNext();
                            selectDate(state.currentYear, state.currentMonth, day);
                        "
                        class="lastMonth"
                        v-for="day in 6 - state.endDay"
                        :key="'nextMonth' + day"
                        >{{ day }}</span
                    >
                </div>
            </div>
        </transition-group>
        <button @click="goPrev">Prev</button>
        <button @click="goNext">Next</button>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default defineComponent({
    props: ["item"],

    setup() {
        const state = reactive({
            weekNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            today: new Date(),
            currentMonth: null,
            currentYear: null,
            getMonth: computed(() => state.currentMonth + 1),
            currentMonthName: computed(() => new Date(state.currentYear, state.currentMonth).toLocaleString("default", { month: "long" })),
            getLastDayOfMonth: computed(() => new Date(state.currentYear, state.getMonth, 0).getDate()),
            getLastDayOfPreviousMonth: computed(() => new Date(state.currentYear, state.getMonth - 1, 0).getDate()),
            startDay: computed(() => new Date(state.currentYear, state.currentMonth, 1).getDay()),
            endDay: computed(() => new Date(state.currentYear, state.currentMonth + 1, 0).getDay()),
            selectedDate: null,
            initialX: null,
            initialY: null,
            direction: null
        });

        state.currentMonth = state.today.getMonth();
        state.currentYear = state.today.getFullYear();
        state.selectedDate = new Date(state.currentYear, state.currentMonth, state.today.getDate());

        store.setFormatDate(state.currentYear, state.currentMonth, state.today.getDate());

        const goNext = () => {
            if (state.currentMonth === 11) {
                state.currentMonth = 0;
                state.currentYear++;
            } else {
                state.currentMonth++;
            }
            state.direction = "next";
        };
        const goPrev = () => {
            if (state.currentMonth === 0) {
                state.currentMonth = 11;
                state.currentYear--;
            } else {
                state.currentMonth--;
            }

            state.direction = "prev";
        };

        const selectDate = (year, month, day) => {
            store.setFormatDate(year, month, day);
            state.selectedDate = new Date(year, month, day);
        };

        const currenDateClass = (year, month, day) => {
            console.log(state.selectedDate);
            const calenderFullDate = new Date(state.currentYear, state.currentMonth, day).toDateString();
            return calenderFullDate === state.selectedDate.toDateString() ? "activeDay" : "";
        };

        const startTouch = e => {
            state.initialX = e.touches[0].clientX;
            state.initialY = e.touches[0].clientY;
        };
        const moveTouch = e => {
            if (state.initialX === null) return;
            if (state.initialY === null) return;
            let currentX = e.touches[0].clientX,
                currentY = e.touches[0].clientY,
                diffX = state.initialX - currentX,
                diffY = state.initialY - currentY;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    /*   e.currentTarget.style.transform = `translate3d(-${diffX}px, 0, 0) `; */
                    goNext();
                } else {
                    goPrev();
                }

                state.initialX = null;
                state.initialY = null;
                /* ? goNext() : goPrev(); */
            }

            e.preventDefault();
        };
        onMounted(() => {
            /* window.addEventListener("mouseup", () => this.stopDrag()); */

            document.querySelector(".calendar").addEventListener("touchstart", event => {
                startTouch(event);
            });
            document.querySelector(".calendar").addEventListener("touchmove", event => {
                moveTouch(event);
            });

            /*     window.addEventListener("touchend", () => this.stopDrag());
            window.addEventListener("touchmove", (event: TouchEvent) => this.preventDraggingInYMovement(event)); */
        });

        return {
            state,
            goNext,
            goPrev,
            selectDate,
            currenDateClass
        };
    }
});
</script>

<style lang="scss">
.weekDays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0;

    li {
        list-style-type: none;
    }
}

.lastMonth {
    opacity: 0.4;
}
.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    span {
        cursor: pointer;
    }
}

.activeDay {
    border-radius: 50%;
    background-color: #187c56;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}

.prev-enter-active,
.prev-leave-active {
    transition: 0.5s;
}
.prev-enter {
    transform: translate(-100%, 0);
}
.prev-leave-to {
    transform: translate(100%, 0);
}
.next-enter-active,
.next-leave-active {
    transition: 0.5s;
}
.next-enter {
    transform: translate(100%, 0);
}
.next-leave-to {
    transform: translate(-100%, 0);
}
</style>
