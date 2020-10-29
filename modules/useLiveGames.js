import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const liveGames = ref(null);

    const loadLiveGames = async () => {
        try {
            await axios
                .get("https://api-football-v3.herokuapp.com/api/v3/fixtures?live=all")
                .then(response => {
                    liveGames.value = store.getLiveGames();
                    const hasDataUpdated = !liveGames.value.cacheDate || response.data.cacheDate != liveGames.value.cacheDate;
                    if (hasDataUpdated) store.setLiveGames(response.data);
                })
                .then(() => {
                    liveGames.value = store.getLiveGames();
                });
        } catch (error) {}
    };

    return {
        liveGames,
        loadLiveGames
    };
}
