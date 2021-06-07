<template>
    <div class="matchOverview" v-if="match">
        <div class="matchOverview__period" v-for="(periods, name) in reversePeriods" :key="name">
            <h3 class="matchOverview__periodName" v-if="periods">{{ periods.period }} Half</h3>
            <div class="matchOverview__periodTeam" v-if="periods">
                <CardEvent v-for="(event, index) in periods.events" :key="index" :event="event" />
            </div>
        </div>
    </div>
</template>

<script>
    import { watch, computed, ref } from "@nuxtjs/composition-api";
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
            const displayEvents = ref({});

            displayEvents.value = match.events?.reduce((acc, event) => {
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

            //  .reverse()
            //         .map(key => ({ ...displayEvents.value[key], key }))
            //     Object.keys(displayEvents.value)
            const reversePeriods = computed(() =>
                Object.keys(displayEvents.value)
                    .reverse()
                    .map(key => ({ period: key, events: displayEvents.value[key] }))
            );

            // watch(
            //     () => match.fixture.id,
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
