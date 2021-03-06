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
			<CardStandings v-for="standing in getTeamStandings" :key="standing.team.id" :standing="standing" :color="getColorAndDescription(standing)" />
		</div>

		<div class="matchStandings__colorsDescriptionContainer" v-if="addColorsToDescription">
			<div class="matchStandings__colorsDescription" v-for="(description, index) in addColorsToDescription" :key="index">
				<span class="matchStandings__colorsLabel" :style="{ background: description.color }"></span>
				<span class="matchStandings__subtitles">{{ description.description }}</span>
			</div>
		</div>
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
			const getTeamStandings = computed(() => standings.value?.standings?.find(standing => standing?.find(item => item.team.id == props.matchDetail.teams.home.id || item.team.id == props.matchDetail.teams.away.id)));
			const filterTeamDescription = computed(() => new Set(getTeamStandings?.value?.map(item => item.description)));
			const promotionColors = ["#187C56", "#7CCC15", "#3CDBD3"];
			const relegationColors = ["#D16666", "#FF8552", "#E3DBDB"];
			const descriptionSubtitle = ref([]);
			let colorPromotionIndex = ref(0);
			let colorRelegationIndex = ref(0);

			const addColorsToDescription = computed(() => {
				return Array.from(filterTeamDescription?.value)?.reduce((acc, description, index) => {
					if (!description) return acc;
					if (description.includes("Relegation")) {
						acc.push({
							description,
							color: relegationColors[colorRelegationIndex.value]
						});
						colorRelegationIndex.value++;
					} else {
						acc.push({
							description,
							color: promotionColors[colorPromotionIndex.value]
						});
						colorPromotionIndex.value++;
					}

					return acc;
				}, []);
			});

			const getColorAndDescription = ({ description }) => {
				const getMatchedDescription = addColorsToDescription?.value?.find(item => item.description == description);
				return getMatchedDescription?.color;
			};

			const { fetch, fetchState } = useFetch(async () => {
				await loadStandings(props.matchDetail.league.id, props.matchDetail.league.season);
			});

			fetch();

			return {
				getTeamStandings,
				descriptionSubtitle,
				getColorAndDescription,
				fetchState,
				addColorsToDescription
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchStandings {
		padding: 24px 16px;

		&__container {
			padding-bottom: 24px;
			box-shadow: inset 0px -1px 0px rgba(183, 183, 183, 0.3);
		}
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

		&__colorsDescriptionContainer {
			margin-top: 16px;
		}

		&__colorsDescription {
			display: flex;
			align-items: center;
			margin-bottom: 4px;
		}

		&__colorsLabel {
			display: block;
			border-radius: 50%;
			width: 8px;
			height: 8px;
			margin-right: 16px;
		}

		&__subtitles {
			color: #565656;
		}
	}
</style>
