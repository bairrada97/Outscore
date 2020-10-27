<template>
    <div class="container" v-if="singleGame">
        <header>
            <div>
                  <img :data-src="singleGame.league.country" alt="" title="" v-lazy-load>
  
                {{ singleGame.league.country }}
                {{ singleGame.league.name }}
                {{ singleGame.league.round }}
            </div>
            <div class="teamDisplay">
                <div class="teamInfo">
                    <img :data-src="singleGame.teams.home.logo" alt="" title="" v-lazy-load>

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
                           <img :data-src="singleGame.teams.away.logo" alt="" title="" v-lazy-load>
                  
                    <span>{{ singleGame.teams.away.name }}</span>
                </div>
            </div>
        </header>

        <div class="gameStatistics" v-if="singleStatisticsGame">
            <div v-for="statistic in singleStatisticsGame.response" :key="statistic.results">
                <ul v-for="stats in statistic.statistics" :key="stats.type">
                    <li>
                        <p class="type">{{ stats.type }}</p>
                        <p>{{ stats.value || 0 }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>There is no statistic available in this game</div>
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

        const useSingleGame = async () => {
            singleGame.value = store.getSpecificGame(query.value.fixture) || null;
            !singleGame.value ? await fetchGameById() : (singleGame.value = store.getSpecificGame(query.value.fixture));

            return { ...toRefs(singleGame.value) };
        };
        const useGameStatistic = async () => {
            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/fixtures/statistics?fixture=${query.value.fixture}`)
                .then(response => {
                    singleStatisticsGame.value = store.getGameStatistics();
                    const hasDataUpdated =
                        !singleStatisticsGame.value.cacheDate || response.data.cacheDate != singleStatisticsGame.value.cacheDate;

                    if (hasDataUpdated) store.setGameStatistics(response.data);
                })
                .then(() => {
                    singleStatisticsGame.value = store.getGameStatistics();
                });

            return { ...toRefs(singleStatisticsGame.value) };
        };
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
            singleStatisticsGame.value = await useGameStatistic();
        }); 

        onActivated(() => {
            fetch();
        });

        fetch();
 
        return {
            singleGame,
            singleStatisticsGame,
            fetchState
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
.teamDisplay {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
}

.time {
    margin-top: 50px;
}

.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
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
    }
}

.teamScore {
    font-size: 50px;
}

.gameStatistics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 0 100px;
    margin-top: 50px;

    li {
        display: flex;
        align-items: center;
        list-style: none;
        justify-content: space-between;

        font-weight: 700;
        border-bottom: 1px solid #333;
        padding: 10px;

        .type {
            margin-right: 50px;
            font-weight: 400;
        }
    }
}
</style>
