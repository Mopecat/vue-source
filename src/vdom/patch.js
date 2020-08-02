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
    // dom diff 是进行同层的比较 正常要diff两棵树 自由度是 O(n^3) 但是如果同层比较就是 O(n) 这样就会优化了很多，因为本身前端操作dom很少会有跨层级操作dom的情况
    console.log("diff");
    // 两颗树要先比较根节点 在比较子级
    // 判断新旧vnode的根节点 元素标签是否相同 如果不同证明整颗树的根节点不同 需要替换
    if (oldVnode.tag !== newVnode.tag) {
      oldVnode.el.parentNode.replaceChild(createElem(newVnode), oldVnode.el);
    }
    // 都是文本的情况 如果是老节点是文本 新节点是元素 则会走上面那个 tag不相等的判断
    if (!oldVnode.tag) {
      if (oldVnode.text !== newVnode.text) {
        oldVnode.el.textContent = newVnode.text;
      }
    }
    // 走到这里就一定是标签 而且标签一致了
    // 直接复用老节点的el
    let el = (newVnode.el = oldVnode.el);

    // 更新属性
    updateProperties(newVnode, oldVnode.data);

    /**
     * 比对子节点策略
     * 情况分析
     * 新老节点都有子节点 那就比较  这里是diff的核心
     * 老的有子节点 新的没有子节点 直接删除
     * 老的没有子节点 新的有子节点 直接添加
     */

    let oldChildren = oldVnode.children || [];
    let newChildren = newVnode.children || [];

    if (oldChildren.length.length > 0 && newChildren.length > 0) {
      // diff
    } else if (oldChildren.length > 0) {
      el.innerHTML = "";
    } else if (newChildren.length > 0) {
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        el.appendChild(createElem(child)); // 这里可以用先拼成fragment片段然后再一起挂载，但是现代浏览器有自动做这一层优化
      }
    }

    return el;
  }
}

export function createElem(vnode) {
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
function updateProperties(vnode, oldProps = {}) {
  const newProps = vnode.data || {};
  let el = vnode.el;
  // 获取新旧节点的style属性对象
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};

  // 比较新旧style属性对象，如果老的属性 新的没有 则将新对象中的属性删掉 如果是新增属性的话 后面的循环添加了
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      newStyle[key] = "";
    }
  }

  // 如果新的节点中删除了某些属性 则在新的节点上把对应的属性删掉
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }
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
