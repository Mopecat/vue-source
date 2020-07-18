import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifeCycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./global-api/index";
function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 添加原型方法
renderMixin(Vue); // 原型上添加_render方法 用于渲染dom
lifeCycleMixin(Vue); // 生命周期相关
initGlobalAPI(Vue); // 给构造函数扩展全局方法

export default Vue;
