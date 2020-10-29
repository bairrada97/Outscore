import { reactive } from "@nuxtjs/composition-api";

const state = reactive({
    liveGames: {},
    selectedGameStatistics: {},
    openedGame: {},
    games: {}
});

const setLiveGames = response => {
    state.liveGames = response;
};

const setGames = response => {
    state.games = response;
};

const setGameStatistics = response => {
    state.selectedGameStatistics = response;
};
const getLiveGames = () => {
    return state.liveGames;
};

const getGames = () => {
    return state.games;
};

const getGameStatistics = () => {
    return state.selectedGameStatistics;
};

const setSingleGame = response => {
    state.openedGame = response;
};

const getSingleGame = () => {
    return state.openedGame;
};

const getSpecificGame = payload => {
    return state.liveGames.response?.find(game => game.fixture.id == payload);
};

// Export an object with the state and mutations
export default {
    // With readonly(), we prevent our state to be mutated
    // outside of the global.js module
    state,
    setLiveGames,
    getLiveGames,
    setGames,
    getGames,
    getSingleGame,
    setGameStatistics,
    getGameStatistics,
    getSpecificGame,
    setSingleGame
};
