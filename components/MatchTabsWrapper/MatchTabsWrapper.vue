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
    import { defineComponent, provide, reactive, ref, onMounted, useFetch, onActivated, computed, watch, useContext } from "@nuxtjs/composition-api";
    import store from "@/store.js";
    import axios from "axios";

    export default defineComponent({
        props: {
            title: {
                type: String
            }
        },
        setup(props, { slots }) {
            const { query } = useContext();

            const state = reactive({
                initialX: null,
                initialY: null,
                currentX: 0,
                currentY: 0,
                diffX: 0,
                diffY: 0,
                isDragging: false,
                isStartTouch: false
            });
            const matchDetail = ref("");
            const tabTitles = ref({});
            const selectedTab = ref({});

            onMounted(() => {
                tabTitles.value = slots.default().map(tab => tab.componentOptions?.propsData.title);
                tabTitles.value = tabTitles.value.filter(item => !!item);

                selectedTab.value = tabTitles.value[0];

                const body = document.querySelector("body");
                body.addEventListener("touchstart", startTouch, { passive: false });
                body.addEventListener("mousedown", startTouch, { passive: false });

                body.addEventListener("touchmove", moveTouch, { passive: false });
                body.addEventListener("mousemove", moveTouch, { passive: false });

                body.addEventListener("mouseup", touchEnd, { passive: false });
                body.addEventListener("touchend", touchEnd, { passive: false });
            });
            provide("selectedTab", selectedTab);

            const slideTabs = title => {
                selectedTab.value = title;
                const tabsList = matchDetail.value.querySelector(".matchTabsWrapper__list");
                const tabsListWidth = tabsList.scrollWidth;
                const tabs = matchDetail.value.querySelectorAll(".matchTabsWrapper__tab");
                const selectedTabIndex = [...tabs].findIndex((element, index) => element.innerText.toLowerCase() == selectedTab.value.toLowerCase());

                if (selectedTabIndex == 0 || selectedTabIndex == 1) {
                    tabsList.style.transform = `translateX(0px)`;
                    state.diffX = 0;
                } else if (selectedTabIndex == tabs.length - 3 || selectedTabIndex == tabs.length - 2 || selectedTabIndex == tabs.length - 1) {
                    tabsList.style.transform = `translateX(${-(tabsListWidth - tabsList.clientWidth)}px)`;
                    state.diffX = parseInt(tabsListWidth - tabsList.clientWidth);
                } else {
                    tabsList.style.transform = `translateX(${-tabsListWidth + 94 * (tabs.length - selectedTabIndex + 1)}px)`;
                    state.diffX = parseInt(`${-tabsListWidth + 94 * (tabs.length - selectedTabIndex + 1)}`);
                }
            };

            const userNotStartedDrag = () => state.initialX === null || state.initialY === null || !state.isStartTouch;
            const userSlideYCoordinate = () => Math.abs(state.diffX) < Math.abs(state.diffY);
            const userSlideToRight = () => state.diffX > 0;

            const setSliderValues = event => {
                state.isDragging = true;
                state.currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
                state.currentY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
                state.diffX = state.initialX - state.currentX;
                state.diffY = state.initialY - state.currentY;
            };

            const startTouch = event => {
                const isTargetTabs = event => event.target.closest(".matchTabsWrapper__list");
                if (!isTargetTabs(event)) return;
                state.initialX = event instanceof MouseEvent ? (state.diffX += event.clientX) : (state.diffX += event.touches[0].clientX);
                state.initialY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
                state.isStartTouch = true;
            };
            const moveTouch = event => {
                const tabsList = matchDetail.value.querySelector(".matchTabsWrapper__list");
                if (userNotStartedDrag()) return;
                setSliderValues(event);
                translateCalendarOnSwipe(tabsList);
            };

            const translateCalendarOnSwipe = tabs => {
                if (userSlideYCoordinate()) return;

                tabs.style.transition = "none";
                if (state.diffX > tabs.scrollWidth - tabs.clientWidth) {
                    tabs.style.transform = `translate3d(${-(tabs.scrollWidth - tabs.clientWidth)}px, 0, 0) `;
                    state.diffX = tabs.scrollWidth - tabs.clientWidth;
                    return;
                }

                if (state.diffX < 0) {
                    tabs.style.transform = `translate3d(0px, 0, 0) `;
                    state.diffX = 0;
                    return;
                }
                userSlideToRight() ? (tabs.style.transform = `translate3d(-${state.diffX}px, 0, 0) `) : (tabs.style.transform = `translate3d(${-state.diffX}px, 0, 0) `);
                return;
            };

            const touchEnd = event => {
                const tabsList = matchDetail.value.querySelector(".matchTabsWrapper__list");
                state.isStartTouch = false;
                if (!state.isDragging) return;
                if (userSlideYCoordinate()) return;
                tabsList.style.transition = "transform 0.3s ease";

                // userSlideToRight() ? (tabsList.style.transform = `translate3d(-${state.diffX}px, 0, 0) `) : (tabsList.style.transform = `translate3d(${-state.diffX}px, 0, 0) `);

                state.isDragging = false;
            };

            watch(
                () => parseInt(query.value.fixture),
                (newValue, prevValue) => {
                    if (!parseInt(query.value.fixture)) return;
                    const tabsList = matchDetail.value.querySelector(".matchTabsWrapper__list");
                    tabsList.style.transform = `translate3d(0px, 0, 0) `;
                    state.diffX = 0;
                    selectedTab.value = tabTitles.value[0];
                }
            );

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
            cursor: pointer;

            &.selected {
                border-bottom: 1px solid var(--color-primary);
                color: var(--color-primary);
            }
        }
    }
</style>
