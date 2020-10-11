export const state = () => ({
	fixtures: {},
	counter: 0,
});
 
export const mutations = {
	SET_FIXTURES: (state, payload) => {
		state.fixtures = payload;
	},
	COUNTER: (state, payload) => {
		state.counter = state.counter++;
	},
};

export const getters = {
	getFixtures(state) {
		return state.fixtures;
	},
};
export const actions = { 
	async getFixtures({ commit }) {
		await this.$axios
			.get(
				"/api/fixtures?live=all",
				
			)
			.then((response) => {
				console.log(response);
				commit("SET_FIXTURES", response);
			});
	},
	async getStatistics1({ commit }) {
		await this.$axios
			.get(
				"/api/fixtures/statistics?fixture=562524&team=9976",
				
			)
			.then((response) => {
				console.log(response);
				commit("SET_FIXTURES", response);
			});
	},
	async getStatistics2({ commit }) {
		await this.$axios
			.get(
				"/api/fixtures/statistics?fixture=562525&team=325",
				
			)
			.then((response) => {
				console.log(response);
				commit("SET_FIXTURES", response);
			});
	},
};
