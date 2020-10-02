<template>
	<div class="container">
		<!-- <div v-for="data in response" :key="data">
			<div class="ze">
			<span>{{ data.teams.home.name }}</span>
				<span>{{ data.goals.home }}</span>
				<span>{{ data.goals.away }}</span>
				<span>{{ data.teams.away.name }}</span>
			</div>
		</div> -->
		<span>{{ response }}</span>
	</div>
</template>

<script>
import { defineComponent, ref, useFetch } from "@nuxtjs/composition-api";

export default {
	props: {
		user: "ze",
	},
	setup(props, { root }) {
		const response = ref("");
		response.value = root.$store.state.fixtures;
		console.log(response.value);

		return {
			response,
		};
	},

	mounted() {},
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
