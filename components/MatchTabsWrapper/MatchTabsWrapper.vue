<template>
    <div class="MatchTabsWrapper">
        <ul>
            <li v-for="title in tabTitles" :key="title" @click="selectedTab = title">{{ title }}</li>
        </ul>

        <slot />
    </div>
</template>

<script>
    import { defineComponent, provide, toRefs, ref, onMounted, useFetch, onActivated, computed, watch } from "@nuxtjs/composition-api";
    import store from "@/store.js";
    import axios from "axios";

    export default defineComponent({
        setup(props, { slots }) {
            const tabTitles = ref({});
            const selectedTab = ref({});
            onMounted(() => {
                tabTitles.value = slots.default().map(tab => tab.asyncMeta?.data.attrs.title);
                selectedTab.value = tabTitles.value[0];
            });

            provide("selectedTab", selectedTab);
            return {
                tabTitles,
                selectedTab
            };
        }
    });
</script>

<style lang="scss">
    .matchTabsWrapper {
    }
</style>
