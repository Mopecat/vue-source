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
    }

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
      }

      var parent = stack[stack.length - 1];

      if (parent) {
        // 孩子可以有多个，但是爹只能有一个
        element.parent = parent;
        parent.children.push(element);
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
    var code = "\n    _c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : "undefined").concat(children ? ",".concat(children) : "", ")");
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

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm); // 通过模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      } // 走到这里就是不需要编译模板了 或者已经编译完了

    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 如果用户没有传render方法，那么就需要将template转换成render方法

      if (!options.render) {
        var template = vm.$options.template; // 如果用户也没有传template，那么就将el作为模板转换成render函数

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        options.render = render;
        console.log(options.render);
      }
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 添加原型方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
