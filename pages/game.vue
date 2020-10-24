<template>
	<div class="container">
        <div class="league">
              <img class="flag" :src="game.league.flag" alt="">
              <span class="leagueCountry">{{game.league.country}}</span>
              <span  class="leagueName">{{game.league.name}}</span>
              <span class="leagueRound">{{game.league.round}}</span>
            </div>
        <div class="headerGame">
            <div class="team">
                <img :src="game.teams.away.logo" alt="">
                <span class="teamHome">{{game.teams.away.name}}</span>

                <div class="homeStatistics">
                   <!--  <ul v-for="gameHomeStatistic.value.statistics" :key="gameHomeStatistic.value.statistics" >
                        <li>
                            <span></span>
                        </li>
                    </ul> -->
                </div>
            </div>
            <div class="score">
                <span class="scoreAway">{{game.goals.away}}</span>
                <span class="scoreHome">{{game.goals.home}}</span>

            </div>
            <div class="team">
                <img :src="game.teams.home.logo" alt="">
                <span class="teamAway">{{game.teams.home.name}}</span>
            </div> 
        </div>
    
	</div> 
</template>

<script>
import {reactive, toRefs,ref,  onMounted,  useFetch, useContext } from "@nuxtjs/composition-api";

import store from '@/store.js'
import axios from 'axios'


 
export default {
	setup() {
        const {params} = useContext()
        const game = params.value.fixture && store.getSingleGame(params.value.fixture) ;
        const gameAwayStatistic = ref(null);
        const gameHomeStatistic = ref(null);
        		const { fetch, fetchState } = useFetch(async () => {
                    const awayStatisticEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures/statistics?fixture=${params.value.fixture}&team=${game.teams.away.id}`;
                    const homeStatisticEndpoint = `app.com/api/v3/fixtures/statistics?fixture=${params.value.fixture}&team=${game.teams.home.id}`;

                    await axios.all([axios.get(awayStatisticEndpoint), axios.get(homeStatisticEndpoint)]).then(
                        axios.spread((response1, response2) => {
                        gameHomeStatistic.value = response1;
                        gameAwayStatistic.value = response2;
                        console.log(gameHomeStatistic, gameAwayStatistic)
                        }),
                    );
                  

                        
	
		})

		// Manually trigger a refetch
		fetch() 

	

		// Access fetch error, pending and timestamp
		fetchState
        
		return {
			 game
		};
	},

};


</script>

<style>
div {
	display: block;
}

.leagueCountry{
    font-size: 40px;
}

.leagueName{
    font-size: 40px;
}

.leagueRound{
    font-size: 14px;
    display: block;
}

.league{
    margin-bottom: 50px;
}

.teamHome{
    font-size: 50px;
}

.teamAway{
    font-size: 50px;
}


.flag{
    width: 50px;
}

.headerGame {
	display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-around;
}

.team{
    display: flex;
    flex-direction: column;
}

.score{
    margin:0 30px;
   
}

.scoreAway{
    margin-right: 20px;
}

.scoreHome{
    margin-left: 20px;
}


 span{
        font-size: 40px;
    }

</style>
