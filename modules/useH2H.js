import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const state = reactive({
        h2h: {},
        homeTeamH2H: {},
        awayTeamH2H: {}
    });
    const loadH2H = async teams => {
        try {
            const { away, home } = teams;
            const h2hEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures/headtohead?h2h=${home.id}-${away.id}&last=41`;
            const awayTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${away.id}&last=41`;
            const homeTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${home.id}&last=41`;
            const fetchURL = url => axios.get(url);

            const promiseArray = [awayTeamEndpoint, homeTeamEndpoint].map(fetchURL);

            Promise.all(promiseArray)
                .then(responses => {
                    state.awayTeamH2H = computed(() => store.getAwayTeamH2H());
                    state.homeTeamH2H = computed(() => store.getHomeTeamH2H());
                    const hasAwayTeamH2HUpdated = !state.awayTeamH2H.cacheDate || responses[0].data.cacheDate != state.awayTeamH2H.cacheDate;
                    const hasHomeTeamH2HUpdated = !state.homeTeamH2H.cacheDate || responses[1].data.cacheDate != state.homeTeamH2H.cacheDate;

                    if (hasAwayTeamH2HUpdated) store.setAwayTeamH2H(responses[0].data.response.sort().reverse());
                    if (hasHomeTeamH2HUpdated) store.setHomeTeamH2H(responses[1].data.response.sort().reverse());
                })
                .then(() => {
                    axios.get(h2hEndpoint).then(response => {
                        state.h2h = computed(() => store.getH2H());
                        const hasH2HUpdated = !state.h2h.cacheDate || response.data.cacheDate != state.h2h.cacheDate;
                        if (hasH2HUpdated) store.setH2H(response.data.response.sort().reverse());
                    });
                })
                .catch(err => {});
        } catch (error) {}
    };

    return {
        loadH2H,
        ...toRefs(state)
    };
}
