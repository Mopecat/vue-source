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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 工具方法
  function isObject(obj) {
    return _typeof(obj) === "object" && obj !== null;
  } // 应用策略模式

  var strats = {}; // 生命周期常量 （写几个示例一下 没写全 反正都统一处理的）

  var LIFECYCLE_HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated"];
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
      } // 如果没有父级则直接返回数组包裹的子级 这样保证了 最后返回的肯定是一个数组
      else {
          return [childVal];
        }
    } // 如果没有子级则直接返回父级
    else {
        return parentVal;
      }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  }); // 合并方法 用于全局api mixin

  function mergeOptions(parent, child) {
    var options = {}; // 循环父级options

    for (var key in parent) {
      // 用户合并父子级的key
      mergeField(key);
    } // 循环子级options 这时如果父级中有的key已经在上一个循环中处理过了 需要过滤一下


    for (var _key in child) {
      // 过滤父级中的key
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } // 如果父级和子级中都有且他们都是对象那么就合并对象  否则就赋值为子级 如果子级没有这个key，那么就还使用父级
      else if (isObject(parent[key]) && isObject(child[key])) {
          options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
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

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++; // 用于标记Dep

      this.subs = [];
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 1.让dep记住（存）watcher
        // 2.让watcher记住dep 双向记忆
        Dep.target.addDep(this); // 这个时候Dep.target就是watcher
      } // 存watcher

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } // 通知更新方法

    }, {
      key: "notify",
      value: function notify() {
        // 调用当前属性对应的每一个watcher的update方法
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }(); // 用于标记属性 在defineProperty中 如果Dep.target 不是null 证明被赋值了watcher 然后就走依赖收集的流程


  Dep.target = null;

  function pushTarget(watcher) {
    Dep.target = watcher; // 这个主要是的computed 和 watch 对应的watcher的标记
    // stack.push(watcher);
  } // 删除target

  function popTarget() {
    Dep.target = null; // stack.pop();
    // Dep.target = stack[stack.length - 1];
  }

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
  }(); // 递归循环data 重写data的每一个属性


  function defineReactive(data, key, value) {
    observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        // 判断如果当前属性是否需要依赖收集（也就是当前模板中是否有用到这个属性）
        if (Dep.target) {
          dep.depend(); // dep去收集当前属性的依赖
        }

        return value;
      },
      set: function set(newVal) {
        if (newVal == value) return;
        observe(newVal); // 监控当前设置的值 因为设置的值也可能是个对象

        value = newVal;
        dep.notify();
      }
    });
  }

  function observe(data) {
    // 如果不是对象就返回
    if (!isObject(data)) {
      return;
    } // 防止对象被重复观测


    if (data.__ob__ instanceof Observer) {
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


  function proxy(target, property, key) {
    Object.defineProperty(target, key, {
      get: function get() {
        return target[property][key];
      },
      set: function set(newValue) {
        target[property][key] = newValue;
      }
    });
  }

  function initData(vm) {
    console.log(vm.$options.data); // 数据响应式原理

    var data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, "_data", key);
    } // 响应化data


    observe(data);
  }

  // 一堆正则
  //               字母大小写_  -.数字字母大小写 任意多个
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配但不捕获 <aaa:aaa>

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 匹配标签名

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
  // 捕获到的是属性名和属性值 属性值可以是双引号/单引号/无引号 包裹

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parserHTML(html) {
    var root; // 根元素

    var stack = []; // 用于记录元素的栈

    var currentParent; // 记录当前元素
    // 用于创建元素对象

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        attrs: attrs,
        children: [],
        parent: null,
        type: 1 // nodetype 元素是1，文本是3

      };
    }
    /**
     * desc 用于解析标签结构的一种方式 栈型结构解析
     * 以 <div id="app" style="color: red"><span>hello world {{msg}}</span></div> 为例
     * 解析到div 将div放入栈中 [div]
     * 继续解析，解析到span将span放入栈中 [div,span]
     * 继续解析，解析到span的结尾标签，则将span出栈，[div]，这时就可以确定，span是div的子元素，div是span的父元素
     * 同样的道理，如果解析的过程中遇到了未闭合的标签就可以抛出错误
     *
     */
    // 处理开始标签


    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs); // 将第一个元素赋值为根元素

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    } // 处理结束标签


    function end(tagName) {
      // 解析到结尾标签的时候，将当前栈中的最后一个元素出栈
      var element = stack.pop(); // 判断当前出栈元素是否跟当前结尾标签相同，如果不相同则抛出错误

      if (element.tag !== tagName) {
        throw new Error("".concat(element.tag, " \u6807\u7B7E\u672A\u95ED\u5408"));
      } // 遇到结尾标签将当前元素出栈，并修改currentParent的指向


      currentParent = stack[stack.length - 1];

      if (currentParent) {
        // 孩子可以有多个，但是爹只能有一个
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    } // 处理文本


    function chars(text) {
      // 将文本中的空格都删掉
      text = text.replace(/\s/g, "");

      if (text) {
        currentParent.children.push({
          text: text,
          type: 3
        });
      }
    } // 循环解析


    while (html) {
      var textEnd = html.indexOf("<"); // 如果是开头标签如<span  或者是结束标签如 </span>

      if (textEnd === 0) {
        // 匹配开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
        } // 匹配结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          // 如果匹配到结束标签就截掉结束标签
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
        }
      } // 说明前面已经没有了开始标签，可能是这样的情况了 （hello world {{msg}}</span></div>） 这时的textEnd匹配的是</span>中的<


      var text = void 0; // 这时候应该截取这段文本

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      } // 如果匹配到文本将文本截掉


      if (text) {
        advance(text.length);
        chars(text);
      }
    } // 解析前进（截掉已解析的字符串）


    function advance(n) {
      html = html.substring(n);
    } // 转换开始标签


    function parseStartTag() {
      // 获取开始标签
      var start = html.match(startTagOpen); // 如果匹配到了 就将匹配到的开始标签赋值

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; // 将匹配到的部分删掉

        advance(start[0].length);

        var attr, _end; // 循环所有的属性 直到开始标签的结束 >


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将匹配到的属性截取
          advance(attr[0].length); // 将属性push到match对象中

          match.attrs.push({
            name: attr[1],
            // 分别代表双引号、单引号、无引号的情况
            value: attr[3] || attr[4] || attr[5]
          });
        } // 如果匹配到结束了那么删除结束的> 开始标签匹配结束


        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  // +？非贪婪模式 （尽可能的少取）
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双花括号的
  // 将属性拼接成字符串

  function genProps(attrs) {
    var str = "";

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === "style") {
        (function () {
          var obj = {};
          var styles = attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  } // 编译每一个child


  function gen(node) {
    // 如果当前的节点是元素 那么就递归循环
    if (node.type === 1) {
      return generate(node);
    } else {
      // 如果是文本的话 需要处理将变量和普通文本区分出来
      var text = node.text; // 如果没有变量则直接返回

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = []; // 用于放截取出来的字符串

        var lastIndex = defaultTagRE.lastIndex = 0; // 正则的lastIndex 修正test过后的变化 置为0

        var match, index;

        while (match = defaultTagRE.exec(text)) {
          index = match.index; // 当前这次匹配的第一个位置
          // 当前匹配的位置>上次匹配的结尾 说明当前这一次匹配的位置和上次匹配的位置中间有普通文本，将文本push到tokens中

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          } // 将匹配到的变量用_s()包裹起来


          tokens.push("_s(".concat(match[1].trim(), ")"));
          console.log(lastIndex); // 将lastIndex修改为匹配到的位置结尾处

          lastIndex = index + match[0].length;
        } // 都匹配完了 结尾可能还有一部分 如 helloworld {{msg}}  aa 其中的aa也需要push进去


        tokens.push(JSON.stringify(text.slice(lastIndex)));
        return "_v(".concat(tokens.join("+"), ")");
      }
    }
  } // 编译children


  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (c) {
        return gen(c);
      }).join(",");
    } else {
      return false;
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : "undefined").concat(children ? ",".concat(children) : "", ")");
    return code;
  }

  function compileToFunctions(template) {
    console.log(template); // 第一步 由模板编译成ast语法树

    var ast = parserHTML(template);
    console.log(ast);
    /**
     * 第二步将ast语法树解析成render函数
     * {
     *   tag：‘div’,
     *   attrs:[{name: "id", value: "app"},{name: "style", value: "color: red"}],
     *   children:[{
     *     tag:'span',
     *     parent: {tag: "div", attrs: Array(2), children: Array(1), parent: null, type: 1},
     *     children:[{type: 3,text: "helloworld{{msg}}"}],
     *     type:1,
     *     attrs:[]
     *   }],
     *   type:1
     *   parent: null
     * }
     * 转化成
     * render(){
     *   return _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
     * }
     */

    var code = generate(ast);
    code = "with(this){return ".concat(code, "}");
    console.log(code);
    var render = new Function(code); // 将字符串转换为函数

    return render;
  }

  var has = {}; // 用于判断是否是重复的watcher 避免同时重复修改某一个属性时 多次的更新视图 浪费性能

  var queue = []; // watcher的队列
  // 将watcher存储进队列

  function queueWatcher(watcher) {
    var id = watcher.id; // 重复的watcher不加入队列

    if (has[id] == null) {
      has[id] = true;
      queue.push(watcher);
      nextTick(flushSchedulerQueue);
    }
  }

  function flushSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      queue[i].run();
    } // 清空 保证当再次更新的时候用的是新的watcher


    has = {};
    queue = [];
  }

  var callbacks = []; // 用于收集当前这次更新调用nextTick方法的所有回调函数，其中第一个回调时上面的flushSchedulerQueue代表的是渲染watcher 他总是在第一个，所后续调用的$nextTick是在渲染后执行的

  var pending = false; // 代表正在更新
  // 异步更新方法

  function nextTick(fn) {
    callbacks.push(fn);

    if (!pending) {
      // 异步执行  用 setTimeout模拟一下 实际上涉及到不同浏览器以及不同情况的事件环兼容 包括Promise，setImmediate, MutationObserver等的情况用法
      setTimeout(function () {
        flushCallbacksQueue();
      }, 0);
      pending = true;
    }
  }

  function flushCallbacksQueue() {
    callbacks.forEach(function (fn) {
      return fn();
    });
    pending = false; // 更新完毕 置为false
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.deps = []; // 用于记住（存）dep

      this.depIds = new Set(); // 用于去重dep

      if (typeof exprOrFn === "function") {
        this.getter = exprOrFn;
      }

      this.id = id$1++; // 用于标记watcher 后面去重用
      // 需要直接调用渲染和更新的方法 并进行对应的依赖收集 所以直接调用get

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 标记 这个时候Dep.target就不是null了
        pushTarget(this); // 渲染和更新方法会访问data中的属性，访问的时候就会调用当前属性get方法 通过get方法中判断Dep.target 进行依赖收集 而此时Dep.target不是null

        this.getter(); // 清空Dep.target

        popTarget();
      } // 收集dep

    }, {
      key: "addDep",
      value: function addDep(dep) {
        // 判断有没有存过当前的这个dep
        if (!this.depIds.has(dep.id)) {
          // 存dep
          this.deps.push(dep); // 存dep的id

          this.depIds.add(dep.id); // 将当前的这个watcher存到dep中

          dep.addSub(this);
        }
      } // 更新wather列队

    }, {
      key: "update",
      value: function update() {
        queueWatcher(this); // 将watcher存储起来
        // this.get();
      } // 更新方法

    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, newVnode) {
    var isRealElem = oldVnode.nodeType; // 判断是否为真实元素 如果是真实元素则可以用新的虚拟节点（newVnode）创建dom元素 然后添加到当前的元素下面 并删除掉当前元素 实现元素的替换 页面的更新

    if (isRealElem) {
      var oldElem = oldVnode; // 获取父元素

      var parenElem = oldElem.parentNode; // 创建新元素并添加属性

      var el = createElem(newVnode);
      console.log(el); // 将新元素添加到父元素上 插入到老元素的后面

      parenElem.insertBefore(el, oldElem.nextSibling); // 删除老元素

      parenElem.removeChild(oldElem);
      return el;
    } else {
      // dom diff 是进行同层的比较 正常要diff两棵树 自由度是 O(n^3) 但是如果同层比较就是 O(n) 这样就会优化了很多，因为本身前端操作dom很少会有跨层级操作dom的情况
      console.log("diff"); // 两颗树要先比较根节点 在比较子级
      // 判断新旧vnode的根节点 元素标签是否相同 如果不同证明整颗树的根节点不同 需要替换

      if (oldVnode.tag !== newVnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElem(newVnode), oldVnode.el);
      } // 都是文本的情况 如果是老节点是文本 新节点是元素 则会走上面那个 tag不相等的判断


      if (!oldVnode.tag) {
        if (oldVnode.text !== newVnode.text) {
          oldVnode.el.textContent = newVnode.text;
        }
      } // 走到这里就一定是标签 而且标签一致了
      // 直接复用老节点的el


      var _el = newVnode.el = oldVnode.el; // 更新属性


      updateProperties(newVnode, oldVnode.data);
      /**
       * 比对子节点策略
       * 情况分析
       * 新老节点都有子节点 那就比较  这里是diff的核心
       * 老的有子节点 新的没有子节点 直接删除
       * 老的没有子节点 新的有子节点 直接添加
       */

      var oldChildren = oldVnode.children || [];
      var newChildren = newVnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // diff
        updateChildren(_el, oldChildren, newChildren);
      } else if (oldChildren.length > 0) {
        _el.innerHTML = "";
      } else if (newChildren.length > 0) {
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];

          _el.appendChild(createElem(child)); // 这里可以用先拼成fragment片段然后再一起挂载，但是现代浏览器有自动做这一层优化

        }
      }

      return _el;
    }
  } // 用于判断两个虚拟节点是否一致

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.tag === newVnode.tag;
  } // 更新子节点


  function updateChildren(parent, oldChildren, newChildren) {
    // vue 2.0是使用双指针的方式来进行比对的
    // v-for需要key来标识元素是否发生变化 前后key相同则复用这个元素
    var oldStartIndex = 0; // 老的开始索引

    var oldStartVnode = oldChildren[0]; // 老的开始节点

    var oldEndIndex = oldChildren.length - 1; // 老的结束索引

    var oldEndVnode = oldChildren[oldEndIndex]; // 老的结束节点
    // 新元素

    var newStartIndex = 0; // 新的开始索引

    var newStartVnode = newChildren[0]; // 新的开始节点

    var newEndIndex = newChildren.length - 1; // 新的结束索引

    var newEndVnode = newChildren[newEndIndex]; // 新的结束节点
    // 比较时采用的是新老节点中最短的 新旧中哪个先循环完 都结束循环，剩下没循环到的要么是新增 要么就是删除的

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 两个虚拟节点是否一致是通过 key + 元素的 tag类型判断的 看方法isSameVnode
      // 方案1 从头部开始比较 相当于优化的是子元素列表尾部插入元素
      if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 标签和key一致 但是元素的属性可能不一致
        patch(oldStartVnode, newStartVnode); // 递归调用patch方法
        // 继续比较下一个元素 后移指针 以及索引元素

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } // 方案2 如果开始的两个元素不一致 那么就从尾部开始比较 相当于优化的是子元素列表的前面插入元素
      else if (isSameVnode(oldEndVnode, newEndVnode)) {
          patch(oldEndVnode, newEndVnode); // 继续比较下一个元素 前移指针 以及 索引的元素

          oldEndVnode = oldChildren[--oldEndIndex];
          newEndVnode = newChildren[--newEndIndex];
        } // 方案3 头不一样 尾不一样 但是老的头和新的尾相同 将头部移动到尾部 倒序操作 相当于只修改了一个元素的位置 复用了其他的元素
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode); // 将头部元素移动到尾部

            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 继续向下一个元素移动

            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
          } // 方案4 头不一样 尾不一样 但是老的结尾和新的头相同 将尾部移动到头部 相当于只修改了一个元素的位置 复用了其他的元素 是方案3的相反操作
          else if (isSameVnode(oldEndVnode, newStartVnode)) {
              patch(oldEndVnode, newStartVnode); // 将头部元素移动到尾部

              parent.insertBefore(oldEndVnode.el, oldStartVnode.el); // 继续向下一个元素移动

              oldEndVnode = oldChildren[--oldStartIndex];
              newStartVnode = newChildren[++newEndIndex];
            }
    } // 如果循环结束后新的开始节点小于新的结束节点 那说明有新增的元素


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // parent.appendChild(createElem(newChildren[i]));
        // 如果结尾元素+1是null
        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el; // insertBefore的第二个参数不传或者传null就相当于是appendChild

        parent.insertBefore(createElem(newChildren[i]), ele);
      }
    }
  }

  function createElem(vnode) {
    console.log(vnode);
    var tag = vnode.tag,
        children = vnode.children,
        text = vnode.text,
        data = vnode.data,
        key = vnode.key; // 如果tag是string的话 那么当前的这个节点则是元素节点 否则为文本节点

    if (typeof tag == "string") {
      // 创建元素 将虚拟节点和真实节点做一个映射关系 （后面diff时如果元素相同则可以直接复用老元素）
      vnode.el = document.createElement(tag);
      updateProperties(vnode); // 递归调用当前函数 添加子节点

      if (children.length > 0) {
        children.forEach(function (child) {
          vnode.el.append(createElem(child));
        });
      }
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 设置属性

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el; // 获取新旧节点的style属性对象

    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {}; // 比较新旧style属性对象，如果老的属性 新的没有 则将新对象中的属性删掉 如果是新增属性的话 后面的循环添加了

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        newStyle[key] = "";
      }
    } // 如果新的节点中删除了某些属性 则在新的节点上把对应的属性删掉


    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    }

    for (var _key2 in newProps) {
      // 如果当前属性是style 就循环style对象把style的每一个属性都添加上
      if (_key2 === "style") {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } // event slot ……
      else {
          // 元素属性
          el.setAttribute(_key2, newProps[_key2]);
        }
    }
  }

  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // Vue在渲染过程中会创建一个“渲染watcher”，只用来渲染
    // watcher就相当于是一个回调，每次数据变化，就会重新执行watcher
    callHook(vm, "beforeMount");

    var updateComponent = function updateComponent() {
      // _render内部会调用 解析后的render方法  => 返回的是vnode（虚拟节点）
      // _update将虚拟节点转换为dom节点
      vm._update(vm._render());
    }; // 每次数据变化 就执行updateComponent 方法进行更新操作


    new Watcher(vm, updateComponent, function () {}, true);
    callHook(vm, "mounted");
  } // 调用生命周期函数 应用发布订阅模式，

  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // 这里是一个同一生命周期函数的数组 [fn,fn,fn]

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        // 将每一个生命周期函数调用 并将生命周期函数的this 指向当前实例
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 将Vue.mixin所记录的Vue.options与new Vue传入的options合并 为保证每次调用合并的都是当前的实例的构造函数上的options 所以用 vm.constrcutor.options

      vm.$options = mergeOptions(vm.constructor.options, options);
      callHook(vm, "beforeCreate");
      initState(vm);
      callHook(vm, "created"); // 通过模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      } // 走到这里就是不需要编译模板了 或者已经编译完了

    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      vm.$el = document.querySelector(el); // 如果用户没有传render方法，那么就需要将template转换成render方法

      if (!options.render) {
        var template = vm.$options.template; // 如果用户也没有传template，那么就将el作为模板转换成render函数

        if (!template && vm.$el) {
          template = vm.$el.outerHTML;
        }

        var render = compileToFunctions(template);
        options.render = render;
        console.log(options.render);
      } // 组件的挂在流程


      mountComponent(vm, vm.$el);
    };
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    // let key = data.key;
    // if (key) {
    //   delete data.key;
    // }
    return vnode(tag, data, data.key, children);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._v = function (text) {
      return createTextVnode(text);
    }; // 创建元素虚拟节点


    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    }; // 值


    Vue.prototype._s = function (val) {
      return val == null ? "" : _typeof(val) === "object" ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      console.log("_render");
      var vm = this;
      var render = vm.$options.render; // 创建文本的虚拟节点

      var vnode = render.call(this);
      console.log(vnode);
      return vnode;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {}; // 所有的全局api 用户传递的参数 都会绑定到这个对象中 （用于收集用户调用全局api传递的参数）
    // 提取公共的方法 逻辑，通过mixin混合到每一个实例中

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      console.log(this.options);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 添加原型方法

  renderMixin(Vue); // 原型上添加_render方法 用于渲染dom

  lifeCycleMixin(Vue); // 生命周期相关

  initGlobalAPI(Vue); // 给构造函数扩展全局方法

  Vue.prototype.$nextTick = nextTick; // 将nextTick 挂载到原型对象上

  var vm1 = new Vue({
    data: {
      name: "mopecat"
    }
  });
  var vm2 = new Vue({
    data: {
      name: "feely"
    }
  });
  var render1 = compileToFunctions("<div id=\"a\" c=\"a\" style=\"background: red;color: white\">\n    <li key=\"A\">A</li>\n    <li key=\"B\">B</li>\n    <li key=\"C\">C</li>\n    <li key=\"D\">D</li>\n  </div>");
  var oldVnode = render1.call(vm1);
  var realElement = createElem(oldVnode);
  document.body.appendChild(realElement);
  var render2 = compileToFunctions("<div id=\"a\" style=\"background: yellow;color: red;border: 1px solid #dddddd;\"> \n    <li key=\"C\">C</li> \n    <li key=\"D\">D</li> \n    <li key=\"A\">A</li>\n    <li key=\"B\">B</li>\n  </div>");
  var newVnode = render2.call(vm2);
  setTimeout(function () {
    patch(oldVnode, newVnode);
  }, 1000);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
