<template>
	<div class="matchStandings">
		<div class="matchStandings__labels">
			<div>#</div>
			<div>Team</div>
			<span>P</span>
			<span>W</span>
			<span>D</span>
			<span>L</span>
			<div>Pts</div>
		</div>
		<div class="matchStandings__container" v-if="getTeamStandings">
			<div class="matchStandings__team" v-for="standing in getTeamStandings" :key="standing.team.id">
				<div>{{ standing.rank }}º</div>
				<div class="matchStandings__teamInfo">
					<nuxt-img v-if="standing.team.logo" class="matchStandings__teamLogo" width="24" height="24" :src="standing.team.logo" :alt="name + ' logo'" />
					<div>{{ standing.team.name }}</div>
				</div>
				<span>{{ standing.all.played }}</span>
				<span>{{ standing.all.win }}</span>
				<span>{{ standing.all.draw }}</span>
				<span>{{ standing.all.lose }}</span>
				<div>{{ standing.points }}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
	import useStandings from "../../modules/useStandings";
	import store from "@/store.js";
	import CardStats from "@/components/CardStats/CardStats.vue";

	export default {
		components: {
			CardStats
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const { loadStandings, standings } = useStandings();
			const getStandings = computed(() => store.getStandings());
			const getTeamStandings = computed(() => standings.value?.standings?.find(standing => standing?.find(item => item.team.id == props.matchDetail.teams.home.id || item.team.id == props.matchDetail.teams.away.id)));
			console.log(getTeamStandings);

			const { fetch, fetchState } = useFetch(async () => {
				await loadStandings(props.matchDetail.league.id, props.matchDetail.league.season);
			});

			fetch();

			return {
				getTeamStandings
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchStandings {
		&__labels {
			display: grid;
			grid-template-columns: 24px 1fr 20px 20px 20px 20px 24px;
			gap: 4px;
			color: #212121;
			text-transform: uppercase;
			font-weight: 600;
			margin-bottom: 16px;
		}

		&__team {
			display: grid;
			grid-template-columns: 24px 1fr 20px 20px 20px 20px 24px;

			gap: 4px;
		}

		&__teamInfo {
			display: flex;
		}
	}
</style>
