<template>
    <div class="matchTab" v-show="title == selectedTab">
        <slot />
    </div>
</template>

<script>
    import { defineComponent, provide, inject, ref, onMounted, useFetch, onActivated, computed, watch } from "@nuxtjs/composition-api";
    import store from "@/store.js";
    import axios from "axios";

    export default defineComponent({
        props: ["title"],
        setup(props, { slots }) {
            const selectedTab = inject("selectedTab");

            return {
                selectedTab
            };
        }
    });
</script>

<style lang="scss">
    .matchTab {
    }
</style>
