import { initMixin } from "./init";
import { renderMixin } from "./render";
import { lifeCycleMixin } from "./lifecycle";
import { initGlobalAPI } from "./global-api/index";
import { nextTick } from "./obsever/scheduler";

function Vue(options) {
  this._init(options);
}

initMixin(Vue); // 添加原型方法
renderMixin(Vue); // 原型上添加_render方法 用于渲染dom
lifeCycleMixin(Vue); // 生命周期相关
initGlobalAPI(Vue); // 给构造函数扩展全局方法
Vue.prototype.$nextTick = nextTick; // 将nextTick 挂载到原型对象上

import { compileToFunctions } from "./compiler/index";
import { patch, createElem } from "./vdom/patch";
// 生成两个虚拟节点用于对比
let vm1 = new Vue({ data: { name: "mopecat" } });
let vm2 = new Vue({ data: { name: "feely" } });

let render1 = compileToFunctions(
  `<div id="a" c="a" style="background: red;color: white">
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
  </div>`
);
let oldVnode = render1.call(vm1);
let realElement = createElem(oldVnode);
document.body.appendChild(realElement);

let render2 = compileToFunctions(
  `<div id="a" style="background: yellow;color: red;border: 1px solid #dddddd;">
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
    <li key="E">E</li>
  </div>`
);
let newVnode = render2.call(vm2);
setTimeout(() => {
  patch(oldVnode, newVnode);
}, 1000);

export default Vue;
