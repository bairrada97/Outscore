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
	
};
