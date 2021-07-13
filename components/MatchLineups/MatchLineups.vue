<template>
	<div class="matchLineups" v-if="matchDetail.lineups.length">
		<div class="matchLineups__container" :data-id="index" v-for="(team, index) in matchDetail.lineups" :key="team.team.id">
			<div class="matchLineups__summary">
				<span class="matchLineups__teamName">{{ team.team.name }}</span>
				<span class="matchLineups__formation">{{ team.formation }}</span>
			</div>
			<div class="matchLineups__fieldGrid">
				<div class="matchLineups__fieldPlayers" :style="{ gridArea: getPlayerPositionGrid(player.player.grid) }" v-for="(player, index) in team.startXI" :key="index">
					{{ player.player.name }}
				</div>
			</div>
		</div>
		<nuxt-img class="matchLineups__field" height="539" src="/field.png" />
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";

	import store from "@/store.js";

	export default {
		components: {},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const getGrid = formation => {
				return formation.split("-").length + 1;
			};

			const getPlayerPositionGrid = grid => {
				const column = grid.split(":")[0];
				const row = grid.split(":")[1];
				return `${column} / ${row}`;
			};
			return {
				getGrid,
				getPlayerPositionGrid
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchLineups {
		margin-top: 24px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		&__container {
			grid-column: 1/-1;
			&[data-id="0"] {
				grid-row: 1;
			}

			&[data-id="1"] {
				grid-row: 3;
			}
		}

		&__summary {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			font-weight: 600;
		}

		&__field {
			grid-column: 1/-1;

			grid-row: 2;
			margin: 8px auto;
		}

		&__fieldGrid {
			display: grid;
		}
	}
</style>
