<template>
    <div id="calendar" class="calendar" :class="{ isOpen: getCalendarOpen }">
        <header class="calendar__header">
            <h2 class="calendar__title">Calendar</h2>
            <svg class="calendar__close" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="closeCalendar">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentcolor" />
            </svg>
        </header>
        <nav class="calendar__navigation">
            <button class="calendar__navigation__prev" @click="goPrev">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.705 16.59L11.125 12L15.705 7.41L14.295 6L8.29498 12L14.295 18L15.705 16.59Z" fill="currentcolor" />
                </svg>
            </button>
            <button class="calendar__navigation__next" @click="goNext">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.705 16.59L11.125 12L15.705 7.41L14.295 6L8.29498 12L14.295 18L15.705 16.59Z" fill="currentcolor" />
                </svg>
            </button>
        </nav>
        <ul class="calendar__weekDays">
            <li v-for="days in weekNames" :key="days">{{ days }}</li>
        </ul>
        <div class="calendar__container">
            <div v-for="(calendar, index) in getClosestMonths" :key="index" class="calendar__daysContainer">
                <span class="calendar__month">{{ calendar.currentMonthName }} {{ calendar.currentYear }}</span>
                <div :key="calendar.currentMonth" class="calendar__days">
                    <span
                        @click="
                            selectDate(calendar.currentYear, calendar.currentMonth - 1, calendar.getLastDayOfPreviousMonth - calendar.startDay + day);
                            goPrev(calendar.currentYear, calendar.currentMonth - 1, calendar.getLastDayOfPreviousMonth - calendar.startDay + day);
                        "
                        class="calendar__day calendar__day--light"
                        v-for="day in calendar.startDay"
                        :key="'empty' + day"
                        >{{ calendar.getLastDayOfPreviousMonth - calendar.startDay + day }}</span
                    >
                    <span class="calendar__day" :class="[currentDateClass(calendar.currentYear, calendar.currentMonth, day), currentSelectedDayClass(calendar.currentYear, calendar.currentMonth, day)]" @click="selectDate(calendar.currentYear, calendar.currentMonth, day)" v-for="day in calendar.getLastDayOfMonth" :key="day">{{ day }}</span>
                    <span
                        @click="
                            goNext(calendar.currentYear, calendar.currentMonth + 1, day);
                            selectDate(calendar.currentYear, calendar.currentMonth + 1, day);
                        "
                        class="calendar__day calendar__day--light"
                        v-for="day in 6 - calendar.endDay"
                        :key="'nextMonth' + day"
                        >{{ day }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed, watch } from "@nuxtjs/composition-api";
    import store from "@/store.js";

    import useCalendar from "../../modules/useCalendar";

    export default {
        setup() {
            const { weekNames, currentSelectedDayClass, goNext, goPrev, currentDateClass, selectDate, getClosestMonths } = useCalendar();
            const getCalendarOpen = computed(() => store.getCalendarOpen());
            const closeCalendar = () => store.setCalendarOpen(false);
            return {
                weekNames,
                currentSelectedDayClass,
                goNext,
                goPrev,
                currentDateClass,
                selectDate,
                getClosestMonths,
                getCalendarOpen,
                closeCalendar
            };
        }
    };
</script>

<style lang="scss" scoped>
    .calendar {
        position: fixed;
        top: 0;
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        display: grid;
        max-width: 375px;
        opacity: 1;
        transform: translateY(-100%);
        transition: all 0.4s ease;

        &.isOpen {
            opacity: 1;
            transform: translateY(0);
        }

        &__header {
            grid-column: 1/-1;
            grid-row: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--color-bg--dark--high);
            padding: 12px;
            margin-bottom: 24px;
        }

        &__close {
            cursor: pointer;
        }

        &__title {
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
        }

        &__navigation {
            grid-column: 1/-1;
            grid-row: 2;
            display: flex;
            justify-content: space-between;
            color: #797979;
            margin-bottom: 24px;
            z-index: 2;

            &__next {
                transform: rotate(180deg);
            }
        }

        &__container {
            grid-column: 1/-1;
            grid-row: 2/5;
            display: flex;
            width: 300%;
            overflow: hidden;
            margin-left: -100%;
            position: relative;
        }

        &__weekDays {
            grid-column: 1/-1;
            grid-row: 3;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            margin-bottom: 14px;

            li {
                font-weight: 600;
                font-size: 14px;
                text-transform: uppercase;
                text-align: center;
            }
        }

        &__daysContainer {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        &__month {
            align-self: center;
            color: #797979;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
        }

        &__days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            margin-top: 56px;
        }

        &__day {
            display: grid;
            place-items: center;
            cursor: pointer;
            font-weight: 600;
            padding: 16px;
            font-size: 14px;

            &--light {
                opacity: 0.4;
            }
        }

        .activeDay {
            border-radius: 50%;
            background-color: var(--color-primary);
            color: white;
            z-index: 9;
        }

        .selectedDate {
            border-radius: 50%;
            background-color: var(--color-bg);
            color: (--color-text);
        }
    }
</style>
