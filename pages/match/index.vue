<template>
    <div class="matchDetail" v-if="!fetchState.pending">
        <MatchInfo :match="selectedMatch" v-if="selectedMatch" />
        <MatchOverview :match="selectedMatch" v-if="selectedMatch" />
    </div>
</template>

<script>
    import { reactive, toRefs, ref, onMounted, useFetch, useContext, onActivated, computed, onDeactivated, watch, onUpdated } from "@nuxtjs/composition-api";

    import store from "@/store.js";
    import axios from "axios";

    export default {
        components: {
            MatchInfo: () => import("@/components/MatchInfo/MatchInfo.vue" /* webpackChunkName: "MatchInfo" */),
            MatchOverview: () => import("@/components/MatchOverview/MatchOverview.vue" /* webpackChunkName: "MatchInfo" */)
        },
        setup() {
            const { query } = useContext();
            const selectedMatch = ref({});

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

            const { fetch, fetchState } = useFetch(async context => {
                selectedMatch.value = await useSelectedMatch();
            });

            fetch();

            onActivated(() => {
                fetch();
            });

            onUpdated(() => {
                selectedMatch.value = store.getSelectedMatch();
            });

            return {
                selectedMatch,
                fetchState
            };
        }
    };
</script>

<style lang="scss">
    .matchDetail {
    }
</style>
