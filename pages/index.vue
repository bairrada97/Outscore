<template>
    <div class="container">
        <!-- <Calendar></Calendar> -->
        <div @click="openGame(countryName)" v-for="(countryName, key) in groupedLeagues" :key="key">
            <h1>{{ key }}</h1>

            <div v-if="countryName == isShown">
                <div v-for="(leagueName, key) in isShown" :key="key">
                    <h2>{{ key }}</h2>
                    <Game :item="item" v-for="item in leagueName" :key="item.fixture.id"></Game>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // https://api-football-v3.herokuapp.com/api/v3/fixtures/?clearCache=all
    import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
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
            const isLoadingCountries = ref(false);
            const isShown = ref(false);
            const league = ref(null);
            const uniqueItems = reactive({});
            const groupedLeagues = computed(leagues => {
                return getLeagues.value.reduce((acc, game) => {
                    // if (!acc[game.league.country]) acc[game.league.country] = [];

                    // acc[game.league.country].push(game);
                    // acc[game.league.country] = acc[game.league.country] || {};
                    // acc[game.league.country].league = acc[game.league.name] || new Set();
                    // acc[game.league.country].league.add(game);
                    //   // if (!acc[game.league.country]) acc[game.league.country] = [];
                    let league = game.league.name;
                    // acc[game.league.country].push(game);
                    acc[game.league.country] = acc[game.league.country] || {};
                    acc[game.league.country][league] = acc[game.league.country][league] || new Set();
                    acc[game.league.country][league].add(game);
                    return acc;
                }, {});
            });

            const openGame = countryName => (isShown.value = countryName);
            // const {liveGames, error, loadLiveGames} = useLiveGames();
            // const { fetch, fetchState } = useFetch(async () =>  await loadLiveGames());
            const { games, error, loadGames } = useGamesByDate();
            const { fetch, fetchState } = useFetch(
                async () =>
                    await loadGames().then(() => {
                        getLeagues.value = games.value.response;
                    })
            );

            fetch();
            onActivated(() => fetch());
            const interval = setInterval(() => fetch(), 15000);
            console.log(groupedLeagues);
            return {
                games,
                fetchState,
                getLeagues,
                groupedLeagues,
                openGame,
                isShown
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
        width: 30px;
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
