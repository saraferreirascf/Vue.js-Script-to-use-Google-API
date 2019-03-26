import Vue from 'vue'
import App from './App'
import router from './router'
import VueGoogleApi from 'vue-google-api'

const config = {
  apiKey: YOUR_API_KEY,
  clientId: YOUR_CLIENT_ID,
  scope: 'profile https://www.googleapis.com/auth/drive ',
  cookiepolicy: 'single_host_origin'
}

Vue.use(VueGoogleApi, config,vmodal, {
  dialog: false,
  dynamic: true
})



/* eslint-disable no-new */
export const globalvm = new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

// expose component to global scope
if (typeof window !== 'undefined' && window.Vue) {
  Vue.component('vue-simple-spinner', VueSimpleSpinner)
}

export { VueSimpleSpinner }

export default VueSimpleSpinner
