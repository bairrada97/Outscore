import { reactive } from "@nuxtjs/composition-api";

const state = reactive({
    liveToggle: false,
    liveGames: {},
    selectedGameStatistics: {},
    selectedMatch: {},
    games: {},
    selectedDate: {
        raw: null,
        formated: null
    },
    isCalendarOpen: false,
    awayTeamH2H: {},
    homeTeamH2H: {},
    h2h: {}
});

const getAwayTeamH2H = () => {
    return state.awayTeamH2H;
};
const getHomeTeamH2H = () => {
    return state.homeTeamH2H;
};

const getH2H = () => {
    return state.h2h;
};
const setAwayTeamH2H = response => {
    state.awayTeamH2H = response;
};
const setHomeTeamH2H = response => {
    state.homeTeamH2H = response;
};
const setH2H = response => {
    state.h2h = response;
};

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

const setSelectedMatch = response => {
    state.selectedMatch = response;
};

const getSelectedMatch = () => {
    return state.selectedMatch;
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
    getSelectedMatch,
    setGameStatistics,
    getGameStatistics,
    getSpecificGame,
    setSelectedMatch,
    setFormatDate,
    getSelectedDate,
    getRawSelectedDate,
    setLiveToggle,
    getLiveToggle,
    setCalendarOpen,
    getCalendarOpen,
    getAwayTeamH2H,
    getHomeTeamH2H,
    getH2H,
    setAwayTeamH2H,
    setHomeTeamH2H,
    setH2H
};
