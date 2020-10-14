<template>
	<div class="container">
		
		<div v-for="item in list.response" :key="item">
			<span>{{item.teams.home.name}}</span>
			<span>{{item.goals.home}}</span>
			<span>{{item.goals.away}}</span>
			<span>{{item.teams.away.name}}</span>
		</div>
		
	</div>
</template>

<script>
import { defineComponent, toRefs,ref,  onMounted, reactive } from "@nuxtjs/composition-api";
import useFetch from '~/scripts/useFetch';

 
export default {
	props: { 
		user: "ze",
	},
	setup(props, { root }) {
		
		const getData =  () => {
			let apiData = reactive({list: [], error: null, fetching: false});
			const {response, error, fetchData, fetching} = useFetch('/.netlify/functions/api/fixtures?live=all')
			fetchData();

			apiData.list = response;
			apiData.error = error;
			apiData.fetching = fetching;

			return {...toRefs(apiData)};
		}

		const { list } = getData();
		console.log(list)
		
		return {
			list
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
