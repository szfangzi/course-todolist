const {h, h1, span, div, makeDOMDriver} = CycleDOM;

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
              span({style:{color:'red'}},['1']),
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

function logDriver(msg$) {
  msg$.subscribe(msg => console.log(msg));
}

const drivers = {
  DOM:makeDOMDriver('#app'),
  Log:logDriver
};

Cycle.run(main, drivers);
