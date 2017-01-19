var data = [{id:1,name:'ken',isTick:0},{id:2,name:'ken1',isTick:1},{id:3,name:'ken2',isTick:0}];

var Todolist = React.createClass({
  render:function(){
    var todos = this.props.data.map(function (todo) {
      return (
        <Todo tid={todo.id} isTick={todo.isTick} delTodo={this.props.delTodo.bind(this,todo.id)} tick={this.props.tick.bind(this)} >
          {todo.name}
        </Todo>
      )
    }.bind(this));
    return (
      <ul>
        {todos}
      </ul>
    );
  }
});
var Todo = React.createClass({
  render:function(){
    return (
      <li data-tid={this.props.tid}>
        <input type="checkbox" onChange={this.props.tick} checked={this.props.isTick} /><span>{this.props.children}</span><input type="text" value={this.props.children} /><button onClick={this.props.delTodo}>删除</button>
      </li>
    )
  }
});

var Nav = React.createClass({
  render:function(){
    return (
      <div>
        <span class="unf-len">还剩下<b></b>个未完成的任务</span>&nbsp;
        <a href="javascript:;" id="all-btn">所有任务</a>&nbsp;
        <a href="javascript:;" id="unf-btn">未完成的任务</a>&nbsp;
        <a href="javascript:;" id="f-btn">已完成的任务</a>&nbsp;
        <a href="javascript:;" id="del-all-btn">删除所有已完成的任务</a>
      </div>
    )
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      newTodo:''
    };
  },
  componentDidMount: function() {
    var that = this;
    fetch(this.props.url, {
      method: 'GET'
    }).then(function(res) {
      res.json().then(function(data) {
        that.setState({data:data});
      });
    }).catch(function(err) {
      console.log(err);
    });
  },
  addTodo:function(e){
    var todo = this.state.newTodo.trim();
    if(e.keyCode == 13 && todo){
      var that = this;
      fetch('/add', {
        method: 'POST',
        body:JSON.stringify({name:todo})
      }).then(function(res) {
        res.json().then(function(data) {
          if(data.status){
            var list = that.state.data;
            list.push(data.newTask);
            that.setState({newTodo:'', data:list});
          }
        });
      }).catch(function(err) {
        console.log(err);
      });

    }
  },
  tick:function(e){
    var tid = e.target.parentNode.dataset.tid;
    var that = this;
    fetch('/update', {
      method: 'POST',
      body:JSON.stringify({id:tid, isTick:e.target.checked?1:0})
    }).then(function(res) {
      res.json().then(function(data) {
        if(data.status){
          var list = that.state.data;
          for (var i = 0; i < list.length; i++) {
            if(list[i].id == data.newTodo.id){
              list[i].isTick = data.newTodo.isTick;
              that.setState({data:list});
              break;
            }
          }
        }
      });
    }).catch(function(err) {
      console.log(err);
    });

  },
  changeNewTodo:function(e){
    this.setState({newTodo:e.target.value});
  },
  delTodo:function(tid){
    var that = this;
    fetch('/del', {
      method: 'POST',
      body:JSON.stringify({ids:tid})
    }).then(function(res) {
      res.json().then(function(data) {
        if(data.status){
          var list = that.state.data;
          for (var i = 0; i < list.length; i++) {
            if(tid == list[i].id){
              list.splice(i, 1);
              that.setState({data:list});
              break;
            }

          }
        }
      });
    }).catch(function(err) {
      console.log(err);
    });

  },
  render: function() {
    return (
      <div className="app">
        <h1>任务列表</h1>
        <input type="text" placeholder="请填写你的任务" name="newTask" onChange={this.changeNewTodo} onKeyDown={this.addTodo} value={this.state.newTodo} />
        <Todolist data={this.state.data} delTodo={this.delTodo} tick={this.tick} />
        <Nav />
      </div>
    );
  }
});

ReactDOM.render(
  <App url="/list" />,
  document.getElementById('app')
);
