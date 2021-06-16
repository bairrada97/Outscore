<template>
    <div class="matchDetail" v-if="!fetchState.pending">
        <MatchInfo :match="selectedMatch" />

        <MatchTabsWrapper v-if="selectedMatch">
            <MatchTab title="Overview"><MatchOverview v-if="selectedMatch" :matchDetail="selectedMatch" /> </MatchTab>
            <MatchTab title="Lineup">Line-up</MatchTab>
            <MatchTab title="Stats"><MatchStatistics v-if="selectedMatch" :matchDetail="selectedMatch" /></MatchTab>
            <MatchTab title="BestHelper">Best Helper</MatchTab>
            <MatchTab title="H2H"><MatchH2H v-if="selectedMatch" :matchDetail="selectedMatch" /></MatchTab>
            <MatchTab title="Standings">Standings</MatchTab>
        </MatchTabsWrapper>
    </div>
</template>

<script>
    import { reactive, toRefs, ref, onMounted, useFetch, useContext, onActivated, onUnmounted, onDeactivated, watch, onUpdated } from "@nuxtjs/composition-api";

    import store from "@/store.js";
    import axios from "axios";
    import MatchTabsWrapper from "@/components/MatchTabsWrapper/MatchTabsWrapper.vue";
    import MatchTab from "@/components/MatchTab/MatchTab.vue";
    import MatchInfo from "@/components/MatchInfo/MatchInfo.vue";
    import MatchOverview from "@/components/MatchOverview/MatchOverview.vue";
    import MatchStatistics from "@/components/MatchStatistics/MatchStatistics.vue";
    import MatchH2H from "@/components/MatchH2H/MatchH2H.vue";

    export default {
        components: {
            MatchInfo,
            MatchOverview,
            MatchTabsWrapper,
            MatchTab,
            MatchStatistics,
            MatchH2H
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

            watch(
                () => parseInt(query.value.fixture),
                (newValue, prevValue) => {
                    if (!parseInt(query.value.fixture)) return;

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
