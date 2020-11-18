import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const getClosestMonths = ref([{}, {}, {}]);
    const state = reactive({
        weekNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        today: new Date(),
        currentMonth: computed(() => state.today.getMonth()),
        currentYear: computed(() => state.today.getFullYear()),
        currentDate: computed(() => new Date(state.currentYear, state.currentMonth, state.today.getDate())),
        selectedDate: null,
        initialX: null,
        initialY: null,
        currentX: 0,
        currentY: 0,
        diffX: 0,
        diffY: 0,
        isDragging: false,
        isStartTouch: false,
        transform: 100
    });

    store.setFormatDate(state.currentYear, state.currentMonth, state.today.getDate());
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
        if (!!year && !!month && !!day) state.selectedDate = new Date(year, month, day); //if clicked on a day from next Month

        getClosestMonths.value.shift();

        translateCalendarToRight();

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
    };
    const goPrev = (year, month, day) => {
        if (!!year && !!month && !!day) state.selectedDate = new Date(year, month, day);

        getClosestMonths.value.pop();
        translateCalendarToLeft();
    };

    const translateCalendarToRight = () => {
        const $calendarContainer = document.querySelector(".calendarContainer");
        $calendarContainer.style.transition = "transform 0.4s ease";
        $calendarContainer.style.transform = `translateX(-100vw)`;
        $calendarContainer.style.marginLeft = `0`;
        $calendarContainer.addEventListener("transitionend", resetTransition);
    };
    const translateCalendarToLeft = () => {
        const $calendarContainer = document.querySelector(".calendarContainer");
        $calendarContainer.style.transition = "transform 0.4s ease";
        $calendarContainer.style.transform = `translateX(100vw)`;
        $calendarContainer.style.marginLeft = `-100vw`;
        $calendarContainer.addEventListener("transitionend", goPreviousMonth);
    };
    const resetTransition = e => {
        const $calendarContainer = document.querySelector(".calendarContainer");
        $calendarContainer.style.transition = "none";
        $calendarContainer.style.transform = `translateX(0)`;
        $calendarContainer.style.marginLeft = `-100vw`;
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
        return calenderFullDate === state.currentDate.toDateString() ? "activeDay" : "";
    };

    const currentSelectedDayClass = (year, month, day) => {
        const clickedDay = new Date(year, month, day).toDateString();

        return clickedDay === state.selectedDate?.toDateString() ? "selectedDate" : "";
    };

    const userNotStartedDrag = () => state.initialX === null || state.initialY === null || !state.isStartTouch;
    const userSlideYCoordinate = () => Math.abs(state.diffX) < Math.abs(state.diffY);
    const userSlideToRight = () => state.diffX > 0;
    const translateCalendar = calendar => {
        if (userSlideYCoordinate()) return;
        userSlideToRight() ? (calendar.style.transform = `translate3d(-${state.diffX}px, 0, 0) `) : (calendar.style.transform = `translate3d(${-state.diffX}px, 0, 0) `);
    };

    const setSliderValues = event => {
        state.isDragging = true;
        state.currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        state.currentY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        state.diffX = state.initialX - state.currentX;
        state.diffY = state.initialY - state.currentY;
    };

    const startTouch = event => {
        state.initialX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        state.initialY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        state.isStartTouch = true;
    };
    const moveTouch = event => {
        const $calendarContainer = event.currentTarget.querySelector(".calendarContainer");
        if (userNotStartedDrag()) return;

        setSliderValues(event);
        translateCalendar($calendarContainer);

        event.preventDefault();
    };

    const touchEnd = () => {
        state.isStartTouch = false;
        if (!state.isDragging) return;
        if (userSlideYCoordinate()) return;

        userSlideToRight() ? goNext() : goPrev();

        state.isDragging = false;
    };

    const isTargetCalendar = event => event.target.closest(".calendarContainer");
    onMounted(() => {
        const body = document.querySelector("body");
        body.addEventListener("touchstart", event => (isTargetCalendar ? startTouch(event) : ""), { passive: false });
        body.addEventListener("mousedown", event => (isTargetCalendar ? startTouch(event) : ""), { passive: false });

        body.addEventListener("touchmove", event => (isTargetCalendar ? moveTouch(event) : ""), { passive: false });
        body.addEventListener("mousemove", event => (isTargetCalendar ? moveTouch(event) : ""), { passive: false });

        body.addEventListener("mouseup", event => (isTargetCalendar ? touchEnd(event) : ""), { passive: false });
        body.addEventListener("touchend", event => (isTargetCalendar ? touchEnd(event) : ""), { passive: false });
    });
    return {
        currentSelectedDayClass,
        currentDateClass,
        selectDate,
        goNext,
        goPrev,
        getClosestMonths,
        ...toRefs(state)
    };
}