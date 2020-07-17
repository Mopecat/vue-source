import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifeCycleMixin } from "./lifecycle";
function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 添加原型方法
renderMixin(Vue); // 原型上添加_render方法 用于渲染dom
lifeCycleMixin(Vue);  // 生命周期相关
export default Vue;
