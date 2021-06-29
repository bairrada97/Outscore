<template>
	<div class="cardVenue">
		<div class="cardVenue__content" v-for="(item, index) in venue" :key="index">
			<span class="cardVenue__tagline">{{ index }}:</span>
			<span class="cardVenue__value">{{ item }}</span>
		</div>
	</div>
</template>

<script>
	import { watch, computed, ref } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {
			venue: {
				type: Object
			}
		},
		setup(props) {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.cardVenue {
		background-color: #f7f7f7;
		padding: 16px;

		&__content {
			display: grid;
			grid-template-columns: 102px 1fr;
			&:not(:last-child) {
				margin-bottom: 16px;
			}
		}

		&__tagline {
			font-size: 12px;
			font-weight: 600;
			color: #797979;
			text-transform: uppercase;
			line-height: 15px;
		}

		&__value {
			font-weight: 600;
			font-size: 14px;
			color: #212121;
			line-height: 18px;
		}
	}
</style>
