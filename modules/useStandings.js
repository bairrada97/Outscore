import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const standings = ref(null);

    const loadStandings = async (leagueId, seasonId) => {
        try {
            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/standings?league=${leagueId}&season=${seasonId}`)
                .then(response => {
                    standings.value = store.getStandings();
                    const hasDataUpdated = !standings.value.cacheDate || response.data.cacheDate != standings.value.cacheDate;
                    if (hasDataUpdated) store.setStandings(response.data.response[0].league);
                })
                .then(() => {
                    standings.value = store.getStandings();
                });
        } catch (error) {}
    };

    return {
        standings,
        loadStandings
    };
}
