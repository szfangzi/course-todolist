<template>
  <ul>
    <li v-for="todo in newlist" v-bind:class="{'del-line':todo.isTick}"><input type="checkbox" v-model="todo.isTick" v-on:click="tick(todo.id, $event)" > <span>{{todo.name}}</span><button v-on:click="del(todo.id)">x</button></li>
  </ul>
</template>

<script>
var eventHub = require('../event.js');
module.exports = {
  name: 'unf',
  props:['list'],
  computed:{
    newlist: function () {
      return this.list.filter(function (val) {
        return val.isTick == false;
      });
    }
  },
  methods:{
    tick:function(id, e) {
      eventHub.$emit('tick', id, e)
    },
    del:function(id) {
      eventHub.$emit('del', id)
    }
  }
}
</script>

<style>

</style>
