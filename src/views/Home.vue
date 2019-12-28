<template>
  <div class="content">
    <div class="panel">
      <div class="panel-inner">
        <span class="title">{{ seriesTitle }}</span>
        
      </div>
    </div>
    <vue-plyr class="plyr-wrapper" ref="plyr">
      <video v-show="episodes" @loadeddata="volumeFix" :src="episodes[currentEpisode]['source']"></video>
    </vue-plyr>
  </div>
</template>

<script>
  import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
  import axios from 'axios'

  export default {
    data() {
      return {
        currentSerialHash: this.getParamFromQuery("hash"),
        userID: this.getParamFromQuery("viewer_id"),
        episodes: null,
        seriesTitle: "",
        currentEpisode: 0
      }
    },
    components: {
      PerfectScrollbar
    },
    computed: {
      player() {
        return this.$refs.plyr.player
      }
    },
    mounted() {
      this.getEpisode();
    },
    watch: {
      currentSerialHash: {
        handler: ()=>{
          this.getEpisode();
        }
      }
    },
    methods: {
      volumeFix(){
        this.player.currentTime = this.player.currentTime;
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
          this.episodes = data["season"];
          this.currentEpisode = data["current_seria"];
          this.seriesTitle = data["name"]
        });
      }
    }
  }
</script>

<style lang="sass">
  @import "~vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
  @import "../assets/sass/home"
</style>
