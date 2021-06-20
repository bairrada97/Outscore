<template>
    <div class="matchBetsHelper">
        <ul class="matchBetsHelper__list">
            <li class="matchBetsHelper__item" v-for="(category, index) in betsHelper" :key="index">
                <h3 class="matchBetsHelper__title">{{ index }}</h3>
                <div class="matchBetsHelper__stats" v-for="(subCategory, index) in category" :key="index">
                    <CardStats :statistics="subCategory" :team="index" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { reactive, watch, computed, ref, onMounted } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";
    import CardStats from "@/components/CardStats/CardStats.vue";

    export default {
        components: {
            CardStats
        },
        props: {
            matchDetail: {
                type: Object
            }
        },
        setup(props) {
            const getHomeTeamH2H = computed(() => store.getHomeTeamH2H());
            const getAwayTeamH2H = computed(() => store.getAwayTeamH2H());

            const betsHelper = computed(() => {
                const lasthomeGames = [...getHomeTeamH2H.value].filter((item, index) => index < 5);
                const lastawayGames = [...getAwayTeamH2H.value].filter((item, index) => index < 5);
                const join = [...lasthomeGames, ...lastawayGames].filter((thing, index, self) => self.findIndex(t => t.fixture.id === t.fixture.id) != index);

                return join.reduce((acc, stats) => {
                    getGoals(acc, stats, 1.5);
                    getGoals(acc, stats, 2.5);
                    getGoals(acc, stats, 3.5);
                    getGoals(acc, stats, 4.5);
                    getGoals(acc, stats, 5.5);

                    return acc;
                }, {});
            });

            const getGoals = (acc, stats, value) => {
                let homeTeam = computed(() => props.matchDetail.teams.home);
                let awayTeam = computed(() => props.matchDetail.teams.away);
                const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
                const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
                const goalsInGame = stats.goals.home + stats.goals.away;

                acc["goals"] = acc["goals"] || {};
                acc["goals"][`+${value}`] = acc["goals"][`+${value}`] || {};
                acc["goals"][`+${value}`].home = acc["goals"][`+${value}`].home || {};
                acc["goals"][`+${value}`].away = acc["goals"][`+${value}`].away || {};
                acc["goals"][`+${value}`].home.name = props.matchDetail.teams.home.name;
                acc["goals"][`+${value}`].away.name = props.matchDetail.teams.away.name;
                acc["goals"][`+${value}`].home.value = acc["goals"][`+${value}`].home.value || 0;
                acc["goals"][`+${value}`].away.value = acc["goals"][`+${value}`].away.value || 0;

                if (acc["goals"][`+${value}`].home.name == homeTeamSide?.name) {
                    if (goalsInGame > value) {
                        acc["goals"][`+${value}`].home.value++;
                    }
                }
                if (acc["goals"][`+${value}`].away.name == awayTeamSide?.name) {
                    if (goalsInGame > value) {
                        acc["goals"][`+${value}`].away.value++;
                    }
                }
            };

            return {
                betsHelper
            };
        }
    };
</script>

<style lang="scss" scoped>
    .matchBetsHelper {
        margin-top: 16px;

        &__title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px 16px;
            background-color: #dadada;
            grid-column: 1/-1;
        }

        &__list {
            border: 1px solid rgba(183, 183, 183, 0.3);
        }

        &__item {
            display: grid;
            gap: 24px 0;
            margin-bottom: 16px;
        }

        &__stats {
            padding: 0 10px;
        }
    }
</style>
