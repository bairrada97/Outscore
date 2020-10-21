<template>
	<div class="container">

		<div v-for="item in liveGames.response" :key="item.results">
			<span>{{item.teams.home.name}}</span>
			<span>{{item.goals.home}}</span>
			<span>{{item.goals.away}}</span>
			<span>{{item.teams.away.name}}</span>
		</div>
		
	</div> 
</template>

<script>
import {reactive, toRefs,ref,  onMounted,  useFetch } from "@nuxtjs/composition-api";

import store from '@/store.js'
import axios from 'axios'


 
export default {
	setup() {

	 	const liveGames = ref(null)

		const { fetch, fetchState } = useFetch(async () => {
		await axios.get('https://api-football-v3.herokuapp.com/api/v3/fixtures?live=all').then((response) => {
	
			store.setLiveGames(response.data)
		}).then(() =>{
			liveGames.value = store.getLiveGames()
		})
		})

		// Manually trigger a refetch
		fetch() 

	

		// Access fetch error, pending and timestamp
		fetchState

		return {
			 liveGames
		};
	},

};


</script>

<style>
div {
	display: block;
}

.ze {
	margin-bottom: 10px;
}
.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
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
