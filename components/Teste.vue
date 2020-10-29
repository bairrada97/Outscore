<template>
    <div>
        <nuxt-link :to="{ name: 'game', query: { fixture: item.fixture.id } }">
            <div>{{ item.league.country }}</div>
            <div class="teams">
                <div class="homeTeam">
                    <div class="detail">
                        <img :data-src="item.teams.home.logo" alt="" title="" v-lazy-load />

                        <span>{{ item.teams.home.name }}</span>
                    </div>

                    <div class="goal">
                        <span>{{ item.goals.home }}</span>
                    </div>
                </div>
                <div class="awayTeam">
                    <div class="detail">
                        <img :data-src="item.teams.away.logo" alt="" title="" v-lazy-load />

                        <span>{{ item.teams.away.name }}</span>
                    </div>

                    <div class="goal">
                        <span>{{ item.goals.away }}</span>
                    </div>
                </div>
                <div class="time">
                    <span>{{ item.fixture.status.elapsed }}'</span>
                    <span>{{ item.fixture.status.short }}</span>
                </div>
            </div>
            <div></div>
        </nuxt-link>
    </div>
</template>

<script>
    import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted } from "@nuxtjs/composition-api";
    import store from "@/store.js";
    import axios from "axios";

    export default defineComponent({
        props: ["item"],

        setup() {
            return {};
        }
    });
</script>

<style lang="scss">
    div {
        display: block;
    }

    .ze {
        margin-bottom: 10px;
    }

    .teams {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        width: 100%;
        border-bottom: 1px solid #187c56;
        padding: 20px 0;
    }

    .homeTeam,
    .awayTeam {
        display: grid;

        .detail {
            grid-row: 1;
        }

        .goal {
            grid-row: 1;
            justify-self: flex-end;
        }
    }
    .time {
        grid-row: 1/3;
        align-self: center;
        margin-left: 20px;
    }
    .homeTeam {
        grid-column: 1;
        grid-row: 1;
    }

    .awayTeam {
        grid-row: 2;
        grid-column: 1;
    }

    img {
        width: 30px;
        margin-right: 10px;
    }

    a {
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        color: #187c56;
    }

    span {
        font-size: 24px;

        &.goal {
            color: #7ccc15;
        }
    }
    .container {
        margin: 0 auto;
        min-height: 100vh;
        display: flex;
        padding: 0 10vw;
        flex-direction: column;
    }

    .title {
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        display: block;
        font-weight: 300;
        font-size: 100px;
        color: #35495e;
        letter-spacing: 1px;
    }

    .subtitle {
        font-weight: 300;
        font-size: 42px;
        color: #526488;
        word-spacing: 5px;
        padding-bottom: 15px;
    }

    .links {
        padding-top: 15px;
    }
</style>
