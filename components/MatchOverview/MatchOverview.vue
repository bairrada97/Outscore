<template>
    <div class="matchOverview" v-if="match">
        <div class="matchOverview__period" v-for="(periods, name) in displayEvents" :key="name">
            <h3 class="matchOverview__periodName" v-if="periods">{{ name }} Half</h3>
            <div class="matchOverview__periodTeam">
                <CardEvent v-for="(event, index) in periods" :key="index" :event="event" />
            </div>
        </div>
    </div>
</template>

<script>
    import { watch, computed } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";

    export default {
        props: {
            match: {
                type: Object
            }
        },
        components: {
            CardEvent: () => import("@/components/CardEvent/CardEvent.vue" /* webpackChunkName: "CardEvent" */)
        },
        setup(props) {
            const { match } = props;
            const displayEvents = computed(leagues => {
                return match.events?.reduce((acc, event) => {
                    let homeTeam = computed(() => match.teams.home);
                    let awayTeam = computed(() => match.teams.away);

                    event.time.elapsed <= 45 ? (acc.first = acc.first || new Set()) : (acc.second = acc.second || new Set());
                    Object.defineProperty(event, "side", { value: "", writable: true, enumerable: true, configurable: true });

                    if (event.time.elapsed <= 45) {
                        // acc.first.teams[homeTeam.value.name] = acc.first.teams[homeTeam.value.name] || new Set();
                        // acc.first.teams[awayTeam.value.name] = acc.first.teams[awayTeam.value.name] || new Set();

                        event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
                        acc.first.add(event);
                    } else {
                        // acc.second.[homeTeam.value.name] = acc.second.[homeTeam.value.name] || new Set();
                        // acc.second.[awayTeam.value.name] = acc.second.[awayTeam.value.name] || new Set();
                        event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");

                        acc.second.add(event);
                    }

                    return acc;
                }, {});
            });
            console.log(displayEvents);
            return {
                displayEvents
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
