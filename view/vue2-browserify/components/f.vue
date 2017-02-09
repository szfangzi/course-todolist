<template>
  <ul>
    <li v-for="todo in newlist" v-bind:class="{'del-line':todo.isTick}"><input type="checkbox" v-model="todo.isTick" v-on:click="tick(todo.id, $event)" > <span>{{todo.name}}</span><button v-on:click="del(todo.id)">x</button></li>
  </ul>
</template>

<script>
var eventHub = require('../event.js');
module.exports = {
  name: 'f',
  props:['list'],
  computed:{
    newlist: function () {
      console.log(222,this.list);
      return this.list.filter(function (val) {
        return val.isTick == true;
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
