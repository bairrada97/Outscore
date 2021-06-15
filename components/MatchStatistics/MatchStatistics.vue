<template>
    <div class="matchStatistics">
        <ul class="matchStatistics__list">
            <li v-for="(teams, index) in displayStatistics" :key="index">
                <CardStats :statistics="teams" :team="index" />
            </li>
        </ul>
    </div>
</template>

<script>
    import { reactive, watch, computed, ref, onMounted } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";

    export default {
        components: {
            CardStats: () => import("@/components/CardStats/CardStats.vue" /* webpackChunkName: "CardStats" */)
        },
        props: {
            matchDetail: {
                type: Object
            }
        },
        setup(props) {
            const displayStatistics = computed(() => {
                return props.matchDetail.statistics?.reduce((acc, stats) => {
                    stats.statistics.forEach(stat => {
                        acc[stat.type] = acc[stat.type] || {};

                        acc[stat.type].home = acc[stat.type].home || {};
                        acc[stat.type].away = acc[stat.type].away || {};
                        acc[stat.type].home.name = props.matchDetail.teams.home.name;
                        acc[stat.type].away.name = props.matchDetail.teams.away.name;
                        if (acc[stat.type].home.name == stats.team.name) acc[stat.type].home.value = stat.value;
                        if (acc[stat.type].away.name == stats.team.name) acc[stat.type].away.value = stat.value;
                    });

                    return acc;
                }, {});
            });

            return {
                displayStatistics
            };
        }
    };
</script>

<style lang="scss" scoped>
    .matchStatistics {
        padding: 24px 16px;

        &__list {
            display: grid;
            gap: 24px 0;
        }
    }
</style>
