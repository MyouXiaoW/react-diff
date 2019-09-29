/*
在使用的过程中能够理解到state的改变，UI重新渲染。这个过程可以细化为一下几个步骤

1.state 改变生成新的VirtualDom
2.新生成的vd和旧的vd进行对比
3.生成差异的补丁(patch)
4.更新DOM

diff 生成一个新的patch => {
  type,
  props,
  vdom,
  children
}
*/
import {createElement} from './createElement';

const nodePatchTypes = {
  CREATE: 'create',
  REMOVE: 'remove',
  UPDATE: 'update',
  REPALCE: 'replace'
};

const propsPatchTypes = {
  UPDATE: 'propsUpdate',
  REMOVE: 'PropsRemove'
};

export function diff(oldVDom, newVDom) {
  //新建nonde
  if (typeof oldVDom === 'undefined') {
    return {
      type: nodePatchTypes.CREATE,
      vdom: newVDom
    };
  }

  //删除node
  if (typeof newVDom === 'undefined') {
    return {
      type: nodePatchTypes.REMOVE
    };
  }

  //替换node
  if (
    typeof oldVDom !== typeof newVDom ||
    (typeof oldVDom === 'string' || (typeof oldVDom === 'number' && oldVDom !== newVDom)) ||
    oldVDom.tag !== newVDom.tag
  ) {
    return {
      type: nodePatchTypes.REPALCE,
      vdom: newVDom
    };
  }

  if (oldVDom.tag) {
    //比较props
    let propsDiff = diffProps(oldVDom, newVDom);

    //比较children
    let childrenDiff = diffChildren(oldVDom, newVDom);

    if (propsDiff.length !== 0 || childrenDiff.some(patch => typeof patch !== 'undefined')) {
      return {
        type: nodePatchTypes.UPDATE,
        props: propsDiff,
        children: childrenDiff
      };
    }
  }
}

//对比两个对象不同的方法
function diffProps(oldVDom, newVDom) {
  let patchs = [];

  const allProps = {...oldVDom.props, ...newVDom.props};

  Object.keys(allProps).forEach(key => {
    const oldValue = oldVDom.props[key];
    const newValue = newVDom.props[key];

    Object.keys(newValue).every(e => newValue[e] === oldValue[e]);

    if (typeof newValue === 'object' && Object.keys(newValue).every(e => newValue[e] === oldValue[e])) {
      return;
    }
    //删除
    if (typeof newValue === 'undefined') {
      patchs.push({
        type: propsPatchTypes.REMOVE,
        key
      });
    } else if (typeof oldValue === 'undefined' || newValue !== oldValue) {
      patchs.push({
        type: propsPatchTypes.UPDATE,
        key,
        value: newValue
      });
    }
  });

  return patchs;
}

function diffChildren(oldVDom, newVDom) {
  let patches = [];

  const allChildrenLength = [oldVDom.children.length, newVDom.children.length];
  const childrenLength = Function.prototype.apply.call(Math.max, undefined, allChildrenLength);

  for (let i = 0; i <= childrenLength - 1; i++) {
    patches.push(diff(oldVDom.children[i], newVDom.children[i]));
  }

  return patches;
}

//给dom打补丁
export function patch(parent, patchObj, index = 0) {
  if (!patchObj) {
    return;
  }
  if (patchObj.type === nodePatchTypes.CREATE) {
    return parent.appendChild(createElement(patchObj.vdom));
  }
  const element = parent.children[index];

  if (patchObj.type === nodePatchTypes.REMOVE) {
    return parent.removeChild(element);
  }

  if (patchObj.type === nodePatchTypes.REPALCE) {
    return parent.replaceChild(createElement(patchObj.vdom), element);
  }

  if (patchObj.type === nodePatchTypes.UPDATE) {
    patchProps(parent, patchObj.props);

    patchObj.children.forEach((patchObj, i) => {
      patch(element, patchObj, i);
    });
  }
}

function patchProps(element, props) {
  if (!props) return;

  props.forEach(patchObj => {
    if (patchObj.type === propsPatchTypes.REMOVE) {
      element.removeAttribute(patchObj.key);
    } else {
      setProps(element, {[patchObj.key]: patchObj.value});
    }
  });
}
