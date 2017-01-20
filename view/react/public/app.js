"use strict";

var Todolist = React.createClass({
  displayName: "Todolist",

  render: function render() {
    var todos = this.props.data.map(function (todo) {
      return React.createElement(
        Todo,
        { edit: todo.edit, tid: todo.id, isTick: todo.isTick, delTodo: this.props.delTodo.bind(this, todo.id), tick: this.props.tick.bind(this), editName: this.props.editName, updateName: this.props.updateName },
        todo.name
      );
    }.bind(this));
    return React.createElement(
      "ul",
      null,
      todos
    );
  }
});
var Todo = React.createClass({
  displayName: "Todo",

  render: function render() {
    if (this.props.edit) {
      return React.createElement(
        "li",
        { "data-tid": this.props.tid, className: "edit" },
        React.createElement("input", { type: "checkbox", onChange: this.props.tick, checked: this.props.isTick }),
        React.createElement(
          "span",
          { onDoubleClick: this.props.editName },
          this.props.children
        ),
        React.createElement("input", { type: "text", onBlur: this.props.updateName }),
        React.createElement(
          "button",
          { onClick: this.props.delTodo },
          "\u5220\u9664"
        )
      );
    } else {
      return React.createElement(
        "li",
        { "data-tid": this.props.tid },
        React.createElement("input", { type: "checkbox", onChange: this.props.tick, checked: this.props.isTick }),
        React.createElement(
          "span",
          { onDoubleClick: this.props.editName },
          this.props.children
        ),
        React.createElement("input", { type: "text", onBlur: this.props.updateName }),
        React.createElement(
          "button",
          { onClick: this.props.delTodo },
          "\u5220\u9664"
        )
      );
    }
  }
});

var Nav = React.createClass({
  displayName: "Nav",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "span",
        { "class": "unf-len" },
        "\u8FD8\u5269\u4E0B",
        React.createElement("b", null),
        "\u4E2A\u672A\u5B8C\u6210\u7684\u4EFB\u52A1"
      ),
      "\xA0",
      React.createElement(
        "a",
        { href: "javascript:;", id: "all-btn", onClick: this.props.filterList.bind(this, 'all') },
        "\u6240\u6709\u4EFB\u52A1"
      ),
      "\xA0",
      React.createElement(
        "a",
        { href: "javascript:;", id: "unf-btn", onClick: this.props.filterList.bind(this, 'unf') },
        "\u672A\u5B8C\u6210\u7684\u4EFB\u52A1"
      ),
      "\xA0",
      React.createElement(
        "a",
        { href: "javascript:;", id: "f-btn", onClick: this.props.filterList.bind(this, 'f') },
        "\u5DF2\u5B8C\u6210\u7684\u4EFB\u52A1"
      ),
      "\xA0",
      React.createElement(
        "a",
        { href: "javascript:;", id: "del-all-btn", onClick: this.props.delf },
        "\u5220\u9664\u6240\u6709\u5DF2\u5B8C\u6210\u7684\u4EFB\u52A1"
      )
    );
  }
});

