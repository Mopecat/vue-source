let oldArrayMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayMethods);

const methods = ["push", "shift", "unshift", "sort", "reverse", "splice"];
methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // 获取到当前调用方法上的ob
    const ob = this.__ob__;
    // 这里的this指向的是调用函数劫持后修改的数组 也就是调用arrMethods[method]的数组
    const result = oldArrayMethods[method].apply(this, args); // 调用原数组方法方法
    let inserted;
    // 如果是给数组中新增数据，我们需要对新增的数据响应数据处理（如果是对象的话）
    switch (method) {
      case "push":
      case "unshift":
        // 新增的数据就是当前方法的参数
        inserted = args;
        break;
      case "splice": // splice也可以新增
        inserted = args.slice(2); // 如果有第三个参数 证明是新增，第三个参数就是新增的那一项
        break;
      default:
        break;
    }
    // 将新增的数据变为可观测
    inserted && ob.observeArray(inserted);
    return result;
  };
});
