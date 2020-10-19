<template>
	<div class="container">
		{{store.state.cenas}}
		{{store.state.liveGames}}
		<div v-for="item in store.state.liveGames.response" :key="item">
			<span>{{item.teams.home.name}}</span>
			<span>{{item.goals.home}}</span>
			<span>{{item.goals.away}}</span>
			<span>{{item.teams.away.name}}</span>
		</div>
		
	</div> 
</template>

<script>
import {reactive, toRefs,ref,  onMounted,  } from "@nuxtjs/composition-api";
import useFetch from '~/utils/useFetch';


 
export default {
	inject:['store'],
	setup() {

		getData();

		return {
			 
		};
	},

};

const getData =  () => {
														
	const {response, error, fetchData, fetching} = useFetch(' https://api-football-v3.herokuapp.com/api/v3/fixtures?live=all') 	/*  /.netlify/functions/api/fixtures?live=all */
	store.setLiveGames(response, error, fetching);
}

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
