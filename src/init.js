import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
import { mountComponent } from "./lifecycle";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    initState(vm);

    // 通过模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
    // 走到这里就是不需要编译模板了 或者已经编译完了
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // 如果用户没有传render方法，那么就需要将template转换成render方法
    if (!options.render) {
      let template = vm.$options.template;
      // 如果用户也没有传template，那么就将el作为模板转换成render函数
      if (!template && el) {
        template = el.outerHTML;
      }
      const render = compileToFunctions(template);
      options.render = render;
      console.log(options.render);
    }
    // 组件的挂在流程
    mountComponent(vm, el);
  };
}
