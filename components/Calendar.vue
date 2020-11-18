<template>
    <div id="calendar" class="calendar">
        <div>
            <ul class="weekDays">
                <li v-for="days in state.weekNames" :key="days">{{ days }}</li>
            </ul>
        </div>
        <div class="calendarContainer">
            <div v-for="(calendar, index) in getClosestMonths" :key="index" class="calendarItem">
                <div>{{ calendar.currentMonthName }}</div>
                <div>{{ calendar.currentYear }}</div>
                <div :key="calendar.currentMonth" class="days">
                    <span
                        @click="
                            selectDate(calendar.currentYear, calendar.currentMonth - 1, calendar.getLastDayOfPreviousMonth - calendar.startDay + day);
                            goPrev(calendar.currentYear, calendar.currentMonth - 1, calendar.getLastDayOfPreviousMonth - calendar.startDay + day);
                        "
                        class="lastMonth"
                        v-for="day in calendar.startDay"
                        :key="'empty' + day"
                        >{{ calendar.getLastDayOfPreviousMonth - calendar.startDay + day }}</span
                    >
                    <span :class="[currentDateClass(calendar.currentYear, calendar.currentMonth, day), currentSelectedDayClass(calendar.currentYear, calendar.currentMonth, day)]" @click="selectDate(calendar.currentYear, calendar.currentMonth, day)" v-for="day in calendar.getLastDayOfMonth" :key="day">{{ day }}</span>
                    <span
                        @click="
                            goNext(calendar.currentYear, calendar.currentMonth + 1, day);
                            selectDate(calendar.currentYear, calendar.currentMonth + 1, day);
                        "
                        class="lastMonth"
                        v-for="day in 6 - calendar.endDay"
                        :key="'nextMonth' + day"
                        >{{ day }}</span
                    >
                </div>
            </div>
        </div>

        <button @click="goPrev">Prev</button>
        <button @click="goNext">Next</button>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed, watch } from "@nuxtjs/composition-api";
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
            currentX: 0,
            currentY: 0,
            diffX: 0,
            diffY: 0,
            direction: null,
            isDragging: false,
            isStartTouch: false,
            closestMonths: [],
            getClosestMonths: null,

            transform: 100
        });

        state.currentMonth = state.today.getMonth();
        state.currentYear = state.today.getFullYear();
        state.currentDate = new Date(state.currentYear, state.currentMonth, state.today.getDate());

        store.setFormatDate(state.currentYear, state.currentMonth, state.today.getDate());

        const getClosestMonths = ref([{}, {}, {}]);
        getClosestMonths.value.map((calendar, index) => {
            calendar.currentMonth = new Date().getMonth() == 11 ? 0 : new Date().getMonth() + index - 1;
            calendar.currentYear = calendar.currentMonth == 12 ? new Date().getFullYear() + 1 : new Date().getFullYear();
            calendar.getMonth = calendar.currentMonth + 1;
            calendar.currentMonthName = new Date(calendar.currentYear, calendar.currentMonth).toLocaleString("default", { month: "long" });
            calendar.getLastDayOfMonth = new Date(calendar.currentYear, calendar.getMonth, 0).getDate();
            calendar.getLastDayOfPreviousMonth = new Date(calendar.currentYear, calendar.getMonth - 1, 0).getDate();
            calendar.startDay = new Date(calendar.currentYear, calendar.currentMonth, 1).getDay();
            calendar.endDay = new Date(calendar.currentYear, calendar.currentMonth + 1, 0).getDay();
            calendar.isSelected = false;
        });
        const goNext = (year, month, day) => {
            state.selectedDate = new Date(year, month, day);
            document.querySelector(".calendarContainer").style.transition = "transform 0.4s ease";
            getClosestMonths.value.shift();
            document.querySelector(".calendarContainer").style.transform = `translateX(-100vw)`;
            document.querySelector(".calendarContainer").style.marginLeft = `0`;
            const lastMonth = getClosestMonths.value[getClosestMonths.value.length - 1];
            const isLastMonthOfTheYear = lastMonth.currentMonth == 11;

            getClosestMonths.value.push({
                currentMonth: isLastMonthOfTheYear ? 0 : lastMonth.currentMonth + 1,
                currentYear: isLastMonthOfTheYear ? lastMonth.currentYear + 1 : lastMonth.currentYear,
                getMonth: lastMonth.currentMonth + 1,
                currentMonthName: isLastMonthOfTheYear ? new Date(lastMonth.currentYear + 1, 0).toLocaleString("default", { month: "long" }) : new Date(lastMonth.currentYear, lastMonth.currentMonth + 1).toLocaleString("default", { month: "long" }),
                getLastDayOfMonth: isLastMonthOfTheYear ? new Date(lastMonth.currentYear + 1, 0, 0).getDate() : new Date(lastMonth.currentYear, lastMonth.currentMonth + 2, 0).getDate(),
                getLastDayOfPreviousMonth: isLastMonthOfTheYear ? new Date(lastMonth.currentYear + 1, -1, 0).getDate() : new Date(lastMonth.currentYear, lastMonth.getMonth, 0).getDate(),
                startDay: isLastMonthOfTheYear ? new Date(lastMonth.currentYear + 1, 0, 1).getDay() : new Date(lastMonth.currentYear, lastMonth.currentMonth + 1, 1).getDay(),
                endDay: isLastMonthOfTheYear ? new Date(lastMonth.currentYear + 1, lastMonth.currentMonth + 2, 0).getDay() : new Date(lastMonth.currentYear, lastMonth.currentMonth + 2, 0).getDay()
            });

            document.querySelector(".calendarContainer").addEventListener("transitionend", resetTransition);
        };
        const goPrev = (year, month, day) => {
            state.selectedDate = new Date(year, month, day);

            document.querySelector(".calendarContainer").style.transition = "transform 0.4s ease";
            getClosestMonths.value.pop();
            document.querySelector(".calendarContainer").style.transform = `translateX(100vw)`;
            document.querySelector(".calendarContainer").style.marginLeft = `-100vw`;
            document.querySelector(".calendarContainer").addEventListener("transitionend", goPreviousMonth);
        };

        const resetTransition = e => {
            document.querySelector(".calendarContainer").style.transition = "none";
            document.querySelector(".calendarContainer").style.transform = `translateX(0)`;
            document.querySelector(".calendarContainer").style.marginLeft = `-100vw`;
            e.currentTarget.removeEventListener("transitionend", resetTransition);
        };

        const goPreviousMonth = e => {
            const lastMonth = getClosestMonths.value[0];
            const isFirstMonthOfTheYear = lastMonth.currentMonth == 0;
            document.querySelector(".calendarContainer").style.transition = "none";
            document.querySelector(".calendarContainer").style.transform = `translateX(0)`;
            getClosestMonths.value.splice(0, 0, {
                currentMonth: isFirstMonthOfTheYear ? 11 : lastMonth.currentMonth - 1,
                currentYear: isFirstMonthOfTheYear ? lastMonth.currentYear - 1 : lastMonth.currentYear,
                getMonth: lastMonth.currentMonth - 1,
                currentMonthName: isFirstMonthOfTheYear ? new Date(lastMonth.currentYear - 1, 11).toLocaleString("default", { month: "long" }) : new Date(lastMonth.currentYear, lastMonth.currentMonth - 1).toLocaleString("default", { month: "long" }),
                getLastDayOfMonth: isFirstMonthOfTheYear ? new Date(lastMonth.currentYear - 1, 11, 0).getDate() : new Date(lastMonth.currentYear, lastMonth.currentMonth - 2, 0).getDate(),
                getLastDayOfPreviousMonth: isFirstMonthOfTheYear ? new Date(lastMonth.currentYear - 1, -1, 0).getDate() : new Date(lastMonth.currentYear, lastMonth.getMonth, 0).getDate(),
                startDay: isFirstMonthOfTheYear ? new Date(lastMonth.currentYear - 1, 11, 1).getDay() : new Date(lastMonth.currentYear, lastMonth.currentMonth - 1, 1).getDay(),
                endDay: isFirstMonthOfTheYear ? new Date(lastMonth.currentYear - 1, lastMonth.currentMonth - 2, 0).getDay() : new Date(lastMonth.currentYear, lastMonth.currentMonth - 2, 0).getDay()
            });

            e.currentTarget.removeEventListener("transitionend", goPreviousMonth);
        };

        const selectDate = (year, month, day) => {
            store.setFormatDate(year, month, day);
            state.selectedDate = new Date(year, month, day);
        };

        const currentDateClass = (year, month, day) => {
            const calenderFullDate = new Date(year, month, day).toDateString();
            console.log(calenderFullDate, state.currentDate.toDateString());
            return calenderFullDate === state.currentDate.toDateString() ? "activeDay" : "";
        };

        const currentSelectedDayClass = (year, month, day) => {
            const clickedDay = new Date(year, month, day).toDateString();

            return clickedDay === state.selectedDate?.toDateString() ? "selectedDate" : "";
        };

        const startTouch = event => {
            state.initialX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            state.initialY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
            state.isStartTouch = true;
            console.log(state.initialX);
        };

        const moveTouch = event => {
            if (state.initialX === null) return;
            if (state.initialY === null) return;
            if (!state.isStartTouch) return;
            state.isDragging = true;
            state.currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            state.currentY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
            state.diffX = state.initialX - state.currentX;
            state.diffY = state.initialY - state.currentY;
            if (Math.abs(state.diffX) > Math.abs(state.diffY)) {
                if (state.diffX > 0) {
                    event.currentTarget.querySelector(".calendarContainer").style.transform = `translate3d(-${state.diffX}px, 0, 0) `;
                } else {
                    event.currentTarget.querySelector(".calendarContainer").style.transform = `translate3d(${-state.diffX}px, 0, 0) `;
                }
            }

            event.preventDefault();
        };

        const touchEnd = event => {
            state.isStartTouch = false;
            if (!state.isDragging) return;

            if (Math.abs(state.diffX) > Math.abs(state.diffY)) {
                if (state.diffX > 0) {
                    goNext();
                } else {
                    goPrev();
                }
            }

            state.isDragging = false;
        };

        onMounted(() => {
            /* window.addEventListener("mouseup", () => this.stopDrag()); */
            document.querySelector("body").addEventListener("touchstart", event => {
                if (event.target.closest(".calendar")) {
                    startTouch(event);
                }
            });
            document.querySelector("body").addEventListener("touchstart", event => {
                if (event.target.closest(".calendarContainer")) {
                    startTouch(event);
                }
            });
            document.querySelector("body").addEventListener("mousedown", event => {
                if (event.target.closest(".calendarContainer")) {
                    startTouch(event);
                }
            });
            document.querySelector("body").addEventListener(
                "touchmove",
                event => {
                    if (event.target.closest(".calendarContainer")) {
                        moveTouch(event);
                    }
                },
                { passive: false }
            );

            document.querySelector("body").addEventListener(
                "mousemove",
                event => {
                    if (event.target.closest(".calendarContainer")) {
                        moveTouch(event);
                    }
                },
                { passive: false }
            );

            document.querySelector("body").addEventListener(
                "mouseup",
                event => {
                    if (event.target.closest(".calendarContainer")) {
                        touchEnd(event);
                    }
                },
                { passive: false }
            );

            document.querySelector("body").addEventListener(
                "touchend",
                event => {
                    if (event.target.closest(".calendarContainer")) {
                        touchEnd(event);
                    }
                },
                { passive: false }
            );
            /*     window.addEventListener("touchend", () => this.stopDrag());
            window.addEventListener("touchmove", (event: TouchEvent) => this.preventDraggingInYMovement(event)); */
        });

        return {
            state,
            goNext,
            goPrev,
            selectDate,
            currentDateClass,
            currentSelectedDayClass,
            getClosestMonths
        };
    }
});
</script>

<style lang="scss">
.weekDays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0;
    width: 100vw;

    li {
        list-style-type: none;
    }
}

.calendar {
    overflow: hidden;
}

.calendarContainer {
    display: flex;
    width: 300vw;
    overflow: hidden;
    margin-left: -100vw;
    position: relative;
}

.calendarItem {
    width: 100vw;
}

button {
    margin-top: 200px;
}
.calendar {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
}

.sliderContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.lastMonth {
    opacity: 0.4;
}
.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    span {
        cursor: pointer;
        width: 20px;
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
    z-index: 9;
}
.selectedDate {
    border-radius: 50%;
    background-color: grey;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}
</style>
