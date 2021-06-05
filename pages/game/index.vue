<template>
    <div class="container" v-if="singleGame">
        <header>
            <div>
                <img :data-src="singleGame.league.country" alt="" title="" v-lazy-load />

                {{ singleGame.league.country }}
                {{ singleGame.league.name }}
                {{ singleGame.league.round }}
            </div>
            <div class="teamDisplay">
                <div class="teamInfo">
                    <img :data-src="singleGame.teams.home.logo" alt="" title="" v-lazy-load />

                    <span>{{ singleGame.teams.home.name }}</span>
                </div>

                <div class="teamScore">
                    <div class="time">
                        <span>{{ singleGame.fixture.status.elapsed }}'</span>
                        <span>{{ singleGame.fixture.status.short }}</span>
                    </div>
                    {{ singleGame.goals.home }}
                    -
                    {{ singleGame.goals.away }}
                </div>
                <div class="teamInfo">
                    <img :data-src="singleGame.teams.away.logo" alt="" title="" v-lazy-load />

                    <span>{{ singleGame.teams.away.name }}</span>
                </div>
            </div>
        </header>
        <div>
            <button @click="openEvents">Sumary</button>
            <button @click="openStatistics">Statistics</button>
            <button @click="openLineups">Lineups</button>
            <button @click="openH2H">H2H</button>
            <button @click="openStandings">Standings</button>
        </div>

        <div class="gameSummary" v-if="singleGame.events && isEventsOpen">
            <div class="half" :data-half="key" v-for="(half, key) in displayEvents" :key="key">
                <p>{{ key }}</p>
                <div class="gameSummary__teams">
                    <div :data-team="key" v-for="(teams, key) in half.teams" class="singleTeam" :key="key">
                        <div class="gameSummary__events" v-for="(events, key) in teams" :key="key">
                            <p class="gameSummary__events--time">{{ events.time.elapsed }}'</p>
                            <p class="gameSummary__events--type">{{ events.type == "Card" ? events.detail : events.type }}</p>
                            <p class="gameSummary__events--player">{{ events.player.name }}</p>
                        </div>
                    </div>
                </div>

                <!--  <div v-for="(half, index) in displayEvents.value" :key="index"></div>
                <div>{{ events.detail }}</div>
                <div>{{ events.time.elapsed }}</div>
                <div>{{ events.player.name }}</div> -->
            </div>
        </div>

        <div class="gameStatistics" v-if="singleGame.statistics && isStatisticsOpen">
            <div v-for="(statistic, index) in singleGame.statistics" :key="index">
                <ul v-for="stats in statistic.statistics" :key="stats.type">
                    <li>
                        <p class="type">{{ stats.type }}</p>
                        <p>{{ stats.value || 0 }}</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="lineups" v-if="singleGame.lineups && isLineupsOpen">
            <div class="lineupsContainer" v-for="(lineups, index) in singleGame.lineups" :key="index">
                <div>
                    <span>formation</span>
                    <div class="formation">
                        <span v-for="(formation, index) in lineups.formation" :key="index">
                            {{ formation }}
                        </span>
                    </div>
                </div>

                <ul class="lineupsPlayer" v-for="startXI in lineups.startXI" :key="startXI.type">
                    <li>{{ startXI.player.name }}</li>
                    <li>{{ startXI.player.number }}</li>
                </ul>
            </div>
        </div>

        <div class="h2h" v-if="isH2hOpen">
            <div v-if="!isLoading">
                <div class="previousHomeTeamGames">
                    <h2>previous {{ singleGame.teams.home.name }} Games</h2>
                </div>
                <div class="previousAwayTeamGames">
                    <h2>previous {{ singleGame.teams.away.name }} Games</h2>
                </div>
                <div class="H2H">
                    <h2>H2H</h2>
                </div>
            </div>
            <div v-else>
                <p>...Loading</p>
            </div>
        </div>

        <div class="standings" v-if="singleGameStandings && isStandingsOpen">
            <div class="standings__team">
                <div>#</div>
                <div>Team</div>
                <div class="standings__teamMatchInfo">
                    <span>P</span>
                    <span>W</span>
                    <span>D</span>
                    <span>L</span>
                </div>
                <div>Pts</div>
            </div>
            <div class="standings__team" v-for="(standings, index) in singleGameStandings.league.standings[0]" :key="index">
                <div>{{ standings.rank }}º</div>
                <div class="standings__teamInfo">
                    <img :src="standings.team.logo" />
                    <div>{{ standings.team.name }}</div>
                </div>
                <div>
                    <span>{{ standings.all.played }}</span>
                    <span>{{ standings.all.win }}</span>
                    <span>{{ standings.all.draw }}</span>
                    <span>{{ standings.all.lose }}</span>
                </div>
                <div>pts:{{ standings.points }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { reactive, toRefs, ref, onMounted, useFetch, useContext, onActivated, computed, onDeactivated, watch } from "@nuxtjs/composition-api";

    import store from "@/store.js";
    import axios from "axios";

    export default {
        components: {},
        setup() {
            const { query } = useContext();
            const singleGame = ref(null);
            const singleGameH2H = ref(null);
            const singleGameStandings = ref(null);
            const singleStatisticsGame = ref(null);
            let isEventsOpen = ref(true);
            let isStatisticsOpen = ref(false);
            let isLineupsOpen = ref(false);
            let isH2hOpen = ref(false);
            let isStandingsOpen = ref(false);
            let previousHomeTeamGames = ref(null);
            let previousAwayTeamGames = ref(null);
            let homeTeam = computed(() => singleGame.value.teams.home);
            let awayTeam = computed(() => singleGame.value.teams.away);
            let isLoading = ref(true);
            const openEvents = () => {
                isEventsOpen.value = true;
                isStatisticsOpen.value = false;
                isLineupsOpen.value = false;
                isH2hOpen.value = false;
                isStandingsOpen.value = false;
            };
            const openStatistics = () => {
                isEventsOpen.value = false;
                isStatisticsOpen.value = true;
                isLineupsOpen.value = false;
                isH2hOpen.value = false;
                isStandingsOpen.value = false;
            };

            const getMatchCondition = (id, fixture) => {
                const isAwayOrHome = Object.values(fixture.teams).find(item => item.id == id);
                const opponentIsAwayOrHome = Object.values(fixture.teams).find(item => item.id != id);

                if (isAwayOrHome?.winner) {
                    return 1;
                } else if (opponentIsAwayOrHome?.winner) {
                    return 0;
                } else {
                    return -1;
                }
            };

            const openLineups = () => {
                isEventsOpen.value = false;
                isStatisticsOpen.value = false;
                isLineupsOpen.value = true;
                isH2hOpen.value = false;
                isStandingsOpen.value = false;
            };

            const openH2H = async () => {
                isEventsOpen.value = false;
                isStatisticsOpen.value = false;
                isLineupsOpen.value = false;
                isH2hOpen.value = true;
                isStandingsOpen.value = false;

                await useH2H();
            };

            const openStandings = async () => {
                isEventsOpen.value = false;
                isStatisticsOpen.value = false;
                isLineupsOpen.value = false;
                isH2hOpen.value = false;
                isStandingsOpen.value = true;

                await useStandings();
            };

            const useH2H = async () => {
                const h2hEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures/headtohead?h2h=${homeTeam.value.id}-${awayTeam.value.id}&last=6`;
                const awayTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${awayTeam.value.id}&last=6`;
                const homeTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${homeTeam.value.id}&last=6`;
                const fetchURL = url => axios.get(url);

                const promiseArray = [h2hEndpoint, homeTeamEndpoint].map(fetchURL);

                Promise.all(promiseArray)
                    .then(responses => {
                        isLoading.value = false;
                        singleGameH2H.value = responses[0].data.response.filter((item, index) => index != 0);
                        previousHomeTeamGames.value = responses[1].data.response.filter((item, index) => index != 0);
                    })
                    .then(() => {
                        axios.get(awayTeamEndpoint).then(response => {
                            previousAwayTeamGames.value = response.data.response.filter((item, index) => index != 0);
                        });
                    })
                    .catch(err => {});
            };

            const useStandings = async () => {
                await axios.get(`https://api-football-v3.herokuapp.com/api/v3/standings?league=${singleGame.value.league.id}&season=${singleGame.value.league.season}`).then(response => {
                    singleGameStandings.value = response.data.response[0];
                });
            };

            const useSingleGame = async () => {
                await fetchGameById();
                singleGame.value = store.getSingleGame();

                return { ...toRefs(singleGame.value) };
            };
            const displayEvents = computed(leagues => {
                return singleGame.value.events?.reduce((acc, event) => {
                    let team = event.team.name;
                    let homeTeam = computed(() => singleGame.value.teams.home);
                    let awayTeam = computed(() => singleGame.value.teams.away);
                    event.time.elapsed <= 45 ? (acc.firstHalf = acc.firstHalf || {}) : (acc.secondHalf = acc.secondHalf || {});
                    if (event.time.elapsed <= 45) {
                        acc.firstHalf["teams"] = acc.firstHalf["teams"] || {};
                        acc.firstHalf.teams[homeTeam.value.name] = acc.firstHalf.teams[homeTeam.value.name] || new Set();
                        acc.firstHalf.teams[awayTeam.value.name] = acc.firstHalf.teams[awayTeam.value.name] || new Set();

                        event.team.id == homeTeam.value.id ? acc.firstHalf.teams[homeTeam.value.name].add(event) : acc.firstHalf.teams[awayTeam.value.name].add(event);
                    } else {
                        acc.secondHalf["teams"] = acc.secondHalf["teams"] || {};
                        acc.secondHalf.teams[homeTeam.value.name] = acc.secondHalf.teams[homeTeam.value.name] || new Set();
                        acc.secondHalf.teams[awayTeam.value.name] = acc.secondHalf.teams[awayTeam.value.name] || new Set();
                        event.team.id == homeTeam.value.id ? acc.secondHalf.teams[homeTeam.value.name].add(event) : acc.secondHalf.teams[awayTeam.value.name].add(event);
                    }

                    return acc;
                }, {});
            });

            const fetchGameById = async () => {
                await axios.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${query.value.fixture}`).then(response => {
                    store.setSingleGame(response.data.response[0]);
                });
            };

            const { fetch, fetchState } = useFetch(async () => {
                singleGame.value = await useSingleGame();
                /* singleStatisticsGame.value = await useGameStatistic(); */
            });

            onActivated(() => {
                fetch();
            });

            watch(
                () => query.value.fixture,
                async (count, prevCount) => {
                    openEvents();
                    await fetch();
                    /*  await useStandings();
                await useH2H(); */
                }
            );

            onDeactivated(() => {
                openEvents();
                isLoading.value = true;
            });
            fetch();

            return {
                singleGame,
                singleStatisticsGame,
                fetchState,
                openEvents,
                openLineups,
                openStatistics,
                isStatisticsOpen,
                isLineupsOpen,
                isEventsOpen,
                isStandingsOpen,
                openH2H,
                openStandings,
                displayEvents,
                isH2hOpen,
                singleGameH2H,
                previousHomeTeamGames,
                previousAwayTeamGames,
                isLoading,
                singleGameStandings,
                getMatchCondition
            };
        }
    };
</script>

<style lang="scss" scoped>
    div {
        font-size: 20px;
    }

    button {
        font-size: 12px;
    }
    header {
        width: 100%;
    }

    .formation {
        display: flex;
        justify-content: center;
    }
    .teamDisplay {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        margin-top: 50px;
    }
    .h2h {
        width: 100%;
    }

    .time {
        margin-bottom: 20px;
        margin-left: 0;
    }

    .lineups {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0 10px;
        margin-top: 50px;
        justify-content: space-between;

        ul {
            padding: 0;
            display: flex;
            justify-content: space-between;
        }

        li {
            display: flex;
            align-items: center;
            list-style: none;
            justify-content: space-between;

            padding: 10px;
            font-size: 14px;
            text-align: left;
        }
    }

    .gameSummary {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        margin-top: 20px;

        .half {
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
        }

        &__teams {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            p {
                font-size: 12px;
            }
        }

        &__events {
            display: flex;

            .singleTeam:last-of-type & {
                flex-direction: row-reverse;

                &--type {
                    margin-left: 0;
                    margin-right: 10px;
                }
            }
            &--type {
                font-weight: 700;
                margin-left: 10px;
                margin-right: 0;
            }
        }
    }
    .container {
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        align-items: center;
        text-align: center;
        padding: 0 10vw;
        flex-direction: column;
    }
    .teamInfo {
        display: flex;
        align-items: center;
        flex-direction: column;

        span {
            margin-top: 20px;
            font-weight: 700;
            font-size: 16px;
        }
    }

    .teamScore {
        font-size: 24px;
    }

    .gameStatistics {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0 10px;
        margin-top: 50px;
        justify-content: space-between;

        ul {
            padding: 0;
        }

        li {
            display: flex;
            align-items: center;
            list-style: none;
            justify-content: space-between;
            font-weight: 700;
            border-bottom: 1px solid #333;
            padding: 10px;

            .type {
                margin-right: 5%;
                font-weight: 400;
                font-size: 14px;
                text-align: left;
            }
        }
    }

    .winCondition {
        display: flex;
        flex-direction: column;
        justify-content: center;
        &.green {
            color: green;
        }

        &.red {
            color: red;
        }
        &.yellow {
            color: yellow;
        }
    }

    .standings {
        width: 100%;
        div {
            font-size: 12px;
        }
        &__team {
            display: grid;
            grid-template-columns: 20px 160px 1fr 40px;
            justify-content: space-between;
        }
        &__teamMatchInfo {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &__teamInfo {
            display: flex;

            img {
                width: 20px;
            }
        }
    }
</style>
