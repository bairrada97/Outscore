<template>
    <div class="matchDetail">
        <MatchInfo :match="selectedMatch" />
    </div>
</template>

<script>
    import { reactive, toRefs, ref, onMounted, useFetch, useContext, onActivated, computed, onDeactivated, watch } from "@nuxtjs/composition-api";

    import store from "@/store.js";
    import axios from "axios";

    export default {
        components: {
            MatchInfo: () => import("@/components/MatchInfo/MatchInfo.vue" /* webpackChunkName: "MatchInfo" */)
        },
        setup() {
            const { query } = useContext();
            const selectedMatch = ref(null);

            const useSelectedMatch = async () => {
                await fetchMatchById();
                selectedMatch.value = store.getSelectedMatch();
                return { ...toRefs(selectedMatch.value) };
            };

            const fetchMatchById = async () => {
                await axios.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${query.value.fixture}`).then(response => {
                    store.setSelectedMatch(response.data.response[0]);
                });
            };

            const { fetch, fetchState } = useFetch(async () => {
                selectedMatch.value = await useSelectedMatch();
            });

            onActivated(() => {
                fetch();
            });

            fetch();

            return {
                selectedMatch
            };
        }
    };
</script>

<style lang="scss">
    .matchDetail {
    }
</style>
