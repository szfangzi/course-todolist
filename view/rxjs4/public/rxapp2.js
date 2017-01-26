function h1(children) {
  return{
    tagName:'h1',
    children
  }
}
function div(children) {
  return{
    tagName:'div',
    children
  }
}
function span(children) {
  return{
    tagName:'span',
    children
  }
}
function main(sources) {
  const click$ = sources.DOM.select('span').events('click');
  const sinks = {
    DOM:click$
      .startWith(null)
      .flatMapLatest(()=>
        Rx.Observable.timer(0,3000)
          .map(i => {
            return h1([
              span([`second ${i}`]),
              div([
                span(['1']),
                span(['3']),
              ])
            ])
          })
    ),
    Log:Rx.Observable.timer(0,1000)
      .map(i=>2*i)
  }
  return sinks;
}

function makeDOMDriver(mountSelector) {
return function DOMDriver(obj$) {

  function createElement(obj) {
    const el = document.createElement(obj.tagName);
    obj.children
      .filter(n => typeof n === 'object')
      .map(createElement)
      .forEach(n => el.appendChild(n));
    obj.children
      .filter(n => typeof n === 'string')
      .forEach(n => el.innerHTML += n);
    return el;
  }
  obj$.subscribe(obj=>{
    const container = document.querySelector(mountSelector);
    const el = createElement(obj);
    container.innerHTML = '';
    container.appendChild(el);
  });
  const DOMSource = {
    selectEvents:function(tagName, eventType){
      return Rx.Observable.fromEvent(document, eventType).filter(e => e.target.tagName === tagName.toUpperCase());
    }
  };
  return DOMSource;
}
}
function logDriver(msg$) {
  msg$.subscribe(msg => console.log(msg));
}

const drivers = {
  DOM:makeDOMDriver('#app'),
  Log:logDriver
};

Cycle.run(main, drivers);
