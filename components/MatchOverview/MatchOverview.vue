<template>
	<div class="matchOverview">
		<div class="matchOverview__period" v-for="(periods, name) in reversePeriods" :key="name">
			<h3 class="matchOverview__periodName">{{ periods.period }} Half</h3>
			<div class="matchOverview__periodTeam">
				<CardEvent v-for="(event, index) in periods.events" :key="index" :event="event" />
			</div>
		</div>
		<CardVenue :venue="displayVenue" />
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, onMounted, onBeforeUnmount } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";
	import CardEvent from "@/components/CardEvent/CardEvent.vue";
	import CardVenue from "@/components/CardVenue/CardVenue.vue";

	export default {
		components: {
			CardEvent
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const displayEvents = computed(() => {
				return props.matchDetail?.events?.reduce((acc, event) => {
					let homeTeam = computed(() => props.matchDetail.teams.home);
					let awayTeam = computed(() => props.matchDetail.teams.away);

					event.time.elapsed <= 45 ? (acc.first = acc.first || new Set()) : (acc.second = acc.second || new Set());
					Object.defineProperty(event, "side", { value: "", writable: true, enumerable: true, configurable: true });

					if (event.time.elapsed <= 45) {
						event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
						acc.first.add(event);
					} else {
						event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
						acc.second.add(event);
					}

					return acc;
				}, {});
			});

			const displayVenue = computed(() => {
				const { date, venue, referee, status } = props.matchDetail.fixture;
				const { name, round } = props.matchDetail.league;
				const getReferee = () => {
					if (status.short == "NS") {
						return referee || "To be defined";
					} else {
						return referee || "";
					}
				};
				return {
					date: new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }),
					tournament: `${name}, ${round}`,
					stadium: `${venue.name ? venue.name + "," + venue.city : ""}`,
					referee: getReferee()
				};
			});
			const reversePeriods = computed(() => {
				return Object.keys(displayEvents?.value)
					.reverse()
					.map(key => {
						const events = Array.from(displayEvents.value[key]);
						events.reverse();

						return {
							period: key,
							events
						};
					});
			});

			return {
				displayEvents,
				reversePeriods,
				displayVenue
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchOverview {
		margin-top: 24px;
		margin-bottom: 24px;

		&__period {
			display: grid;
			border: 1px solid #c7c7c7;
			margin-bottom: 16px;
		}
		&__periodName {
			font-size: 14px;
			font-weight: 600;
			text-transform: uppercase;
			padding: 8px 16px;
			background-color: #dadada;
			grid-column: 1/-1;
		}
	}
</style>
