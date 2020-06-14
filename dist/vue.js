(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  // 工具方法
  function isObject(obj) {
    return _typeof(obj) === "object" && obj !== null;
  }

  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ["push", "shift", "unshift", "sort", "reverse", "splice"];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      // 获取到当前调用方法上的ob
      var ob = this.__ob__; // 这里的this指向的是调用函数劫持后修改的数组 也就是调用arrMethods[method]的数组

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args); // 调用原数组方法方法

      var inserted; // 如果是给数组中新增数据，我们需要对新增的数据响应数据处理（如果是对象的话）

      switch (method) {
        case "push":
        case "unshift":
          // 新增的数据就是当前方法的参数
          inserted = args;
          break;

        case "splice":
          // splice也可以新增
          inserted = args.slice(2); // 如果有第三个参数 证明是新增，第三个参数就是新增的那一项

          break;
      } // 将新增的数据变为可观测


      inserted && ob.observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 将当前实例挂载到data上 __ob__也可以作为一个响应式的标识
      Object.defineProperty(data, "__ob__", {
        enumerable: false,
        // 为了避免死循环，重复的枚举当前实例，使当前属性不可枚举
        configurable: false,
        // 同样也不想这个属性被修改所以也不可配置
        value: this
      }); // 判断一下是不是数组类型，如果是数组走函数劫持的方法

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    } // [{a:111}] 需要将这种类型的数据也进行响应观测


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        for (var key in data) {
          observe(data[key]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (newVal == value) return;
        observe(newVal); // 监控当前设置的值 因为设置的值也可能是个对象

        value = newVal;
      }
    });
  }

  function observe(data) {
    // 如果不是对象就返回
    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    console.log(vm.$options.data); // 数据响应式原理

    var data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data;
    observe(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 添加原型方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
