import Vue from 'vue';
import VueResource from 'vue-resource'
import App from './App.vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(VueResource);

const NotFound = { template: '<p>Page not found</p>' }
const Home = { template: '<p><a href="#about">About</a></p>' }
const About = { template: '<p><a href="#">Home</a></p>' }
const routes = {
    '': Home,
    '#about': About
}

var app = new Vue({
    el: '#app',
    data: {
        currentRoute: window.location.hash
    },
    created: function() {
		window.addEventListener('hashchange', () => {
  			app.currentRoute = window.location.hash
		});
    },
    computed: {
        ViewComponent() {
            return routes[this.currentRoute] || NotFound
        }
    },
    render(h){
        return h(this.ViewComponent) 
    }
});
