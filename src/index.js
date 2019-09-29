import {createVirtualDom, createElement} from './lib/createElement';
import {diff, patch} from './lib/diff';

let state = {num: 1};
let preVdom;
let timer;

function view() {
  return createVirtualDom(
    'ul',
    {style: {background: 'red', listStyle: 'none'}},
    Array.prototype.map.call([...Array(state.num).keys()], function(e) {
      return createVirtualDom('li', {}, [e]);
    })
    // [createVirtualDom('li', {}, [1])]
  );
}

function render(element) {
  const vdom = view();

  element.appendChild(createElement(vdom));

  preVdom = vdom;

  timer = setInterval(() => {
    state.num++;
    tick(element);
  }, 1000);
}

function tick(element) {
  if (state.num > 10) {
    clearTimeout(timer);
    return;
  }

  const newVDom = view();

  const patchObj = diff(preVdom, newVDom);

  preVdom = newVDom;

  patch(element, patchObj);
}

render(document.querySelector('#container'));
