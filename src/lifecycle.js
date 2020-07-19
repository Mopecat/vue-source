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
  callHook(vm, "beforeMount");
  const updateComponent = () => {
    // _render内部会调用 解析后的render方法  => 返回的是vnode（虚拟节点）
    // _update将虚拟节点转换为dom节点
    vm._update(vm._render());
  };
  // 每次数据变化 就执行updateComponent 方法进行更新操作
  new Watcher(vm, updateComponent, () => {}, true);
  callHook(vm, "mounted");
}

// 调用生命周期函数 应用发布订阅模式，
export function callHook(vm, hook) {
  let handlers = vm.$options[hook]; // 这里是一个同一生命周期函数的数组 [fn,fn,fn]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      // 将每一个生命周期函数调用 并将生命周期函数的this 指向当前实例
      handlers[i].call(vm);
    }
  }
}