var App = React.createClass({
  displayName: "App",

  getInitialState: function getInitialState() {
    return {
      data: [],
      odata: [],
      router: 'all',
      newTodo: ''
    };
  },
  componentDidMount: function componentDidMount() {
    var that = this;
    $.get(this.props.url, function (data) {
      that.setState({ odata: data }, function () {
        that.filterList();
      });
    });
    //fetch性能差
    //fetch(this.props.url, {
    //  method: 'GET'
    //}).then(function(res) {
    //  res.json().then(function(data) {
    //    that.setState({odata:data}, function () {
    //      that.filterList();
    //    });
    //  });
    //}).catch(function(err) {
    //  console.log(err);
    //});
  },
  filterList: function filterList(type) {
    var that = this;
    var router = type || this.state.router;
    var list = this.state.odata;
    for (var i = 0; i < list.length; i++) {
      list[i].edit = false;
    };
    this.setState({ router: router }, function () {
      router = that.state.router;
      if (router == 'all') {
        that.setState({ data: list });
      } else if (router == 'unf') {
        that.setState({
          data: list.filter(function (n) {
            return !n.isTick;
          })
        });
      } else if (router == 'f') {
        that.setState({
          data: list.filter(function (n) {
            return n.isTick;
          })
        });
      }
    });
  },
  addTodo: function addTodo(e) {
    var todo = this.state.newTodo.trim();
    if (e.keyCode == 13 && todo) {
      var that = this;
      fetch('/add', {
        method: 'POST',
        body: JSON.stringify({ name: todo })
      }).then(function (res) {
        res.json().then(function (data) {
          if (data.status) {
            var list = that.state.odata;
            list.push(data.newTask);
            that.setState({ newTodo: '', odata: list }, function () {
              that.filterList();
            });
          }
        });
      }).catch(function (err) {
        console.log(err);
      });
    }
  },
  tick: function tick(e) {
    var tid = e.target.parentNode.dataset.tid;
    var that = this;
    var list = that.state.odata;
    fetch('/update', {
      method: 'POST',
      body: JSON.stringify({ id: tid, isTick: e.target.checked ? 1 : 0 })
    }).then(function (res) {
      res.json().then(function (data) {
        if (data.status) {
          //正式修改值
          for (var i = 0; i < list.length; i++) {
            if (list[i].id == data.newTodo.id) {
              list[i].isTick = data.newTodo.isTick;
              that.setState({ odata: list }, function () {
                that.filterList();
              });
              break;
            }
          }
        }
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  editName: function editName(e) {
    var li = e.target.parentNode;
    var text = li.querySelector('input[type=text]');
    var tid = li.dataset.tid;
    var list = this.state.odata;
    li.classList.add('edit');
    text.value = e.target.innerHTML;
    text.focus();
  },
  updateName: function updateName(e) {
    var list = this.state.odata;
    var li = e.target.parentNode;
    var tid = li.dataset.tid;
    var that = this;
    fetch('/update', {
      method: 'POST',
      body: JSON.stringify({ id: tid, name: e.target.value })
    }).then(function (res) {
      res.json().then(function (data) {
        if (data.status) {
          for (var i = 0; i < list.length; i++) {
            if (list[i].id == data.newTodo.id) {
              list[i].name = data.newTodo.name;
              that.setState({ odata: list }, function () {
                that.filterList();
                li.classList.remove('edit');
              });
              break;
            }
          }
        }
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  changeNewTodo: function changeNewTodo(e) {
    this.setState({ newTodo: e.target.value });
  },
  delTodo: function delTodo(tid) {
    var that = this;
    var list = that.state.odata;
    fetch('/del', {
      method: 'POST',
      body: JSON.stringify({ ids: tid })
    }).then(function (res) {
      res.json().then(function (data) {
        if (data.status) {

          for (var i = 0; i < list.length; i++) {
            if (tid == list[i].id) {
              list.splice(i, 1);
              that.setState({ odata: list }, function () {
                that.filterList();
              });
              break;
            }
          }
        }
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  delf: function delf() {
    var that = this;
    var list = this.state.odata;
    var ids = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].isTick) {
        ids.push(list[i].id);
      }
    }
    fetch('/del', {
      method: 'POST',
      body: JSON.stringify({ ids: ids.join(',') })
    }).then(function (res) {
      res.json().then(function (data) {
        if (data.status) {
          unflist = list.filter(function (n) {
            return !n.isTick;
          });
          that.setState({ odata: unflist }, function () {
            that.filterList();
          });
        }
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "app" },
      React.createElement(
        "h1",
        null,
        "\u4EFB\u52A1\u5217\u8868"
      ),
      React.createElement("input", { type: "text", placeholder: "\u8BF7\u586B\u5199\u4F60\u7684\u4EFB\u52A1", name: "newTask", onChange: this.changeNewTodo, onKeyDown: this.addTodo, value: this.state.newTodo }),
      React.createElement(Todolist, { data: this.state.data, delTodo: this.delTodo, tick: this.tick, editName: this.editName, updateName: this.updateName }),
      React.createElement(Nav, { filterList: this.filterList, delf: this.delf })
    );
  }
});

ReactDOM.render(React.createElement(App, { url: "/list" }), document.getElementById('app'));