<template>
    <div id="calendar" class="calendar">
        <div>
            <ul class="weekDays">
                <li v-for="days in weekNames" :key="days">{{ days }}</li>
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

import useCalendar from "../modules/useCalendar";

export default {
    setup() {
        const { weekNames, currentSelectedDayClass, goNext, goPrev, currentDateClass, selectDate, getClosestMonths } = useCalendar();
        const throttle = (func, limit) => {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                console.log("z");
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                }
            };
        };
        return {
            weekNames,
            currentSelectedDayClass,
            goNext,
            goPrev,
            currentDateClass,
            selectDate,
            getClosestMonths,
            throttle
        };
    }
};
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
    margin-top: 20px;
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
        font-size: 12px;
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
