<template>
	<div class="filter">{{ name }}</div>
</template>

<script>
	import { watch, computed, ref } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {},
		setup(props) {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.filter {
	}
</style>
