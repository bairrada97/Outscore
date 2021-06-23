<template>
    <div class="matchBetsHelper">
        <ul class="matchBetsHelper__list" v-if="betsHelper">
            <li class="matchBetsHelper__item" v-for="(category, index) in betsHelper" :key="index">
                <h3 class="matchBetsHelper__title">{{ index }}</h3>
                <div class="matchBetsHelper__stats" v-for="(subCategory, index) in category" :key="index">
                    <CardStats :statistics="subCategory" :team="index" :lastGamesLength="lastGamesLength" />
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";
    import CardStats from "@/components/CardStats/CardStats.vue";
    import useH2H from "@/modules/useH2H";

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
            const { loadH2H, awayTeamH2H, homeTeamH2H, h2h } = useH2H();
            const getHomeTeamH2H = computed(() => store.getHomeTeamH2H());
            const getAwayTeamH2H = computed(() => store.getAwayTeamH2H());
            const lastGamesLength = 5;
            const betsHelper = computed(() => {
                const lasthomeGames = [...getHomeTeamH2H.value].filter((item, index) => index < lastGamesLength);
                const lastawayGames = [...getAwayTeamH2H.value].filter((item, index) => index < lastGamesLength);
                const uniqueMatches = [...new Map([...lasthomeGames, ...lastawayGames].map(item => [item.fixture.id, item])).values()];

                return uniqueMatches.reduce((acc, stats) => {
                    getGoals(acc, stats, 1.5);
                    getGoals(acc, stats, 2.5);
                    getGoals(acc, stats, 3.5);
                    getGoals(acc, stats, 4.5);
                    getGoals(acc, stats, 5.5);
                    getBothTeamsToScore(acc, stats);
                    getCleanSheet(acc, stats);

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

            const getBothTeamsToScore = (acc, stats) => {
                let homeTeam = computed(() => props.matchDetail.teams.home);
                let awayTeam = computed(() => props.matchDetail.teams.away);
                const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
                const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
                const goalsHome = stats.goals.home;
                const goalsAway = stats.goals.away;

                acc["Both Teams To Score"] = acc["Both Teams To Score"] || {};
                acc["Both Teams To Score"][`yes`] = acc["Both Teams To Score"][`yes`] || {};
                acc["Both Teams To Score"][`yes`].home = acc["Both Teams To Score"][`yes`].home || {};
                acc["Both Teams To Score"][`yes`].away = acc["Both Teams To Score"][`yes`].away || {};
                acc["Both Teams To Score"][`yes`].home.name = props.matchDetail.teams.home.name;
                acc["Both Teams To Score"][`yes`].away.name = props.matchDetail.teams.away.name;
                acc["Both Teams To Score"][`yes`].home.value = acc["Both Teams To Score"][`yes`].home.value || 0;
                acc["Both Teams To Score"][`yes`].away.value = acc["Both Teams To Score"][`yes`].away.value || 0;

                if (acc["Both Teams To Score"][`yes`].home.name == homeTeamSide?.name) {
                    if (goalsHome > 0 && goalsAway > 0) {
                        acc["Both Teams To Score"][`yes`].home.value++;
                    }
                }
                if (acc["Both Teams To Score"][`yes`].away.name == awayTeamSide?.name) {
                    if (goalsHome > 0 && goalsAway > 0) {
                        acc["Both Teams To Score"][`yes`].away.value++;
                    }
                }
            };

            const getCleanSheet = (acc, stats) => {
                let homeTeam = computed(() => props.matchDetail.teams.home);
                let awayTeam = computed(() => props.matchDetail.teams.away);
                const homeTeamSide = Object.values(stats.teams).find(team => team.id === homeTeam.value.id);
                const awayTeamSide = Object.values(stats.teams).find(team => team.id === awayTeam.value.id);
                const goalsHome = stats.goals.home;
                const goalsAway = stats.goals.away;

                acc["Clean Sheet"] = acc["Clean Sheet"] || {};
                acc["Clean Sheet"][`yes`] = acc["Clean Sheet"][`yes`] || {};
                acc["Clean Sheet"][`yes`].home = acc["Clean Sheet"][`yes`].home || {};
                acc["Clean Sheet"][`yes`].away = acc["Clean Sheet"][`yes`].away || {};
                acc["Clean Sheet"][`yes`].home.name = props.matchDetail.teams.home.name;
                acc["Clean Sheet"][`yes`].away.name = props.matchDetail.teams.away.name;
                acc["Clean Sheet"][`yes`].home.value = acc["Clean Sheet"][`yes`].home.value || 0;
                acc["Clean Sheet"][`yes`].away.value = acc["Clean Sheet"][`yes`].away.value || 0;

                if (acc["Clean Sheet"][`yes`].home.name == homeTeamSide?.name) {
                    if (goalsHome == 0) {
                        acc["Clean Sheet"][`yes`].home.value++;
                    }
                }
                if (acc["Clean Sheet"][`yes`].away.name == awayTeamSide?.name) {
                    if (goalsAway == 0) {
                        acc["Clean Sheet"][`yes`].away.value++;
                    }
                }
            };

            const { fetch, fetchState } = useFetch(async () => {
                await loadH2H(props.matchDetail.teams);
            });

            fetch();

            return {
                betsHelper,
                lastGamesLength,
                fetchState
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
        }

        &__item {
            display: grid;
            gap: 24px 0;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border: 1px solid rgba(183, 183, 183, 0.3);
        }

        &__stats {
            padding: 0 10px;
        }
    }
</style>
