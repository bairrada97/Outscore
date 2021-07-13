<template>
	<div class="matchLineups" v-if="matchDetail.lineups && matchDetail.lineups.length > 0">
		<div class="matchLineups__container" :data-id="index" v-for="(team, index) in matchDetail.lineups" :key="team.team.id">
			<div class="matchLineups__summary">
				<span class="matchLineups__teamName">{{ team.team.name }}</span>
				<span class="matchLineups__formation">{{ team.formation }}</span>
			</div>
			<div class="matchLineups__fieldGrid" v-if="team.formation">
				<div class="matchLineups__fieldRows" v-for="(grid, index) in getGrid(team.formation)" :key="index">
					<div class="matchLineups__fieldPlayers" :style="{ gridArea: getPlayerGridPosition(player.player.grid) }" v-for="(player, index) in getPlayersFromRow(team.startXI, grid)" :key="index">
						<span class="matchLineups__fieldPlayers__number">{{ player.player.number }}</span>
						<span class="matchLineups__fieldPlayers__name">{{ getPlayerName(player.player.name) }}</span>
					</div>
				</div>
			</div>
		</div>
		<figure v-if="matchDetail.lineups[0].formation">
			<nuxt-img class="matchLineups__field" height="539" src="/field.png" />
		</figure>
		<div class="" v-for="team in matchDetail.lineups" :key="team.team.id">
			<div class="matchLineupsCard__container">
				<nuxt-img v-if="team.team.logo" class="matchLineupsCard__logo" width="24" height="24" :src="team.team.logo" :alt="team.team.name + ' logo'" />
				<h3 class="matchLineupsCard__name">{{ team.team.name }}</h3>
				<svg class="matchLineupsCard__dropdown" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7.41 8.29492L12 12.8749L16.59 8.29492L18 9.70492L12 15.7049L6 9.70492L7.41 8.29492Z" fill="currentcolor" />
				</svg>
			</div>
		</div>
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
			const getGrid = formation => formation?.split("-").length + 1;
			const getPlayerGridPosition = grid => {
				const row = grid.split(":")[0];
				const column = grid.split(":")[1];
				return `${row} / ${column}`;
			};

			const getGridColumns = column => `repeat(${column}, 1fr)`;
			const getPlayersFromRow = (starters, index) => starters.filter(player => player.player.grid.split(":")[0] == index);
			const getPlayerName = name => `${name.charAt(0)}. ${name.split(" ").pop()}`;

			return {
				getGrid,
				getPlayerGridPosition,
				getPlayersFromRow,
				getPlayerName,
				getGridColumns
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchLineups {
		$this: &;
		padding: 24px 16px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr;

		&__container {
			grid-column: 1/-1;
			display: flex;
			gap: 24px 0;
			&[data-id="0"] {
				grid-row: 1;
				flex-direction: column;

				#{$this}__fieldGrid {
					flex-direction: column;
				}
				#{$this}__fieldRows {
					direction: rtl;
				}
			}

			&[data-id="1"] {
				grid-row: 2;
				flex-direction: column-reverse;

				#{$this}__fieldGrid {
					flex-direction: column-reverse;
				}

				#{$this}__fieldRows {
					direction: ltr;
				}
			}
		}

		&__summary {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			font-weight: 600;
		}

		figure {
			position: relative;
			grid-column: 1/-1;
			grid-row: 1/3;
			width: 100%;
			border: 1px solid #dadada;
			z-index: -1;
			display: flex;
			align-items: center;
			margin: 42px auto;
			justify-content: center;
			background-color: #f1f1f1;

			&:after {
				content: "";
				position: absolute;
				width: 100%;
				height: 1px;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: #dadada;
			}
		}

		&__field {
		}

		&__fieldGrid {
			display: flex;
			height: 100%;
		}

		&__fieldRows {
			display: grid;
			height: 100%;
			grid-template-columns: repeat(auto-fit, minmax(1px, 1fr));
		}

		&__fieldPlayers {
			justify-self: center;
			grid-row: auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;

			&__number {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
				background-color: #fff;
				font-weight: 600;
				font-size: 12px;
				line-height: 15px;
				border-radius: 50%;
			}

			&__name {
				font-size: 12px;
				line-height: 15px;
				border-radius: 50%;
				color: #212121;
				font-weight: 600;
				text-align: center;
			}
		}
	}
</style>
