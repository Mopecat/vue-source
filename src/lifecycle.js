import Watcher from "./obsever/watcher";
import { patch } from "./vdom/patch";

export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
}

export function mountComponent(vm, el) {
  // Vue在渲染过程中会创建一个“渲染watcher”，只用来渲染
  // watcher就相当于是一个回调，每次数据变化，就会重新执行watcher

  const updateComponent = () => {
    // _render内部会调用 解析后的render方法  => 返回的是vnode（虚拟节点）
    // _update将虚拟节点转换为dom节点
    vm._update(vm._render());
  };
  // 每次数据变化 就执行updateComponent 方法进行更新操作
  new Watcher(vm, updateComponent, () => {}, true);
}
