<template>
    <div class="cardStats">
        <div class="cardStats__container">
            <span class="cardStats__teamName">{{ team }}</span>
            <div class="cardStats__statistics" v-for="(stats, index) in statistics" :key="index">
                <span>{{ stats.value || 0 }}</span>
                <div class="cardStats__bar">
                    <div class="cardStats__statsProgress" :style="{ width: convertStatsInWidth(stats.value) }" :data-id="index"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { watch, computed, ref } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";

    export default {
        props: {
            team: {
                type: String
            },
            statistics: {
                type: Object
            }
        },
        setup(props) {
            const sumOfStatistics = Object.values(props.statistics).reduce((a, b) => a.value + b.value);

            const convertStatsInWidth = stat => {
                return (stat * 100) / sumOfStatistics + "%";
            };

            return {
                convertStatsInWidth
            };
        }
    };
</script>

<style lang="scss" scoped>
    .cardStats {
        font-size: 14px;
        font-weight: 600;
        &__container {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 4px;
        }

        &__teamName {
            grid-column: 3/5;
            grid-row: 1;
            justify-self: center;
        }

        &__statistics {
            grid-column: 1/4;
            grid-row: 1;
            direction: rtl;

            &:last-of-type {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                grid-column: 4/-1;
                width: 100%;
                direction: ltr;
            }
        }

        &__bar {
            width: 100%;
            background-color: #e9e7e7;
            height: 8px;
        }

        &__statsProgress {
            height: 100%;
            background-color: var(--color-primary);
            z-index: 2;

            &[data-index="1"] {
                background-color: var(--color-bg--black);
            }
        }
    }
</style>
