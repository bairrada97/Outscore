<template>
    <div class="container">
        <Calendar></Calendar>
        <button :class="{ active: isLive }" class="toggleLive" @click="toggleLive">Live</button>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <div @click="openGame(countryName)" v-for="(countryName, key) in displayOrderedGames" :key="key">
                <div class="country">
                    <img :src="countryName.image" alt="" />
                    <h1>{{ key }}</h1>
                </div>
                <div v-if="isLive">
                    <div v-for="(competition, key) in countryName.competitions" :key="key">
                        <h2>{{ key }}</h2>
                        <Game :item="item" v-for="item in competition" :key="item.fixture.id"></Game>
                    </div>
                </div>
                <div v-else>
                    <div v-if="countryName == isShown && isSelected">
                        <div v-for="(competition, key) in isShown.competitions" :key="key">
                            <h2>{{ key }}</h2>
                            <Game :item="item" v-for="item in competition" :key="item.fixture.id"></Game>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // https://api-football-v3.herokuapp.com/api/v3/fixtures/?clearCache=all
    import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed, watch } from "@nuxtjs/composition-api";
    import store from "@/store.js";
    import axios from "axios";
    import LazyHydrate from "vue-lazy-hydration";

    import useLiveGames from "../modules/useLiveGames";
    import useGamesByDate from "../modules/useGamesByDate";

export default defineComponent({
    components: {
        LazyHydrate,
        Game: () => import("@/components/Game.vue" /* webpackChunkName: "Game" */),
        Calendar: () => import("@/components/Calendar.vue" /* webpackChunkName: "Calendar" */)
    },
    setup() {
        const getLeagues = ref([]);
        const isShown = ref(null);
        const isSelected = ref(false);
        const selectedDate = computed(() => store.getSelectedDate());
        const sortGamesByCountryAndLeague = ref(null);
        const isLive = ref(false);
        const loading = ref(true);
        const { liveGames, loadLiveGames } = useLiveGames();
        const { games, loadGames } = useGamesByDate();
        const displayOrderedGames = computed(leagues => {
            sortGamesByCountryAndLeague.value = getLeagues.value.sort((a, b) => a.league.country.localeCompare(b.league.country) || a.league.id - b.league.id);
            return sortGamesByCountryAndLeague.value.reduce((acc, game) => {
                let league = game.league.name;
                acc[game.league.country] = acc[game.league.country] || {};
                acc[game.league.country].competitions = acc[game.league.country].competitions || {};
                acc[game.league.country].competitions[league] = acc[game.league.country].competitions[league] || new Set();
                acc[game.league.country].competitions[league].add(game);
                acc[game.league.country].image = game.league.flag;
                /* 
               acc[game.league.country][league] = acc[game.league.country][league] || new Set(); */
                    /*       acc[game.league.country][league]
               ;/ */

                    return acc;
                }, {});
            });

            const openGame = countryName => {
                delete countryName.image;
                countryName != isShown.value ? (isSelected.value = true) : (isSelected.value = !isSelected.value);
                isShown.value = countryName;
            };

            const toggleLive = () => {
                isLive.value = !isLive.value;
                if (!isLive.value) {
                    getLeagues.value = games.value.response;
                    return;
                }

            loading.value = true;
            loadLiveGames().then(() => {
                getLeagues.value = liveGames.value.response;
                loading.value = false;
            });
        };

        const { fetch, fetchState } = useFetch(
            async () =>
                await loadGames().then(() => {
                    getLeagues.value = games.value.response;
                    loading.value = false;
                });
            };

        watch(
            () => selectedDate.value,
            (count, prevCount) => {
                fetch();
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
                isLive,
                toggleLive,
                loading
            };
        }
    });
</script>

<style lang="scss">
    div {
        display: block;
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

    img {
        width: 15px;
        margin-right: 10px;
    }

    a {
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        color: #187c56;
    }

    span {
        font-size: 24px;

        &.goal {
            color: #7ccc15;
        }
    }
    .container {
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        padding: 0 10vw;
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
