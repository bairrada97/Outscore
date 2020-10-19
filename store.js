import { reactive } from "@nuxtjs/composition-api";


const state = reactive({
    cenas: 'zzz',
    liveGames: {
      list: {},
      error : false,
      fetching : false
    },
})


const setLiveGames = (data, error, fetching) => {
  state.liveGames.list = data;
  state.liveGames.error = error;
  state.liveGames.fetching = fetching
}


// Export an object with the state and mutations
export default { 
  // With readonly(), we prevent our state to be mutated
  // outside of the global.js module
  state,
  setLiveGames
  
}