import {
    defineComponent,
    reactive,
    toRefs,
    ref,
    onMounted,
    useFetch,
    onActivated,
    onUnmounted
} from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const games = ref(null);

    const loadGames = async () => {
        try {
            await axios
                .get("https://api-football-v3.herokuapp.com/api/v3/fixtures?date=2020-11-01")
                .then(response => {
                    games.value = store.getGames();
                    const hasDataUpdated = !games.value.cacheDate || response.data.cacheDate != games.value.cacheDate;
                    if (hasDataUpdated) store.setGames(response.data);
                })
                .then(() => {
                    games.value = store.getGames();
                });
        } catch (error) {}
    };

    return {
        games,
        loadGames
    };
}