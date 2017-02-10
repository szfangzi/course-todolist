var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');

// Vue.use(VueRouter);
Vue.use(VueResource);

var App = require('./App.js');
Vue.component('app', App);
// var App2 = require('./App2.vue');

// const routes = {
//   '/': App,
//   '/about': App2
// }

new Vue({
  el: 'body',
  render: h => {
    return h('div');
  }
})

