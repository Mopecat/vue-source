import { initMixin } from "./init";

function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 添加原型方法

export default Vue;
