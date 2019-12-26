<template>
  <div id="app">
    <vue-plyr ref="plyr">
      <video src="video.mp4"></video>
    </vue-plyr>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    computed: {
      player() {
        return this.$refs.plyr.player
      }
    },
  }
</script>

<style lang="sass">
  @import "./assets/sass/main"
</style>
