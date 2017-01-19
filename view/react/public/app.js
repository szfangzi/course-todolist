var Todolist = React.createClass({
  render:function(){
    var todos = this.props.data.map(function (todo) {
      return (
        <Todo edit={todo.edit} tid={todo.id} isTick={todo.isTick} delTodo={this.props.delTodo.bind(this,todo.id)} tick={this.props.tick.bind(this)} changeName={this.props.changeName} >
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
    if(this.props.edit){
      return (
        <li data-tid={this.props.tid} className="edit">
          <input type="checkbox" onChange={this.props.tick} checked={this.props.isTick} /><span onDoubleClick={this.props.changeName}>{this.props.children}</span><input type="text" value={this.props.children} /><button onClick={this.props.delTodo}>删除</button>
        </li>
      )
    }else{
      return (
        <li data-tid={this.props.tid}>
          <input type="checkbox" onChange={this.props.tick} checked={this.props.isTick} /><span onDoubleClick={this.props.changeName}>{this.props.children}</span><input type="text" value={this.props.children} /><button onClick={this.props.delTodo}>删除</button>
        </li>
      )
    }

  }
});

var Nav = React.createClass({
  render:function(){
    return (
      <div>
        <span class="unf-len">还剩下<b></b>个未完成的任务</span>&nbsp;
        <a href="javascript:;" id="all-btn" onClick={this.props.filterList.bind(this, 'all')}>所有任务</a>&nbsp;
        <a href="javascript:;" id="unf-btn" onClick={this.props.filterList.bind(this, 'unf')}>未完成的任务</a>&nbsp;
        <a href="javascript:;" id="f-btn" onClick={this.props.filterList.bind(this, 'f')}>已完成的任务</a>&nbsp;
        <a href="javascript:;" id="del-all-btn" onClick={this.props.delf}>删除所有已完成的任务</a>
      </div>
    )
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      odata:[],
      router:'all',
      newTodo:''
    };
  },
  componentDidMount: function() {
    var that = this;
    fetch(this.props.url, {
      method: 'GET'
    }).then(function(res) {
      res.json().then(function(data) {
        that.setState({odata:data});
        that.filterList();
      });
    }).catch(function(err) {
      console.log(err);
    });
  },
  filterList:function(type){
    var that = this;
    var router = type || this.state.router;
    var list = this.state.odata;
    for (var i = 0; i < list.length; i++) {
      list[i].edit = false;
    };
    this.setState({router:router}, function () {
      router = that.state.router;
      if(router == 'all'){
        that.setState({data:list});
      }else if(router == 'unf'){
        that.setState({
          data:list.filter(function (n) {
            return !n.isTick;
          })
        });
      }else if(router == 'f'){
        that.setState({
          data:list.filter(function (n) {
            return n.isTick;
          })
        });
      }
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
            var list = that.state.odata;
            list.push(data.newTask);
            that.setState({newTodo:'', odata:list}, function () {
              that.filterList();
            });
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
          var list = that.state.odata;
          for (var i = 0; i < list.length; i++) {
            if(list[i].id == data.newTodo.id){
              list[i].isTick = data.newTodo.isTick;
              that.setState({odata:list}, function () {
                that.filterList();
              });
              break;
            }
          }
        }
      });
    }).catch(function(err) {
      console.log(err);
    });

  },
  changeName:function(e){
    var li = e.target.parentNode;

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
          var list = that.state.odata;
          for (var i = 0; i < list.length; i++) {
            if(tid == list[i].id){
              list.splice(i, 1);
              that.setState({odata:list}, function () {
                that.filterList();
              });
              break;
            }

          }
        }
      });
    }).catch(function(err) {
      console.log(err);
    });

  },
  delf:function(){
    var that = this;
    var list = this.state.odata;
    var ids = [];
    for (var i = 0; i < list.length; i++) {
      if(list[i].isTick){
        ids.push(list[i].id);
      }
    }
    fetch('/del', {
      method: 'POST',
      body:JSON.stringify({ids:ids.join(',')})
    }).then(function(res) {
      res.json().then(function(data) {
        if(data.status){
          var unflist = list.filter(function(n){
            return !n.isTick
          });
          that.setState({odata:unflist}, function () {
            that.filterList();
          });
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
        <Todolist data={this.state.data} delTodo={this.delTodo} tick={this.tick} changeName={this.changeName} />
        <Nav filterList={this.filterList} delf={this.delf} />
      </div>
    );
  }
});

ReactDOM.render(
  <App url="/list" />,
  document.getElementById('app')
);
