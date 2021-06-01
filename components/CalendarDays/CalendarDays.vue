<template>
    <ul class="calendarDays">
        <li class="calendarDays__dayContainer" :class="[!liveToggle ? currentSelectedDayClass(day.getFullYear(), day.getMonth(), day.getDate()) : '', currentDateClass(day.getFullYear(), day.getMonth(), day.getDate())]" v-for="(day, index) in homepageFiveDays" :key="index" @click="selectDate(day.getFullYear(), day.getMonth(), day.getDate())">
            <span class="calendarDays__numericDay">{{ day.toLocaleDateString("default", { day: "numeric" }) }}</span>
            <span class="calendarDays__weekDay">{{ day.toLocaleDateString("default", { weekday: "short" }) }}</span>
        </li>
    </ul>
</template>

<script>
    import { watch, computed } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";

    export default {
        setup() {
            const { homepageFiveDays, selectDate, currentSelectedDayClass, currentDateClass, selectedDate } = useCalendar();
            const liveToggle = computed(() => store.getLiveToggle());

            watch(
                () => liveToggle,
                (newValue, prevValue) => {
                    console.log(liveToggle, newValue, prevValue);
                }
            );

            return {
                homepageFiveDays,
                selectDate,
                selectedDate,
                currentSelectedDayClass,
                liveToggle,
                currentDateClass
            };
        }
    };
</script>

<style lang="scss">
    .calendarDays {
        display: flex;
        align-items: center;
        cursor: pointer;

        &__dayContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;

            &.selectedDate {
                color: var(--color-primary);
                border-bottom: 1px solid var(--color-primary);
            }

            &.activeDay {
                color: var(--color-primary);
            }
        }

        &__numericDay {
            font-size: 20px;
        }

        &__weekDay {
            font-size: 12px;
        }
    }
</style>
