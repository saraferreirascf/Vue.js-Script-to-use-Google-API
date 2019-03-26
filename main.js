// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './lib/css'
import './lib/script'
import './lib/global'
import './lib/custom.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import EventBus from './lib/eventBus.js'
import axios from 'axios'
import vmodal from 'vue-js-modal'
import VueSimpleSpinner from './widgets/Spinner'
//import GoogleAuth from 'vue-google-authenticator'
import VueGoogleApi from 'vue-google-api'

Vue.prototype.$bus = EventBus
Vue.prototype.$http = axios

if (window.webpackHotUpdate) {
  console.log('This is dev')
  axios.defaults.baseURL = 'http://localhost:3000/'
} else {
  axios.defaults.baseURL = window.location.protocol + '//' + window.location.host
}

axios.credentials = false

const config = {
  apiKey: 'AIzaSyAGB7160bJr9UqAsIKs6h8h9jH9HSQlbf0',
  clientId: '298218985189-k7niq94udl860m43bfiaqb3gb3l5ntfp.apps.googleusercontent.com',
  scope: 'profile https://www.googleapis.com/auth/drive ',
  cookiepolicy: 'single_host_origin'
  //discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
}

Vue.use(VueGoogleApi, config,vmodal, {
  dialog: false,
  dynamic: true
})

//Vue.googleAuth().load()

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
