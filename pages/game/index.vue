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
            <button @click="openStatistics">Statistics</button>
            <button @click="openLineups">Lineups</button>
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

        <div class="lineups" v-if="isLineupsOpen">
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
    </div>
</template>
 
<script>
import { reactive, toRefs, ref, onMounted, useFetch, useContext, onActivated } from "@nuxtjs/composition-api";

import store from "@/store.js";
import axios from "axios";

export default {
    setup() {
        const { query } = useContext();
        const singleGame = ref(null);
        const singleStatisticsGame = ref(null);
        let isStatisticsOpen = ref(false);
        let isLineupsOpen = ref(false);

        const openStatistics = () => {
            isStatisticsOpen.value = true;
            isLineupsOpen.value = false;
        };

        const openLineups = () => {
            isStatisticsOpen.value = false;
            isLineupsOpen.value = true;
        };

        const useSingleGame = async () => {
            singleGame.value = store.getSingleGame();
            await fetchGameById();
            /*  !Object.keys(singleGame.value).length ? await fetchGameById() : (singleGame.value = store.getSingleGame()); */
            console.log(singleGame);
            return { ...toRefs(singleGame.value) };
        };
        /*   const useGameStatistic = async () => {
            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/fixtures/statistics?fixture=${query.value.fixture}`)
                .then(response => {
                    singleStatisticsGame.value = store.getGameStatistics();
                    const hasDataUpdated = !singleStatisticsGame.value.cacheDate || response.data.cacheDate != singleStatisticsGame.value.cacheDate;

                    if (hasDataUpdated) store.setGameStatistics(response.data);
                })
                .then(() => {
                    singleStatisticsGame.value = store.getGameStatistics();
                });

            return { ...toRefs(singleStatisticsGame.value) };
        }; */

        const fetchGameById = async () => {
            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${query.value.fixture}`)
                .then(response => {
                    store.setSingleGame(response.data.response[0]);
                })
                .then(() => {
                    singleGame.value = store.getSingleGame();
                });
        };

        const { fetch, fetchState } = useFetch(async () => {
            singleGame.value = await useSingleGame();
            /* singleStatisticsGame.value = await useGameStatistic(); */
        });

        onActivated(() => {
            fetch();
        });

        fetch();

        return {
            singleGame,
            singleStatisticsGame,
            fetchState,
            openLineups,
            openStatistics,
            isStatisticsOpen,
            isLineupsOpen
        };
    }
};
</script>

<style lang="scss" scoped>
div {
    font-size: 20px;
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
</style>
