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
            <span class="lastMonth" v-for="day in state.startDay" :key="'empty' + day">{{ state.getLastDayOfPreviousMonth - state.startDay + day }}</span>
            <span @click="selectDate(state.currentYear, state.currentMonth, day)" v-for="day in state.getLastDayOfMonth" :key="day">{{ day }}</span>
            <span class="lastMonth" v-for="day in 6 - state.endDay" :key="'nextMonth' + day">{{ day }}</span>
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
            endDay: computed(() => new Date(state.currentYear, state.currentMonth + 1, 0).getDay())
        });

        state.currentMonth = state.today.getMonth();
        state.currentYear = state.today.getFullYear();
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
        };

        return {
            state,
            goNext,
            goPrev,
            selectDate
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
</style>
