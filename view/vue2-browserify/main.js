var Vue = require('vue');
var VueRouter = require('vue-router');
var VueResource = require('vue-resource');

Vue.use(VueRouter);
Vue.use(VueResource);

var App = require('./App.vue');
var App2 = require('./App2.vue');

const routes = {
  '/': App,
  '/about': App2
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  created:function() {
    console.log(333,this.aaaa);
  },
  computed: {
    aaaa:function() {
      return routes[this.currentRoute]
    }
  },
  render: h => {
    return h(App2);
  }
})

