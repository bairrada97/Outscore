<template>
    <div class="container">
        <Calendar />
        <CalendarBar />
        <div v-if="loading">Loading...</div>
        <div v-else>
            <h2 class="leagueTypes">National Leagues</h2>
            <div @click="openGame(countryName)" v-for="(countryName, key) in displayOrderedGames" :key="key">
                <CardCountry v-if="countryName" :country="countryName" :name="key" :isOpen="countryName == isShown && isSelected ? 'isOpen' : ''">
                    <div v-if="liveToggle" class="align--full">
                        <div v-for="(competition, key) in countryName.competitions" :key="key">
                            <CardLeague :name="key" :league="competition" />
                            <CardGame :game="game" v-for="game in competition" :key="game.fixture.id" />
                        </div>
                    </div>
                    <div v-else class="align--full">
                        <div v-if="countryName == isShown && isSelected">
                            <div v-for="(competition, key) in isShown.competitions" :key="key">
                                <CardLeague :name="key" :league="competition" />
                                <CardGame :game="game" v-for="game in competition" :key="game.fixture.id" />
                            </div>
                        </div>
                    </div>
                </CardCountry>
            </div>
        </div>
        <a class="clearCacheButton" target="_blank" href="https://api-football-v3.herokuapp.com/api/v3/fixtures/?clearCache=all">Clear Cache</a>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed, watch } from "@nuxtjs/composition-api";
    import store from "@/store.js";
    import axios from "axios";
    import LazyHydrate from "vue-lazy-hydration";

    import useLiveGames from "../modules/useLiveGames";
    import useGamesByDate from "../modules/useGamesByDate";

    export default defineComponent({
        components: {
            LazyHydrate,
            Calendar: () => import("@/components/Calendar/Calendar.vue" /* webpackChunkName: "Calendar" */),
            CalendarBar: () => import("@/components/CalendarBar/CalendarBar.vue" /* webpackChunkName: "Calendar" */),
            CardCountry: () => import("@/components/CardCountry/CardCountry.vue" /* webpackChunkName: "CardCountry" */),
            CardLeague: () => import("@/components/CardLeague/CardLeague.vue" /* webpackChunkName: "CardLeague" */),
            CardGame: () => import("@/components/CardGame/CardGame.vue" /* webpackChunkName: "CardGame" */),
            Game: () => import("@/components/Game.vue" /* webpackChunkName: "Game" */)
        },
        setup() {
            const getLeagues = ref([]);
            const isShown = ref(null);
            const isSelected = ref(false);
            const selectedDate = computed(() => store.getSelectedDate());
            const sortGamesByCountryAndLeague = ref(null);
            const loading = ref(true);
            const liveToggle = computed(() => store.getLiveToggle());
            const { liveGames, loadLiveGames } = useLiveGames();
            const { games, loadGames } = useGamesByDate();
            const displayOrderedGames = computed(leagues => {
                sortGamesByCountryAndLeague.value = getLeagues.value?.sort((a, b) => a.league.country.localeCompare(b.league.country) || a.league.id - b.league.id);
                return sortGamesByCountryAndLeague.value?.reduce((acc, game) => {
                    let league = game.league.name;
                    let isGameLive = game.fixture.status.short == "1H" || game.fixture.status.short == "2H";
                    acc[game.league.country] = acc[game.league.country] || {};

                    acc[game.league.country].competitions = acc[game.league.country].competitions || {};
                    acc[game.league.country].competitions[league] = acc[game.league.country].competitions[league] || new Set();
                    acc[game.league.country].competitions[league].add(game);
                    acc[game.league.country].image = game.league.flag;

                    let getNumberOfGamesOfEachCompetition = Object.keys(acc[game.league.country].competitions).map(k => acc[game.league.country].competitions[k].size);
                    let getTotalGamesLengthForEachCountry = getNumberOfGamesOfEachCompetition.reduce((a, b) => a + b, 0);
                    acc[game.league.country].totalGames = getTotalGamesLengthForEachCountry;

                    let getNumberOfLiveGamesOfEachCompetition = Object.keys(acc[game.league.country].competitions)
                        .map(k => {
                            return [...acc[game.league.country].competitions[k]].filter(game => {
                                return game.fixture.status.short == "1H" || game.fixture.status.short == "2H" || game.fixture.status.short == "HT";
                            });
                        })
                        .flat(Infinity)
                        .filter(a => a != "");
                    let getTotalLiveGamesLengthForEachCountry = [...getNumberOfLiveGamesOfEachCompetition].length;

                    acc[game.league.country].totalLiveGames = getTotalLiveGamesLengthForEachCountry;

                    return acc;
                }, {});
            });

            const openGame = countryName => {
                delete countryName.image;
                countryName != isShown.value ? (isSelected.value = true) : (isSelected.value = !isSelected.value);
                isShown.value = countryName;
            };

            const toggleLive = () => {
                if (!liveToggle.value) {
                    getLeagues.value = games.value.response;
                    return;
                }

                loading.value = true;
                loadLiveGames().then(() => {
                    getLeagues.value = liveGames.value.response;
                    loading.value = false;
                });
            };

            const { fetch, fetchState } = useFetch(async () => {
                loading.value = true;

                await loadGames().then(() => {
                    getLeagues.value = games.value.response;
                    loading.value = false;
                });
            });

            watch(
                () => [selectedDate.value, liveToggle.value],
                (newValue, prevValue) => {
                    const dateHasChanged = newValue[0] != prevValue[0];

                    liveToggle.value && !dateHasChanged ? toggleLive() : fetch();
                    dateHasChanged ? fetch() : "";
                }
            );

            fetch();
            /*     onActivated(() => fetch());
            const interval = setInterval(() => fetch(), 15000); */

            return {
                games,
                fetchState,
                getLeagues,
                displayOrderedGames,
                openGame,
                isShown,
                isSelected,
                loading,
                liveToggle
            };
        }
    });
