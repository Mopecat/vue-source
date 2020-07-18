export function patch(oldVnode, newVnode) {
  const isRealElem = oldVnode.nodeType;
  // 判断是否为真实元素 如果是真实元素则可以用新的虚拟节点（newVnode）创建dom元素 然后添加到当前的元素下面 并删除掉当前元素 实现元素的替换 页面的更新
  if (isRealElem) {
    const oldElem = oldVnode;
    // 获取父元素
    let parenElem = oldElem.parentNode;
    // 创建新元素并添加属性
    let el = createElem(newVnode);
    console.log(el);
    // 将新元素添加到父元素上 插入到老元素的后面
    parenElem.insertBefore(el, oldElem.nextSibling);
    // 删除老元素
    parenElem.removeChild(oldElem);
    return el;
  } else {
    // dom diff
  }
}

function createElem(vnode) {
  console.log(vnode);
  const { tag, children, text, data, key } = vnode;
  // 如果tag是string的话 那么当前的这个节点则是元素节点 否则为文本节点
  if (typeof tag == "string") {
    // 创建元素 将虚拟节点和真实节点做一个映射关系 （后面diff时如果元素相同则可以直接复用老元素）
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    // 递归调用当前函数 添加子节点
    if (children.length > 0) {
      children.forEach((child) => {
        vnode.el.append(createElem(child));
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 设置属性
function updateProperties(vnode) {
  const newProps = vnode.data || {};
  let el = vnode.el;
  for (let key in newProps) {
    // 如果当前属性是style 就循环style对象把style的每一个属性都添加上
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    }
    // event slot ……
    else {
      // 元素属性
      el.setAttribute(key, newProps[key]);
    }
  }
}
