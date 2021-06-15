<template>
    <div class="matchOverview">
        <div class="matchOverview__period" v-for="(periods, name) in reversePeriods" :key="name">
            <h3 class="matchOverview__periodName">{{ periods.period }} Half</h3>
            <div class="matchOverview__periodTeam">
                <CardEvent v-for="(event, index) in periods.events" :key="index" :event="event" />
            </div>
        </div>
    </div>
</template>

<script>
    import { reactive, watch, computed, ref, onMounted, onBeforeUnmount } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";

    export default {
        components: {
            CardEvent: () => import("@/components/CardEvent/CardEvent.vue" /* webpackChunkName: "CardEvent" */)
        },
        props: {
            matchDetail: {
                type: Object
            }
        },
        setup(props) {
            const displayEvents = computed(() => {
                return props.matchDetail.events?.reduce((acc, event) => {
                    let homeTeam = computed(() => props.matchDetail.teams.home);
                    let awayTeam = computed(() => props.matchDetail.teams.away);

                    event.time.elapsed <= 45 ? (acc.first = acc.first || new Set()) : (acc.second = acc.second || new Set());
                    Object.defineProperty(event, "side", { value: "", writable: true, enumerable: true, configurable: true });

                    if (event.time.elapsed <= 45) {
                        event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
                        acc.first.add(event);
                    } else {
                        event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
                        acc.second.add(event);
                    }

                    return acc;
                }, {});
            });

            const reversePeriods = computed(() => {
                return Object.keys(displayEvents.value)
                    .reverse()
                    .map(key => {
                        const events = Array.from(displayEvents.value[key]);
                        events.reverse();

                        return {
                            period: key,
                            events
                        };
                    });
            });

            // watch(
            //     () => displayEvents.value,
            //     (newValue, prevValue) => {
            //         console.log(newValue, prevValue);
            //     }
            // );

            return {
                displayEvents,
                reversePeriods
            };
        }
    };
</script>

<style lang="scss" scoped>
    .matchOverview {
        margin-top: 24px;

        &__period {
            display: grid;
            border: 1px solid #c7c7c7;
            margin-bottom: 16px;
        }
        &__periodName {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px 16px;
            background-color: #dadada;
            grid-column: 1/-1;
        }
    }
</style>
