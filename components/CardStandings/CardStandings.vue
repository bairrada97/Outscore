<template>
	<div class="cardStandings">
		<span class="cardStandings__rank" :style="{ background: color, color: color ? '#fff' : '' }">{{ standing.rank }}</span>
		<div class="cardStandings__teamInfo">
			<nuxt-img v-if="standing.team.logo" class="cardStandings__teamLogo" width="24" height="24" :src="standing.team.logo" :alt="standing.team + ' logo'" />
			<div class="cardStandings__teamName">{{ standing.team.name }}</div>
		</div>
		<span>{{ standing.all.played }}</span>
		<span>{{ standing.all.win }}</span>
		<span>{{ standing.all.draw }}</span>
		<span>{{ standing.all.lose }}</span>
		<span>{{ standing.points }}</span>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {
			standing: {
				type: Object
			},
			color: {
				type: String
			}
		},
		setup(props) {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.cardStandings {
		display: grid;
		grid-template-columns: 24px 1fr 20px 20px 20px 20px 24px;
		gap: 4px;
		padding: 4px 0;
		place-items: center;
		color: #797979;

		&:not(:last-of-type) {
			margin-bottom: 8px;
		}

		&__rank {
			color: #212121;
			border-radius: 50%;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 600;
			font-size: 14px;
			line-height: 18px;
		}

		&__teamInfo {
			display: flex;
			justify-self: flex-start;
		}

		&__teamLogo {
			margin-right: 4px;
			object-fit: contain;
		}

		&__teamName {
			font-size: 16px;
			color: #212121;
		}
	}
</style>
