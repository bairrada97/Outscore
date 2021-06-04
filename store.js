import { reactive } from "@nuxtjs/composition-api";

const state = reactive({
    liveToggle: false,
    liveGames: {},
    selectedGameStatistics: {},
    openedGame: {},
    games: {},
    selectedDate: {
        raw: null,
        formated: null
    },
    isCalendarOpen: false
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

const setFormatDate = (year, month, day) => {
    const date = new Date(year, month, day);
    state.selectedDate.raw = date;

    const offset = date.getTimezoneOffset();
    let newDate = new Date(date.getTime() - offset * 60 * 1000);
    state.selectedDate.formated = newDate.toISOString().split("T")[0];
};

const setLiveToggle = response => {
    state.liveToggle = !response;
    console.log(state);
};

const setCalendarOpen = response => {
    state.isCalendarOpen = response;
};

const getCalendarOpen = () => {
    return state.isCalendarOpen;
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
    return state.games.response?.find(game => game.fixture.id == payload);
};

const getSelectedDate = () => {
    return state.selectedDate.formated;
};

const getRawSelectedDate = () => {
    return state.selectedDate.raw;
};

const getLiveToggle = () => {
    return state.liveToggle;
};

export default {
    state,
    setLiveGames,
    getLiveGames,
    setGames,
    getGames,
    getSingleGame,
    setGameStatistics,
    getGameStatistics,
    getSpecificGame,
    setSingleGame,
    setFormatDate,
    getSelectedDate,
    getRawSelectedDate,
    setLiveToggle,
    getLiveToggle,
    setCalendarOpen,
    getCalendarOpen
};
