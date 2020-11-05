<template>
    <div class="calendar">
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
            /*  const state = reactive({
               weekNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
               today: new Date(),
               currentMonth: state.today.getMonth(),
               currentYear: state.today.getFullYear(),
               getMonth: state.currentMonth + 1,
               currentMonthName: computed(() => new Date(state.currentYear, state.currentMonth).toLocaleString("default", { month: "long" })),
               getLastDayOfMonth: computed(() => new Date(state.currentYear, state.getMonth, 0).getDate()),
               startDay: computed(() => new Date(state.currentYear, state.currentMonth, 1).getDay())
           });
    */

            console.log(store.state);
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
                selectedDate: null
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
                console.log(state.endDay);
            };
            const goPrev = () => {
                if (state.currentMonth === 0) {
                    state.currentMonth = 11;
                    state.currentYear--;
                } else {
                    state.currentMonth--;
                }
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
        width: 30px;
        height: 30px;
    }
</style>
