// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
export default new Vue({
  render: h => h(App),
  store,
  router,
  components: { App }
}).$mount('#app')
