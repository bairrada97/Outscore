import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const games = ref(null);
    const date = reactive({
        today: new Date()
    });
    date.currentMonth = date.today.getMonth();
    date.currentYear = date.today.getFullYear();

    const selectedDate = computed(() => store.getSelectedDate());
    const loadGames = async () => {
        try {
            console.log(selectedDate);

            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?date=${selectedDate.value}`)
                .then(response => {
                    console.log("chamou");
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
