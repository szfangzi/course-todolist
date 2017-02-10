<style>

</style>

<template>
  <div>
    <h1>任务列表</h1>
    <input type="text" v-model="newTodo" v-on:keypress.enter="add">
    <all v-bind:list="list"></all>
    <f v-bind:list="list"></f>
    <unf v-bind:list="list"></unf>
    <!-- <component :is="currentView" v-bind:list="list"></component> -->
    <span>还剩下<b>{{unFLen}}</b>个未完成的任务</span>
    <a href="#all">所有任务</a>
    <a href="#unf">未完成的任务</a>
    <a href="#f">已完成的任务</a>
    <a href="javascript:;" v-on:click="delf">删除所有已完成的任务</a>
  </div>
</template>

<script>
var All = require('./components/all.vue');
var Unf = require('./components/unf.vue');
var F = require('./components/f.vue');

var eventHub = require('./event.js');
module.exports = {
  name:'list',
  components:{
    All,
    Unf,
    F
  },
  data:() => {
    return {
      newTodo: '',
      list:[],
      unFLen:0,
      currentView:location.hash.split('#')[1] || 'all'
    }
  },
  watch:{
    'list':{
      handler:function(val, oldVal){
        this.unFLen = this.list.filter(todo => !todo.isTick).length;
      },
      deep:true
    }
  },
  created:function () {
    eventHub.$on('init', this.init);
    eventHub.$on('tick', this.tick);
    eventHub.$on('del', this.del);
    eventHub.$emit('init');
    window.onhashchange = function () {
      this.currentView = location.hash.split('#')[1];
    }
  },
  beforeDestroy: function () {
    console.log('beforeDestroy');
    eventHub.$off('init', this.init);
    eventHub.$off('tick', this.tick)
    eventHub.$off('del', this.del)
  },
  methods:{
    init:function(){
      let ws = new WebSocket("ws://localhost:3000/todos");
      ws.onmessage = function (e) {
        this.list = JSON.parse(e.data);
      }.bind(this);
      ws.onopen = function(e) {
        ws.send("1");
      }

      setInterval(function() {
        if(ws.readyState === 1){
          ws.send("1");
        }else if(ws.readyState === 3){
          ws = new WebSocket("ws://localhost:3000/todos");
          ws.onmessage = function (e) {
            this.list = JSON.parse(e.data);
          }.bind(this);
        }

      }.bind(this), 3000);
    },
//    新增任务
    add: function () {
      this.$http.post('/todos',{
        name:this.newTodo
      }).then(function (res) {
        this.list.push(res.data);
        this.newTodo = '';
      }.bind(this), function (err) {
        console.log(err);
      });
    },
//    删除任务
    del: function (id) {
      this.$http.delete('/todos/'+id).then(function (res) {
        var obj = this.list.map(function(v, i) {
          return {v:v,i:i};
        }).filter(function(obj, i) {
          return obj.v.id === id;
        })[0];
        this.list.splice(obj.i, 1);
      }.bind(this), function (err) {
        console.log(err);
      });
    },
    tick: function (id, e) {
      this.$http.put('/todos/'+id, {
        isTick:e.target.checked
      }).then(function (res) {
        var id = res.data.id;
        var isTick = res.data.isTick;
        this.list.map(function (n) {
          if(n.id == id){
            n.isTick = isTick;
          }
        })
      }.bind(this), function (err) {
        console.log(err);
      });
    },
    delf: function () {
      let filteredTodosIds = this.list.filter(todo => todo.isTick).map(todo => todo.id).join(',');
      this.$http.post('/todos/delf', {
        filteredTodosIds:filteredTodosIds
      }).then(function (res) {
        this.list = this.list.filter(todo => !todo.isTick);
      }.bind(this), function (err) {
        console.log(err);
      });
    }

  }

}
</script>
