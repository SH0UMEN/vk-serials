<template>
  <div class="content">
    <vue-plyr class="plyr-wrapper" ref="plyr">
      <video @loadeddata="volumeFix" src="video.mp4"></video>
    </vue-plyr>
    <perfect-scrollbar class="playlist">
      <a href="#">Серия 1</a>
      <a href="#">Серия 2</a>
      <a href="#">Серия 3</a>
    </perfect-scrollbar>
  </div>
</template>

<script>
  import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

  export default {
    data() {
      return {
        currentSerialHash: this.getParamFromQuery("hash"),
        userID: this.getParamFromQuery("viewer_id")
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
      alert(this.currentSerialHash + " " + this.userID);
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
      }
    }
  }
</script>

<style lang="sass">
  @import "~vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"
  @import "../assets/sass/home"
</style>
