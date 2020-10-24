<template>
	<div class="container" >
 <header >
           <div>
               <img  :src="game.league.country + '?webp'" alt="">
         
               {{game.league.country}}
               {{game.league.name}}
               {{game.league.round}}
           </div>
           <div class="teamDisplay">
               <div class="teamInfo">
                    <img :src="game.teams.away.logo + '?webp'" alt="">

                    <span>{{game.teams.away.name}}</span>
               </div>
               <div class="teamScore">
                    {{game.goals.home}}
                    -
                    {{game.goals.away}}
               </div>
               <div class="teamInfo">
                   <img :src="game.teams.home.logo + '?webp'" alt="">
                    <span>{{game.teams.home.name}}</span>
               </div>
          

           </div> 
       </header>


        <div class="gameStatistics"  v-if="gameStatistics && gameStatistics.results">
            <div v-for="statistic in gameStatistics.response" :key="statistic.results">
                <ul v-for="stats in statistic.statistics" :key="stats.type">
                    <li>
                        <p class="type">{{stats.type}}</p>
                            <p>{{stats.value}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>There is no statistic available in this game</div>
   
    
	</div> 
</template>

<script>
import {reactive, toRefs,ref,  onMounted,  useFetch, useContext } from "@nuxtjs/composition-api";

import store from '@/store.js'
import axios from 'axios'


 
export default {

	setup() {
        const {query} = useContext()
        const game = ref(null)
        const gameStatistics = ref(null);
        game.value = store.getSpecificGame(query.value.fixture)|| null;

       
            const { fetch, fetchState } = useFetch(async () => {
                
                if(!game.value){ 
                    await axios.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${query.value.fixture}`).then((response) => {
                        console.log(response.data.response[0])
                        store.setSingleGame(response.data.response[0])      
                    }).then(() =>{
                       game.value = store.getSingleGame();
                      
                    })
                }else{
                       game.value =  store.getSpecificGame(query.value.fixture);
                }

                
             
                await axios.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures/statistics?fixture=${query.value.fixture}`).then((response) => {
                        gameStatistics.value = store.getGameStatistics()
                      
                    if(!gameStatistics.value.cacheDate || response.data.cacheDate != gameStatistics.value.cacheDate ){
                            store.setGameStatistics(response.data)
                    }
                    
                }).then(() =>{
                    gameStatistics.value = store.getGameStatistics()
                    console.log( gameStatistics.value )
                })
            })
            
           

                        
	
		// Manually trigger a refetch
		 fetch()

	   console.log( game.value, store)

		// Access fetch error, pending and timestamp
		fetchState
        
		return {
             game,
             gameStatistics
		};
	},

};


</script>

<style lang="scss" scoped>

div{
        font-size: 30px;
}
header{
    width: 100%;
}
.teamDisplay{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
}

.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding:  0 10vw;
	flex-direction: column;
}
.teamInfo{
       display: flex;
    align-items: center;
    flex-direction: column;

    span{
        margin-top: 20px;
        font-weight: 700;
    }

  
}

.teamScore{
    font-size: 50px;
}

.gameStatistics{
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 0 100px;
    margin-top: 50px;

    li{
        display: flex;
        align-items: center;
        list-style: none;
        justify-content: space-between;
    
        font-weight: 700;
        border-bottom: 1px solid #333;
        padding: 10px;

        .type{
            margin-right: 50px;
            font-weight: 400;

        }
    }
}
</style>
