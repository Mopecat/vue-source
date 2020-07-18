// 工具方法
export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// 应用策略模式
let strats = {};
// 生命周期常量 （写几个示例一下 没写全 反正都统一处理的）
const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
];
/**
 * desc 生命周期函数合并方法
 * @param {Function} parentVal 父级生命周期值
 * @param {Function} childVal 子级生命周期值
 * @returns {Array} 生命周期函数合并后的数组
 */
function mergeHook(parentVal, childVal) {
  // 如果有子级 且 有父级 则父级合并子级
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    }
    // 如果没有父级则直接返回数组包裹的子级 这样保证了 最后返回的肯定是一个数组
    else {
      return [childVal];
    }
  }
  // 如果没有子级则直接返回父级
  else {
    return parentVal;
  }
}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook;
});
// 合并方法 用于全局api mixin
export function mergeOptions(parent, child) {
  const options = {};
  // 循环父级options
  for (let key in parent) {
    // 用户合并父子级的key
    mergeField(key);
  }
  // 循环子级options 这时如果父级中有的key已经在上一个循环中处理过了 需要过滤一下
  for (let key in child) {
    // 过滤父级中的key
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    }
    // 如果父级和子级中都有且他们都是对象那么就合并对象  否则就赋值为子级 如果子级没有这个key，那么就还使用父级
    else if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = {
        ...parent[key],
        ...child[key],
      };
    } else {
      if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }
  }
  return options;
}
