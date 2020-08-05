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

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // diff
      updateChildren(el, oldChildren, newChildren);
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

// 将传入的children列表创建一个映射表 关联当前节点的额key和当前元素的index
function makeIndexByKey(children) {
  let map = {};
  children.forEach((item, index) => {
    map[item.key] = index;
  });
  return map;
}
// 用于判断两个虚拟节点是否一致
function isSameVnode(oldVnode, newVnode) {
  return oldVnode.key === newVnode.key && oldVnode.tag === newVnode.tag;
}

// 更新子节点
function updateChildren(parent, oldChildren, newChildren) {
  const map = makeIndexByKey(oldChildren);
  // vue 2.0是使用双指针的方式来进行比对的
  // v-for需要key来标识元素是否发生变化 前后key相同则复用这个元素
  let oldStartIndex = 0; // 老的开始索引
  let oldStartVnode = oldChildren[0]; // 老的开始节点
  let oldEndIndex = oldChildren.length - 1; // 老的结束索引
  let oldEndVnode = oldChildren[oldEndIndex]; // 老的结束节点
  // 新元素
  let newStartIndex = 0; // 新的开始索引
  let newStartVnode = newChildren[0]; // 新的开始节点
  let newEndIndex = newChildren.length - 1; // 新的结束索引
  let newEndVnode = newChildren[newEndIndex]; // 新的结束节点
  // 比较时采用的是新老节点中最短的 新旧中哪个先循环完 都结束循环，剩下没循环到的要么是新增 要么就是删除的
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 当前循环的元素可能是null 如果是null就跳过
    // 指针从前向后移动时跳过null
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    }
    // 指针从后向前移动时跳过null
    else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    // 两个虚拟节点是否一致是通过 key + 元素的 tag类型判断的 看方法isSameVnode
    // 方案1 从头部开始比较 相当于优化的是子元素列表尾部插入元素
    else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 标签和key一致 但是元素的属性可能不一致
      patch(oldStartVnode, newStartVnode); // 递归调用patch方法
      // 继续比较下一个元素 后移指针 以及索引元素
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
    // 方案2 如果开始的两个元素不一致 那么就从尾部开始比较 相当于优化的是子元素列表的前面插入元素
    else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      // 继续比较下一个元素 前移指针 以及 索引的元素
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
    // 方案3 头不一样 尾不一样 但是老的头和新的尾相同 将头部移动到尾部 倒序操作 相当于只修改了一个元素的位置 复用了其他的元素
    else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      // 将头部元素移动到尾部
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      // 继续向下一个元素移动
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
    // 方案4 头不一样 尾不一样 但是老的结尾和新的头相同 将尾部移动到头部 相当于只修改了一个元素的位置 复用了其他的元素 是方案3的相反操作
    else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode);
      // 将头部元素移动到尾部
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      // 继续向下一个元素移动
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    }
    // 乱序比对
    else {
      // 用新元素开始的key在map映射关系中找老元素中是否存在当前这个key 如果存在则moveIndex就是oldChildren中newStartVnode的位置
      let moveIndex = map[newStartVnode.key];
      // 说明当前的这个newStartVnode是新增的元素 在oldChildren中不存在
      if (moveIndex == undefined) {
        // 因为不存在所以直接加在oldStartVnode前面
        parent.insertBefore(createElem(newStartVnode), oldStartVnode.el);
      }
      // moveIndex不为空 oldChildren中的这个元素移动到开头（也就是oldChildren中第一个的前面）
      else {
        // 获取将要移动的元素
        let moveVnode = oldChildren[moveIndex];
        // 将它原有的位置置为null
        oldChildren[moveIndex] = null;
        // 比较这两个节点
        patch(moveVnode, newStartVnode);
        // 将这个元素插入到第一个元素之前
        parent.insertBefore(moveVnode.el, oldStartVnode.el);
      }
      // 将新元素的指针向后移动
      newStartVnode = newChildren[++newStartIndex];
    }
  }
  // 如果循环结束后新的开始节点小于新的结束节点 那说明有新增的元素
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parent.appendChild(createElem(newChildren[i]));
      // 如果结尾元素+1是null
      let ele =
        newChildren[newEndIndex + 1] == null
          ? null
          : newChildren[newEndIndex + 1].el;
      // insertBefore的第二个参数不传或者传null就相当于是appendChild
      parent.insertBefore(createElem(newChildren[i]), ele);
    }
  }
  // 如果循环结束后 老的开始节点小于等于老的结束节点 则说明还有oldChildren中还有剩余的节点 （这些节点是newChildren中没有的） 就将他们都删掉
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      if (child != null) {
        parent.removeChild(child.el);
      }
    }
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
