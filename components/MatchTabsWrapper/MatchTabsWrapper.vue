<template>
    <div class="matchTabsWrapper" ref="matchDetail">
        <ul class="matchTabsWrapper__list">
            <li class="matchTabsWrapper__tab" :class="{ selected: selectedTab == title }" v-for="title in tabTitles" :key="title" @click="slideTabs(title)">
                {{ title }}
            </li>
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
            const matchDetail = ref("");
            const tabTitles = ref({});
            const selectedTab = ref({});
            onMounted(() => {
                tabTitles.value = slots.default().map(tab => tab.asyncMeta?.data.attrs.title);
                tabTitles.value = tabTitles.value.filter(item => !!item);

                selectedTab.value = tabTitles.value[0];
            });

            provide("selectedTab", selectedTab);

            const slideTabs = title => {
                selectedTab.value = title;
                const tabsList = matchDetail.value.querySelector(".matchTabsWrapper__list");
                const tabsListWidth = tabsList.scrollWidth;
                const tabsListVisibleWidth = tabsList.clientWidth;
                const tabs = matchDetail.value.querySelectorAll(".matchTabsWrapper__tab");
                const selectedTabElement = [...tabs].find(tab => tab.classList.contains("selected"));
                const thirdTabElement = [...tabs].find((tab, index) => index == 2);
                const secondTabElement = [...tabs].find((tab, index) => index == 1);
                if (selectedTab.value.toLowerCase() == thirdTabElement.innerText.toLowerCase()) {
                    const slideToTheEnd = tabsListWidth - tabsListVisibleWidth;
                    tabsList.style.transform = `translateX(${-slideToTheEnd}px)`;
                }

                if (selectedTab.value.toLowerCase() == secondTabElement.innerText.toLowerCase()) {
                    tabsList.style.transform = `translateX(0)`;
                }
            };
            return {
                tabTitles,
                selectedTab,
                slideTabs,
                matchDetail
            };
        }
    });
</script>

<style lang="scss">
    .matchTabsWrapper {
        overflow: hidden;
        &__list {
            display: grid;
            grid-template-columns: repeat(6, 94px);
            transition: transform 0.3s ease;
        }

        &__tab {
            padding: 12px 0;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            text-transform: uppercase;

            &.selected {
                border-bottom: 1px solid var(--color-primary);
                color: var(--color-primary);
            }
        }
    }
</style>
