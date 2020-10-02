export const state = () => ({
  fixtures: {},
  counter: 0,
})

export const mutations = {
  SET_FIXTURES: (state, payload) => {
    state.fixtures = payload
  },
  COUNTER: (state, payload) => {
    state.counter = state.counter++
  },
}

export const getters = {
  getFixtures(state) {
    return state.fixtures
  },
}
export const actions = {
  async getFixtures({ commit }) {
    await this.$axios
      .get('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': 'bd3b30e0ee4efd020aaf515e7a304cba',
        },
      })
      .then((response) => {
        commit('SET_FIXTURES', response.data)
      })
  },
}
