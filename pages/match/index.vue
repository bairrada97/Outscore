<template>
    <div class="matchDetail" v-if="!fetchState.pending">
        <MatchInfo :match="selectedMatch" />

        <MatchTabsWrapper v-if="selectedMatch">
            <MatchTab title="Overview"><MatchOverview v-if="getSelectedTab == 'Overview'" :matchDetail="selectedMatch" /> </MatchTab>
            <MatchTab title="Lineup">Line-up</MatchTab>
            <MatchTab title="Stats"><MatchStatistics v-if="getSelectedTab == 'Stats'" :matchDetail="selectedMatch" /></MatchTab>
            <MatchTab title="BestHelper"><MatchBetsHelper v-if="getSelectedTab == 'BestHelper'" :matchDetail="selectedMatch" /></MatchTab>
            <MatchTab title="H2H"><MatchH2H v-if="getSelectedTab == 'H2H'" :matchDetail="selectedMatch" /></MatchTab>
            <MatchTab title="Standings">Standings</MatchTab>
        </MatchTabsWrapper>
    </div>
</template>

<script>
    import { reactive, toRefs, ref, computed, useFetch, useContext, onActivated, onUnmounted, onDeactivated, watch, onUpdated } from "@nuxtjs/composition-api";

    import store from "@/store.js";
    import axios from "axios";
    import useMatchesById from "@/modules/useMatchesById";

    import MatchTabsWrapper from "@/components/MatchTabsWrapper/MatchTabsWrapper.vue";
    import MatchTab from "@/components/MatchTab/MatchTab.vue";
    import MatchInfo from "@/components/MatchInfo/MatchInfo.vue";
    import MatchOverview from "@/components/MatchOverview/MatchOverview.vue";
    import MatchStatistics from "@/components/MatchStatistics/MatchStatistics.vue";
    import MatchH2H from "@/components/MatchH2H/MatchH2H.vue";
    import MatchBetsHelper from "@/components/MatchBetsHelper/MatchBetsHelper.vue";

    export default {
        components: {
            MatchInfo,
            MatchOverview,
            MatchTabsWrapper,
            MatchTab,
            MatchStatistics,
            MatchH2H,
            MatchBetsHelper
        },
        setup() {
            const { query } = useContext();
            const { selectedMatch, loadMatchById } = useMatchesById();
            const getSelectedTab = computed(() => store.getSelectedTab());

            const { fetch, fetchState } = useFetch(async () => {
                await loadMatchById(parseInt(query.value.fixture));
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
                fetchState,
                getSelectedTab
            };
        }
    };
</script>

<style lang="scss">
    .matchDetail {
    }
</style>
