import { mergeOptions } from "../utils";
export function initGlobalAPI(Vue) {
  Vue.options = {}; // 所有的全局api 用户传递的参数 都会绑定到这个对象中 （用于收集用户调用全局api传递的参数）
  // 提取公共的方法 逻辑，通过mixin混合到每一个实例中
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    console.log(this.options);
  };
}
