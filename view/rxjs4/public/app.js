const {label, h1, ul, li, hr, span, div, b, a, input, button, makeDOMDriver} = CycleDOM;
const {makeHTTPDriver} = CycleHTTPDriver;

function main(sources) {

  const newTodoAction$ = sources.DOM.select('.newTodo').events('keypress')
    .filter(e => e.keyCode === 13 && String(e.target.value).trim())
    .map(e => {
      return {name: e.target.value.trim(), isTick: false}
    });

  const request$ = Rx.Observable.of({
    url: '/todos',
    method: 'GET'
  },{
    url: '/todos',
    method: 'POST'
  });

  const resGET$$ = sources.HTTP
    .filter(resGET$ => {
      console.log(resGET$.request.method)
      return resGET$.request.method === 'GET';;
    });
  const resGET$ = resGET$$.switch();
  const todos$ = resGET$.map(res => res.body)
    .merge(newTodoAction$).scan((prev, curr) => {
      prev.push(curr);
      return prev;
    });

  return {
    DOM:todos$
      .map(todos => {
        return div('#app', [
          h1('任务列表'),
          input('.newTodo', {placeholder:"请填写你的任务"}),
          ul(todos.map(todo =>
                li({tid:todo.id}, [
                  input({type:'checkbox', checked:todo.isTick}),
                  span(todo.name),
                  button('删除')
                ])
            )
          ),
          span('.unf-len', [
            span('还剩下'),
            b(),
            span('个未完成的任务')
          ]),
          a('#all-btn', {href:"javascript:;", style:{marginLeft:'5px'}}, ['所有任务']),
          a('#unf-btn', {href:"javascript:;", style:{marginLeft:'5px'}}, ['未完成的任务']),
          a('#f-btn', {href:"javascript:;", style:{marginLeft:'5px'}}, ['已完成的任务']),
          a('#del-all-btn', {href:"javascript:;", style:{marginLeft:'5px'}}, ['删除所有已完成的任务']),
        ])
      }),
    HTTP:request$
  }
}


const drivers = {
  DOM:makeDOMDriver('body'),
  HTTP:makeHTTPDriver()
};

Cycle.run(main, drivers);