</script>

<style lang="scss">
    .clearCacheButton {
        position: absolute;
        top: 50px;
        left: 50px;
        border: 1px solid #212121;
        padding: 8px;
    }
    div {
        display: block;
    }

    .leagueTypes {
        font-size: 14px;
        font-weight: 600;
        margin-top: 16px;
        height: 40px;
        padding-left: 32px;
        display: flex;
        align-items: center;
    }

    .ze {
        margin-bottom: 10px;
    }

    .toggleLive {
        all: unset;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        border: 1px solid #187c56;
        border-radius: 50%;
        outline-color: none;
        height: 40px;
        margin-top: 30px;
        background: transparent;
        &.active {
            background: #187c56;
            color: white;
        }
    }
    .country {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    h2 {
        font-size: 16px;
    }
    .teams {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        width: 100%;
        border-bottom: 1px solid #187c56;
        padding: 20px 0;
    }

    .homeTeam,
    .awayTeam {
        display: grid;

        .detail {
            grid-row: 1;
        }

        .goal {
            grid-row: 1;
            justify-self: flex-end;
        }
    }
    .time {
        grid-row: 1/3;
        align-self: center;
        margin-left: 20px;
    }
    .homeTeam {
        grid-column: 1;
        grid-row: 1;
    }

    .awayTeam {
        grid-row: 2;
        grid-column: 1;
    }

    a {
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        color: #187c56;
    }

    .container {
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        padding: 0 1%;
        flex-direction: column;
    }

    .title {
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        display: block;
        font-weight: 300;
        font-size: 100px;
        color: #35495e;
        letter-spacing: 1px;
    }

    .subtitle {
        font-weight: 300;
        font-size: 42px;
        color: #526488;
        word-spacing: 5px;
        padding-bottom: 15px;
    }

    .links {
        padding-top: 15px;
    }
</style>
