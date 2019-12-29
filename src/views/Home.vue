<template>
  <div class="content">
    <div class="panel">
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
                     class="multiselect-custom">
        </multiselect>
        <multiselect v-if="currentSeason"
                     :allow-empty="false"
                     :searchable="false"
                     label="name"
                     @input="episodeChanged"
                     :show-labels="false"
                     v-model="currentEpisode"
                     :options="currentSeason.series"
                     trackBy="id"
                     :preselect-first="true"
                     class="multiselect-custom">
        </multiselect>
      </div>
    </div>
    <video-player v-if="currentEpisode" :options="playerOptions" :playsinline="true" class="plyr-wrapper" ref="plyr">
    </video-player>
  </div>
</template>

<script>
  import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
  import axios from 'axios'
  import Multiselect from 'vue-multiselect'
  import { videoPlayer } from 'vue-video-player'

  export default {
    data() {
      return {
        currentSerialHash: this.getParamFromQuery("hash"),
        userID: this.getParamFromQuery("viewer_id"),
        seriesTitle: "",
        currentSeason: null,
        currentEpisode: null,
        seasons: [],
        seasonsArray: [],
        playerOptions: {
          height: '360',
          autoplay: true,
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [],
        }
      }
    },
    components: {
      PerfectScrollbar,
      Multiselect,
      videoPlayer
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
      }
    },
    methods: {
      sentProgress() {
        if(this.player.playing) {
          axios.get(this.$store.state.API+`/?act=set_current_time&current_time=${this.player.currentTime}&hash=${this.currentSerialHash}&user_id=${this.userID}`)
        }
      },
      episodeChanged() {
        this.currentSerialHash = this.currentEpisode.hash;
        vkuiConnect.send("VKWebAppSetLocation", {"location": this.currentSerialHash})
      },
      seasonChanged() {
        this.currentEpisode = this.currentSeason.series[0];
        this.episodeChanged();
      },
      volumeFix(){
        if(this.currentEpisode.user_progress) {
          this.player.currentTime = parseFloat(this.currentEpisode.user_progress.time_view);
        } else {
          this.player.currentTime = this.player.currentTime;
        }
      },
      getParamFromQuery(param) {
        let query = window.location.search.substring(1),
            params = query.split("&");

        for(let p of params) {
          let pSplitted = p.split("=");
          if(pSplitted[0] == param) {
            return pSplitted[1];
          }
        }
      },
      getEpisode() {
        axios.get(this.$store.state.API+`/?act=init&hash=${this.currentSerialHash}&user_id=${this.userID}`).then((res)=>{
          let data = res.data;
          this.seasons = res.data.seasons;
          this.currentSeason = this.seasons[res.data.current_season];
          this.currentEpisode = this.currentSeason.series[res.data.current_seria];
          this.playerOptions.sources.push({
            type: "video/mp4",
            // mp4
            src: this.currentEpisode.source,
          })
          /*for(let s in this.seasons) {
            this.seasonsArray.push(this.seasons[s]);
          }*/
          this.seriesTitle = res.data.name;
        });
      }
    }
  }
</script>

<style lang="sass">
  //@import "~vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
  @import "../assets/sass/home"
  @import "~vue-multiselect/dist/vue-multiselect.min.css"
  @import "~video.js/dist/video-js.css"
</style>
