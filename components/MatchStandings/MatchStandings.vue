<template>
	<div class="matchStandings">
		<div class="matchStandings__labels">
			<div>#</div>
			<div class="matchStandings__labels--team">Team</div>
			<span>P</span>
			<span>W</span>
			<span>D</span>
			<span>L</span>
			<div>Pts</div>
		</div>
		<div class="matchStandings__container" v-if="getTeamStandings">
			<CardStandings v-for="standing in getTeamStandings" :key="standing.team.id" :standing="standing" :color="getColorDescription(standing)" />
		</div>
		<!-- <div class="MatchStandings__colorsDescription" v-for="(description, index) in removeDuplicates" :key="index">
			<span class="MatchStandings__colorsLabel" :style="{ background: description.color }"></span>
			<span>{{ description.name }}</span>
		</div> -->
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
	import useStandings from "../../modules/useStandings";
	import store from "@/store.js";
	import CardStats from "@/components/CardStats/CardStats.vue";
	import CardStandings from "@/components/CardStandings/CardStandings.vue";

	export default {
		components: {
			CardStats,
			CardStandings
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
			const promotionColors = ["green", "blue", "pink"];
			const relegationColors = ["red", "black", "purple"];
			const previousDescription = ref(null);
			const descriptionSubtitle = ref([]);

			const getColorDescription = ({ description }) => {
				let currentColor;
				let colorIndex = 0;
				if (!previousDescription.value) previousDescription.value = description;
				if (description && description.includes("Promotion")) {
					if (previousDescription.value == description) {
						currentColor = promotionColors[colorIndex];
					} else {
						currentColor = promotionColors[colorIndex + 1];
						colorIndex++;
					}

					descriptionSubtitle.value.push({
						name: description,
						color: promotionColors[colorIndex]
					});
				}

				if (description && description.includes("Relegation")) {
					colorIndex = 0;
					previousDescription.value = description;
					if (previousDescription.value == description) {
						currentColor = relegationColors[colorIndex];
					} else {
						currentColor = relegationColors[colorIndex + 1];
						colorIndex++;
					}

					descriptionSubtitle.value.push({
						name: description,
						color: relegationColors[colorIndex]
					});
				}

				return currentColor;
			};
			const { fetch, fetchState } = useFetch(async () => {
				await loadStandings(props.matchDetail.league.id, props.matchDetail.league.season);
			});

			fetch();

			return {
				getTeamStandings,
				getColorDescription
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchStandings {
		padding: 24px 16px;
		&__labels {
			display: grid;
			grid-template-columns: 24px 1fr 20px 20px 20px 20px 24px;
			gap: 4px;
			color: #212121;
			text-transform: uppercase;
			font-weight: 600;
			margin-bottom: 16px;
			text-align: center;

			&--team {
				text-align: left;
			}
		}

		&__colorsLabel {
			border-radius: 50%;
			width: 8px;
			height: 8px;
			margin-right: 16px;
		}
	}
</style>
