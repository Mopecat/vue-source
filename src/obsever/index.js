import { isObject } from "../utils";
import { arrayMethods } from "./array";

class Observer {
  constructor(data) {
    // 将当前实例挂载到data上 __ob__也可以作为一个响应式的标识
    Object.defineProperty(data, "__ob__", {
      enumerable: false, // 为了避免死循环，重复的枚举当前实例，使当前属性不可枚举
      configurable: false, // 同样也不想这个属性被修改所以也不可配置
      value: this,
    });
    // 判断一下是不是数组类型，如果是数组走函数劫持的方法
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  // [{a:111}] 需要将这种类型的数据也进行响应观测
  observeArray(data) {
    for (let key in data) {
      observe(data[key]);
    }
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
  // 如果不是对象就返回
  if (!isObject(data)) {
    return;
  }

  // 防止对象被重复观测
  if (data.__ob__ instanceof Observer) {
    return;
  }
  return new Observer(data);
}
