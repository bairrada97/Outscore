<template>
    <div class="matchH2H" v-if="!fetchState.pending">
        <div class="matchH2H__container">
            <h3 class="matchH2H__title">head to head</h3>
            <div class="matchH2H__matches">
                <CardGame v-if="showMatches(index, 0)" v-for="(match, index) in h2h" :key="match.fixture.id" :game="match" type="H2H" />
            </div>
        </div>
        <button v-if="showViewAllButton(h2h, 0)" class="matchH2H__viewAllMatches" @click="showAllMatchesEvent(0)">
            <span>show more matches</span>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9973 13H13.9973V19H11.9973V13H5.99731V11H11.9973V5H13.9973V11H19.9973V13Z" fill="#797979" />
            </svg>
        </button>
        <div class="matchH2H__container">
            <h3 class="matchH2H__title">Last Matches: {{ matchDetail.teams.home.name }}</h3>
            <div class="matchH2H__matches">
                <CardGame v-if="showMatches(index, 1)" v-for="(match, index) in homeTeamH2H" :key="match.fixture.id" :game="match" type="H2H" :team="matchDetail.teams.home.id" :winCondition="getWinCondition(match, 'home')" />
            </div>
        </div>
        <button v-if="showViewAllButton(homeTeamH2H, 1)" class="matchH2H__viewAllMatches" @click="showAllMatchesEvent(1)">
            <span>show more matches</span>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9973 13H13.9973V19H11.9973V13H5.99731V11H11.9973V5H13.9973V11H19.9973V13Z" fill="#797979" />
            </svg>
        </button>
        <div class="matchH2H__container">
            <h3 class="matchH2H__title">Last Matches: {{ matchDetail.teams.away.name }}</h3>
            <div class="matchH2H__matches">
                <CardGame v-if="showMatches(index, 2)" v-for="(match, index) in awayTeamH2H" :key="match.fixture.id" :game="match" type="H2H" :team="matchDetail.teams.away.id" :winCondition="getWinCondition(match, 'away')" />
            </div>
        </div>
        <button v-if="showViewAllButton(awayTeamH2H, 2)" class="matchH2H__viewAllMatches" @click="showAllMatchesEvent(2)">
            <span>show more matches</span>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9973 13H13.9973V19H11.9973V13H5.99731V11H11.9973V5H13.9973V11H19.9973V13Z" fill="#797979" />
            </svg>
        </button>
    </div>
</template>

<script>
    import { reactive, watch, computed, ref, toRefs, useFetch, useContext } from "@nuxtjs/composition-api";
    import useH2H from "@/modules/useH2H";

    import store from "@/store.js";

    export default {
        components: {
            CardGame: () => import("@/components/CardGame/CardGame.vue" /* webpackChunkName: "CardGame" */)
        },
        props: {
            matchDetail: {
                type: Object
            }
        },
        setup(props) {
            const { query } = useContext();
            const { loadH2H, h2h, homeTeamH2H, awayTeamH2H } = useH2H();

            const state = ref([
                {
                    clicked: false,
                    maxVisibleMatches: 5
                },
                {
                    clicked: false,
                    maxVisibleMatches: 5
                },
                {
                    clicked: false,
                    maxVisibleMatches: 5
                }
            ]);

            const { fetch, fetchState } = useFetch(async () => {
                await loadH2H(props.matchDetail.teams);
            });

            const showAllMatchesEvent = selectedH2HIndex => {
                state.value[selectedH2HIndex].clicked = true;
                state.value[selectedH2HIndex].maxVisibleMatches = 41;
            };

            const showMatches = (matchIndex, stateIndex) => {
                return matchIndex < state.value[stateIndex].maxVisibleMatches || state.value[stateIndex].clicked;
            };

            const showViewAllButton = (type, stateIndex) => {
                return type.length > 5 && !state.value[stateIndex].clicked;
            };

            const getWinCondition = (match, side) => {
                const isSelectedTeamWon = Object.values(match.teams).find(item => !!item.winner);
                const isSelectedTeamLost = Object.values(match.teams).find(item => !!item.winner);
                if (!isSelectedTeamWon?.id && !isSelectedTeamLost?.id) {
                    return 0;
                } else {
                    if (isSelectedTeamWon?.id === props.matchDetail.teams[side].id) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            };

            watch(
                () => parseInt(query.value.fixture),
                (newValue, prevValue) => {
                    if (!parseInt(query.value.fixture)) return;

                    fetch();
                }
            );

            fetch();
            return {
                fetchState,
                h2h,
                homeTeamH2H,
                awayTeamH2H,
                showAllMatchesEvent,
                getWinCondition,
                state,
                showMatches,
                showViewAllButton
            };
        }
    };
</script>

<style lang="scss" scoped>
    .matchH2H {
        margin-top: 24px;
        margin-bottom: 40px;

        &__container {
            display: grid;
            border: 1px solid #c7c7c7;
            margin-top: 24px;
        }
        &__title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px 16px;
            background-color: #dadada;
            grid-column: 1/-1;
        }

        &__viewAllMatches {
            color: #797979;
            font-weight: 600;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-top: 8px;
            padding: 12px;
            border: 1px dashed #dcdcdc;
        }
    }
</style>
