import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onUnmounted } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const selectedMatch = ref(null);

    const loadMatchById = async id => {
        try {
            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${id}`)
                .then(response => {
                    selectedMatch.value = store.getSelectedMatch();

                    const hasDataUpdated = !selectedMatch.value.cacheDate || response.data.cacheDate != selectedMatch.value.cacheDate;
                    if (hasDataUpdated) store.setSelectedMatch(response.data.response[0]);
                })
                .then(() => {
                    selectedMatch.value = store.getSelectedMatch();
                });
        } catch (error) {}
    };

    return {
        selectedMatch,
        loadMatchById
    };
}
