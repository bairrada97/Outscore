import { reactive } from "@nuxtjs/composition-api";


const state = reactive({
    liveGames: {},
})


const setLiveGames = (response) => {
  state.liveGames = response;
  
}
const getLiveGames = () => {
 return state.liveGames
  
}


// Export an object with the state and mutations
export default { 
  // With readonly(), we prevent our state to be mutated
  // outside of the global.js module
  state,
  setLiveGames,getLiveGames
  
}