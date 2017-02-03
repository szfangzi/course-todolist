var newTodoEvent = Rx.Observable.fromEvent(document.querySelector('#newTodo'), 'keyup')
  .filter(e => e.keyCode == 13 && e.target.value.trim() != '')
  .map(e => state => Object.assign({}, state, {
    newTodo: e.target.value.trim()
  }));

var todosGet = Rx.Observable.fromPromise(fetch('/todos', {
    method:'GET'
  }))
  .promise.then(rs => rs.json())
  .then(data => state => Object.assign({}, state, {
    todos:data
  }));

// var todosPost = Rx.Observable.fromPromise(fetch('/todos', {
//     method:'POST',
//     body:JSON.stringify({name:todo})
//   }))
//   .promise.then(rs => rs.json())
//   .then(data => state => state.todos.push({name:state.newTodo, isTick:0}));

// We merge the three state change producing observables
var state = Rx.Observable.merge(
  newTodoEvent,
  todosGet
).scan((state, changeFn) => changeFn(state), {
  todos:[],
  newTodo: '',
  unflen:0
});


// To optimize our rendering we can check what state
// has actually changed
var prevState = {};
state.subscribe((state) => {
  if (state.todos !== prevState.todos) {
    render(state.todos);
  }
  if (state.unflen !== prevState.unflen) {
    document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
  }
  prevState = state;
});


function render(todos) {
  document.querySelector('ul').innerHTML = todos.reduce((rs, v) =>
    rs += '<li tid="'+v.id+'"><input type="checkbox" ' + (v.isTick?"checked":"") + '><span>'+v.name+'</span><input type="text"><button>删除</button></li>', '');
}
