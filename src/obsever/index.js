import { isObject } from "../utils";

class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function defineReactive(data, key, value) {
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (newVal == value) return;
      observe(newVal); // 监控当前设置的值 因为设置的值也可能是个对象
      value = newVal;
    },
  });
}

export function observe(data) {
  console.log(data);
  // 如果不是对象就返回
  if (!isObject(data)) {
    return;
  }
  return new Observer(data);
}
