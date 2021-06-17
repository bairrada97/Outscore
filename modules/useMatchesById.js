import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const state = reactive({
        selectedMatch: {}
    });

    const loadMatchById = async id => {
        try {
            await axios.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${id}`).then(response => {
                state.selectedMatch = computed(() => store.getSelectedMatch());

                const hasDataUpdated = !state.selectedMatch.cacheDate || response.data.cacheDate != state.selectedMatch.cacheDate;
                if (hasDataUpdated) store.setSelectedMatch(response.data.response[0]);
            });
        } catch (error) {}
    };

    return {
        loadMatchById,
        ...toRefs(state)
    };
}
