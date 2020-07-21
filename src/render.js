import { createTextVnode, createElement } from "./vdom/create-element";

export function renderMixin(Vue) {
  Vue.prototype._v = function (text) {
    return createTextVnode(text);
  };
  // 创建元素虚拟节点
  Vue.prototype._c = function () {
    return createElement(...arguments);
  };
  // 值
  Vue.prototype._s = function (val) {
    return val == null
      ? ""
      : typeof val === "object"
      ? JSON.stringify(val)
      : val;
  };
  Vue.prototype._render = function () {
    console.log("_render");
    const vm = this;
    const { render } = vm.$options;
    // 创建文本的虚拟节点

    const vnode = render.call(this);
    console.log(vnode);
    return vnode;
  };
}
