var Vue = require('vue');
import VueResource from 'vue-resource'
import App from './App.vue'
// import VueRouter from 'vue-router';

Vue.use(VueResource);

new Vue({
  el: '#app',
  render: h => h(App)
})

