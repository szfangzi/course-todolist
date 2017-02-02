var increaseButton = document.querySelector('#increase');
var increase = Rx.Observable.fromEvent(increaseButton, 'click')
  // Again we map to a function the will increase the count
  .map(() => state => Object.assign({}, state, {
    count: state.count + 1
  }));

var decreaseButton = document.querySelector('#decrease');
var decrease = Rx.Observable.fromEvent(decreaseButton, 'click')
  // We also map to a function that will decrease the count
  .map(() => state => Object.assign({}, state, {
    count: state.count - 1
  }));

var inputElement = document.querySelector('#input');
var input = Rx.Observable.fromEvent(inputElement, 'keypress')
  // Let us also map the keypress events to produce an inputValue state
  .map(event => state => Object.assign({}, state, {
    inputValue: event.target.value
  }));

// We merge the three state change producing observables
var state = Rx.Observable.merge(
  increase,
  decrease,
  input
).scan((state, changeFn) => changeFn(state), {
  count: 0,
  inputValue: ''
});

// We subscribe to state changes and update the DOM
state.subscribe((state) => {
  document.querySelector('#count').innerHTML = state.count;
  document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
});

// To optimize our rendering we can check what state
// has actually changed
var prevState = {};
state.subscribe((state) => {
  if (state.count !== prevState.count) {
    document.querySelector('#count').innerHTML = state.count;
  }
  if (state.inputValue !== prevState.inputValue) {
    document.querySelector('#hello').innerHTML = 'Hello ' + state.inputValue;
  }
  prevState = state;
});

Rx.Observable.from([1,2,3,4,5])
  .scan((count, a) => count + a, 0)
  .subscribe(count1 => console.log(count1));
