import { observe } from "./obsever/index";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
}

function initProps() {}

function initMethods() {}

function proxy(target, property, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[property][key];
    },
    set(newValue) {
      target[property][key] = newValue;
    },
  });
}

function initData(vm) {
  console.log(vm.$options.data);
  // 数据响应式原理
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? data.call(vm) : data;
  for (let key in data) {
    proxy(vm, "_data", key);
  }
  observe(data);
}
