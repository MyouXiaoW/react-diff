/*
virtualdom 是一个简单的js对象
主要有几个部分 tag(标签) props(属性) children(子元素对象)

{
    tag: "div",
    props: {},
    children: [
        "Hello World", 
        {
            tag: "ul",
            props: {},
            children: [{
                tag: "li",
                props: {
                    id: 1,
                    class: "li-1"
                },
                children: ["第", 1]
            }]
        }
    ]
}

jsx 通过编译会生成virtualdom
下一步通过遍历virtualdom生成真正的dom


*/

function Element(tag, props, children) {
  this.tag = tag;
  this.props = props;
  this.children = children;
}

export function createVirtualDom(tag, props, children) {
  return new Element(tag, props, children);
}

//创建真实的dom
export function createElement(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }

  const {tag, props, children} = vdom;
  const element = document.createElement(tag);

  setProps(element, props);

  //注意appendChild.bind 写法
  children.map(createElement).forEach(element.appendChild.bind(element));

  return element;
}

//设置dom的属性
function setProps(element, props) {
  let Attribute = '';
  for (let key in props) {
    if (key === 'style') {
      for (let styleAttribute in props[key]) {
        Attribute += `${styleAttribute.replace(/[A-Z]/g, (...arg) => {
          return `-${arg[0].toLocaleLowerCase()}`;
        })}:${props[key][styleAttribute]};`;
      }
    }
    element.setAttribute(key, Attribute);
  }
}
