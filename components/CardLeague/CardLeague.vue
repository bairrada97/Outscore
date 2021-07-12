<template>
    <div class="cardLeague">
        <img class="cardLeague__logo" width="24" height="24" :src="getFirstElement.league.logo" :alt="name + ' logo'" />
        <h3 class="cardLeague__name">{{ name }}</h3>
    </div>
</template>

<script>
    import { watch, computed } from "@nuxtjs/composition-api";
    import useCalendar from "../../modules/useCalendar";
    import store from "@/store.js";

    export default {
        props: {
            name: {
                type: String
            },
            league: {
                type: Array
            }
        },
        setup(props) {
            const getLeague = props.league.values();
            const getFirstElement = getLeague.next().value;

            return {
                getFirstElement
            };
        }
    };
</script>

<style lang="scss" scoped>
    .cardLeague {
        display: grid;
        grid-template-columns: 40px 1fr;
        gap: 0 16px;
        padding: 8px 0;
        align-items: center;
        background-color: var(--color-bg);
        &__logo {
            object-fit: contain;
            padding-left: 16px;
            box-sizing: content-box;
        }

        &__name {
            font-size: 14px;
            font-weight: 400;
        }
    }
</style>
