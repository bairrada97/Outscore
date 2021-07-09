<template>
	<div class="matchH2H">
		<div>
			<button @click="filterH2H(0)">Overall</button>
			<button @click="filterH2H(1)">{{ matchDetail.teams.home.name }}</button>
			<button @click="filterH2H(2)">{{ matchDetail.teams.away.name }}</button>
		</div>

		<div class="matchH2H__container" v-if="h2h.length">
			<h3 class="matchH2H__title">head to head</h3>
			<div class="matchH2H__matches">
				<CardGame v-if="showMatches(index, 0)" v-for="(match, index) in h2h" :key="match.fixture.id" :game="match" type="H2H" />
			</div>
		</div>
		<button v-if="showViewAllButton(h2h, 0)" class="matchH2H__viewAllMatches" @click="showAllMatchesEvent(0)">
			<span>show more matches</span>
			<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19.9973 13H13.9973V19H11.9973V13H5.99731V11H11.9973V5H13.9973V11H19.9973V13Z" fill="#797979" />
			</svg>
		</button>
		<div class="matchH2H__container" v-if="homeTeamH2H.length">
			<h3 class="matchH2H__title">Last Matches: {{ matchDetail.teams.home.name }}</h3>
			<div class="matchH2H__matches">
				<CardGame v-if="showMatches(index, 1)" v-for="(match, index) in homeTeamH2H" :key="match.fixture.id" :game="match" type="H2H" :team="matchDetail.teams.home.id" :winCondition="getWinCondition(match, 'home')" />
			</div>
		</div>
		<button v-if="showViewAllButton(homeTeamH2H, 1)" class="matchH2H__viewAllMatches" @click="showAllMatchesEvent(1)">
			<span>show more matches</span>
			<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19.9973 13H13.9973V19H11.9973V13H5.99731V11H11.9973V5H13.9973V11H19.9973V13Z" fill="#797979" />
			</svg>
		</button>
		<div class="matchH2H__container" v-if="awayTeamH2H.length">
			<h3 class="matchH2H__title">Last Matches: {{ matchDetail.teams.away.name }}</h3>
			<div class="matchH2H__matches">
				<CardGame v-if="showMatches(index, 2)" v-for="(match, index) in awayTeamH2H" :key="match.fixture.id" :game="match" type="H2H" :team="matchDetail.teams.away.id" :winCondition="getWinCondition(match, 'away')" />
			</div>
		</div>
		<button v-if="showViewAllButton(awayTeamH2H, 2)" class="matchH2H__viewAllMatches" @click="showAllMatchesEvent(2)">
			<span>show more matches</span>
			<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19.9973 13H13.9973V19H11.9973V13H5.99731V11H11.9973V5H13.9973V11H19.9973V13Z" fill="#797979" />
			</svg>
		</button>
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, onMounted, useFetch, useContext } from "@nuxtjs/composition-api";
	import useH2H from "@/modules/useH2H";
	import CardGame from "@/components/CardGame/CardGame.vue";

	import store from "@/store.js";

	export default {
		components: {
			CardGame
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const { query } = useContext();
			const { loadH2H, awayTeamH2H, homeTeamH2H, h2h } = useH2H();
			const originalHomeTeamH2H = computed(() => store.getHomeTeamH2H());
			const originalAwayTeamH2H = computed(() => store.getAwayTeamH2H());
			const originalH2H = computed(() => store.getH2H());
			const showOnlyHome = computed(() => originalHomeTeamH2H.value.filter(match => match.teams.home.id === props.matchDetail.teams.home.id));
			const showOnlyHomeH2H = computed(() => originalH2H.value.filter(match => match.teams.home.id === props.matchDetail.teams.home.id));
			const showOnlyAway = computed(() => originalAwayTeamH2H.value.filter(match => match.teams.away.id === props.matchDetail.teams.away.id));
			const showOnlyAwayH2H = computed(() => originalH2H.value.filter(match => match.teams.away.id === props.matchDetail.teams.away.id));

			const state = ref([
				{
					clicked: false,
					maxVisibleMatches: 5
				},
				{
					clicked: false,
					maxVisibleMatches: 5
				},
				{
					clicked: false,
					maxVisibleMatches: 5
				}
			]);

			const { fetch, fetchState } = useFetch(async () => {
				await loadH2H(props.matchDetail.teams);
			});

			const filterH2H = filter => {
				if (filter == 0) {
					homeTeamH2H.value = originalHomeTeamH2H.value;
					awayTeamH2H.value = originalAwayTeamH2H.value;
					h2h.value = originalH2H.value;
				}
				if (filter == 1) {
					homeTeamH2H.value = showOnlyHome.value;
					h2h.value = showOnlyHomeH2H.value;

					awayTeamH2H.value = [];
				}
				if (filter == 2) {
					awayTeamH2H.value = showOnlyAway.value;
					h2h.value = showOnlyAwayH2H.value;

					homeTeamH2H.value = [];
				}
			};

			const showAllMatchesEvent = selectedH2HIndex => {
				state.value[selectedH2HIndex].clicked = true;
				state.value[selectedH2HIndex].maxVisibleMatches = 41;
			};

			const showMatches = (matchIndex, stateIndex) => {
				return matchIndex < state.value[stateIndex].maxVisibleMatches || state.value[stateIndex].clicked;
			};

			const showViewAllButton = (type, stateIndex) => {
				return type?.length > 5 && !state.value[stateIndex].clicked;
			};

			const getWinCondition = (match, side) => {
				const isSelectedTeamWon = Object.values(match.teams).find(item => !!item.winner);
				const isSelectedTeamLost = Object.values(match.teams).find(item => !!item.winner);
				if (!isSelectedTeamWon?.id && !isSelectedTeamLost?.id) {
					return 0;
				} else {
					if (isSelectedTeamWon?.id === props.matchDetail.teams[side].id) {
						return 1;
					} else {
						return -1;
					}
				}
			};

			fetch();
			return {
				fetchState,
				h2h,
				homeTeamH2H,
				awayTeamH2H,
				showAllMatchesEvent,
				getWinCondition,
				state,
				showMatches,
				showViewAllButton,
				filterH2H,
				originalAwayTeamH2H,
				originalHomeTeamH2H
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchH2H {
		margin-top: 24px;
		margin-bottom: 40px;

		&__container {
			display: grid;
			border: 1px solid #c7c7c7;
			margin-top: 24px;
		}
		&__title {
			font-size: 14px;
			font-weight: 600;
			text-transform: uppercase;
			padding: 8px 16px;
			background-color: #dadada;
			grid-column: 1/-1;
		}

		&__viewAllMatches {
			color: #797979;
			font-weight: 600;
			text-transform: uppercase;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			margin-top: 8px;
			padding: 12px;
			border: 1px dashed #dcdcdc;
		}
	}
</style>
