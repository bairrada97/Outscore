<template>
    <div class="matchDetail">
        <MatchInfo :match="selectedMatch" v-if="selectedMatch" />

        <MatchTabsWrapper v-if="!fetchState.pending">
            <MatchTab title="Overview"><MatchOverview :matchDetail="selectedMatch" /> </MatchTab>
            <MatchTab title="Lineup">Line-up</MatchTab>
            <MatchTab title="Stats">Stats</MatchTab>
            <MatchTab title="BestHelper">Best Helper</MatchTab>
            <MatchTab title="H2H">H2H</MatchTab>
            <MatchTab title="Standings">Standings</MatchTab>
        </MatchTabsWrapper>
    </div>
</template>

<script>
    import { reactive, toRefs, ref, onMounted, useFetch, useContext, onActivated, computed, onDeactivated, watch, onUpdated } from "@nuxtjs/composition-api";

    import store from "@/store.js";
    import axios from "axios";

    export default {
        components: {
            MatchInfo: () => import("@/components/MatchInfo/MatchInfo.vue" /* webpackChunkName: "MatchInfo" */),
            MatchTabsWrapper: () => import("@/components/MatchTabsWrapper/MatchTabsWrapper.vue" /* webpackChunkName: "MatchTabsWrapper" */),
            MatchTab: () => import("@/components/MatchTab/MatchTab.vue" /* webpackChunkName: "MatchTab" */),
            MatchOverview: () => import("@/components/MatchOverview/MatchOverview.vue" /* webpackChunkName: "MatchOverview" */)
        },
        setup() {
            const { query } = useContext();
            const selectedMatch = ref({});

            const useSelectedMatch = async () => {
                await axios.get(`https://api-football-v3.herokuapp.com/api/v3/fixtures?id=${query.value.fixture}`).then(response => {
                    store.setSelectedMatch(response.data.response[0]);
                    selectedMatch.value = response.data.response[0];
                });
            };

            const { fetch, fetchState } = useFetch(async () => {
                await useSelectedMatch();
            });

            fetch();

            watch(
                () => parseInt(query.value.fixture),
                (newValue, prevValue) => {
                    fetch();
                }
            );

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
