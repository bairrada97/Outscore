import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted } from "@nuxtjs/composition-api";
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
            console.log(away, home);
            const h2hEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures/headtohead?h2h=${home.id}-${away.id}&last=41`;
            const awayTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${away.id}&last=41`;
            const homeTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${home.id}&last=41`;
            const fetchURL = url => axios.get(url);

            const promiseArray = [awayTeamEndpoint, homeTeamEndpoint].map(fetchURL);

            Promise.all(promiseArray)
                .then(responses => {
                    state.awayTeamH2H = responses[0].data.response.sort().reverse();
                    state.homeTeamH2H = responses[1].data.response.sort().reverse();
                })
                .then(() => {
                    axios.get(h2hEndpoint).then(response => {
                        state.h2h = response.data.response.sort().reverse();
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
