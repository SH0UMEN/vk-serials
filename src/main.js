import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VuePlyr from 'vue-plyr'

Vue.config.productionTip = false;

/*function getParamFromQuery(param) {
  let query = window.location.search.substring(1),
      params = query.split("&");

  for(let p of params) {
    let pSplitted = p.split("=");
    if(pSplitted[0] == param) {
      return pSplitted[1];
    }
  }
}*/

//let platform = getParamFromQuery('platform');
//let fscreen = platform == 'html5_android' || platform == 'html5_ios';

Vue.use(VuePlyr, {
  plyr: {
    fullscreen: { enabled: true },
    options: [
        "volume"
    ],
    disableContextMenu: false
  },
  emit: ['ended']
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
