<template>
    <div class="content">
        <div v-if="userID && currentSerialHash && !errors" class="panel">
            <div class="panel-inner">
                <span class="title">{{ seriesTitle }}</span>
                <multiselect :allow-empty="false"
                             :searchable="false"
                             label="name"
                             :show-labels="false"
                             :options="seasons"
                             trackBy="id"
                             v-model="currentSeason"
                             @input="seasonChanged"
                             :preselect-first="true"
                             maxHeight="200"
                             class="multiselect-custom">
                </multiselect>
                <multiselect v-if="currentSeason"
                             :allow-empty="false"
                             :searchable="false"
                             label="name"
                             @input="episodeChanged"
                             :show-labels="false"
                             v-model="currentEpisode"
                             :options="currentSeason.episodes"
                             trackBy="id"
                             maxHeight="200"
                             :preselect-first="true"
                             class="multiselect-custom">
                </multiselect>
            </div>
        </div>

        <div class="errors" v-else>
        <span class="error">
            Произошла непредвиденная ошибка. Повторите попытку позже
        </span>
        </div>

        <vue-plyr class="video-player-wrapper" ref="plyr">
            <video class="video-player"
                   ref="player"
                   :src="currentEpisode.source"
                   @loadeddata="volumeFix"
                   @play="playerIsPlaying = true"
                   @pause="playerIsPlaying = false">
            </video>
        </vue-plyr>
    </div>
</template>

<script>
    import {PerfectScrollbar} from 'vue2-perfect-scrollbar'
    import axios from 'axios'
    import Multiselect from 'vue-multiselect'

    export default {
        data() {
            return {
                currentSerialHash: this.getParamFromQuery("hash"),
                userID: this.getParamFromQuery("viewer_id"),
                seriesTitle: "",
                isMember: 0,
                groupID: 0,
                currentSeason: null,
                currentEpisode: null,
                seasons: [],
                playerIsPlaying: false,
                playback: 1,
                errors: false
            }
        },
        components: {
            PerfectScrollbar,
            Multiselect,
        },
        computed: {
            player() {
                return this.$refs.plyr.player
            }
        },
        mounted() {
            this.getEpisode();
            setInterval(this.sentProgress, 1600);
        },
        watch: {
            currentSerialHash() {
                this.getEpisode();
            },
            playback(val) {
                this.player.playbackRate = val;
            }
        },
        methods: {
            sentProgress() {
                if (this.playerIsPlaying) {
                    axios.get(this.$store.state.API + `/?act=set_current_time&current_time=${this.player.currentTime}&hash=${this.currentSerialHash}&user_id=${this.userID}`)
                }
            },
            episodeChanged() {
                this.currentSerialHash = this.currentEpisode.hash;
                vkuiConnect.send("VKWebAppSetLocation", {"location": this.currentSerialHash});
            },
            seasonChanged() {
                this.currentEpisode = this.currentSeason.episodes[0];
                this.episodeChanged();
            },
            volumeFix() {
                if (this.currentEpisode.user_progress) {
                    this.player.currentTime = parseFloat(this.currentEpisode.user_progress.time_view);
                } else {
                    this.player.currentTime = this.player.currentTime;
                }
            },
            getParamFromQuery(param) {
                let query = window.location.search.substring(1),
                    params = query.split("&");

                for (let p of params) {
                    let pSplitted = p.split("=");
                    if (pSplitted[0] == param) {
                        return pSplitted[1];
                    }
                }
            },
            increaseSpeed() {
                if (this.playback < 2) {
                    this.playback += 0.25;
                }
            },
            decreaseSpeed() {
                if (this.playback > 0.25) {
                    this.playback -= 0.25;
                }
            },
            joinGroup() {
                if(this.isMember == "0") {
                    vkuiConnect.send("VKWebAppJoinGroup", {"group_id": this.groupID});
                }
            },
            getEpisode() {
                axios.get(this.$store.state.API + `/?act=init&hash=${this.currentSerialHash}&user_id=${this.userID}`).then((res) => {
                    let data = res.data;
                    if (typeof data == "object") {
                        this.seasons = res.data.seasons;
                        this.isMember = res.data.is_member;
                        this.groupID = res.data.group_id;
                        setTimeout(this.joinGroup, 120000);
                        this.currentSeason = this.seasons[res.data.current_season];
                        this.currentEpisode = this.currentSeason.episodes[res.data.current_episode];
                        this.seriesTitle = res.data.name;
                    } else {
                        this.errors = true;
                    }
                });
            }
        }
    }
</script>

<style lang="sass">
    //@import "~vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
    @import "../assets/sass/home"
    @import "~vue-multiselect/dist/vue-multiselect.min.css"
</style>
