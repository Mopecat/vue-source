// 一堆正则
//               字母大小写_  -.数字字母大小写 任意多个
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名
// ?:匹配但不捕获 <aaa:aaa>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 匹配标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// 捕获到的是属性名和属性值 属性值可以是双引号/单引号/无引号 包裹
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

export function parserHTML(html) {
  let root; // 根元素
  let stack = []; // 用于记录元素的栈
  let currentParent; // 记录当前元素
  // 用于创建元素对象
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      attrs,
      children: [],
      parent: null,
      type: 1, // nodetype 元素是1，文本是3
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
    let element = createASTElement(tagName, attrs);
    // 将第一个元素赋值为根元素
    if (!root) {
      root = element;
    }
    currentParent = element;
    stack.push(element);
  }
  // 处理结束标签
  function end(tagName) {
    // 解析到结尾标签的时候，将当前栈中的最后一个元素出栈
    let element = stack.pop();
    // 判断当前出栈元素是否跟当前结尾标签相同，如果不相同则抛出错误
    if (element.tag !== tagName) {
      throw new Error(`${element.tag} 标签未闭合`);
    }
    let parent = stack[stack.length - 1];
    if (parent) {
      // 孩子可以有多个，但是爹只能有一个
      element.parent = parent;
      parent.children.push(element);
    }
  }
  // 处理文本
  function chars(text) {
    // 将文本中的空格都删掉
    text = text.replace(/\s/g, "");
    if (text) {
      currentParent.children.push({
        text,
        type: 3,
      });
    }
  }
  // 循环解析
  while (html) {
    let textEnd = html.indexOf("<");
    // 如果是开头标签如<span  或者是结束标签如 </span>
    if (textEnd === 0) {
      // 匹配开始标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
      }
      // 匹配结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        // 如果匹配到结束标签就截掉结束标签
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
      }
    }
    // 说明前面已经没有了开始标签，可能是这样的情况了 （hello world {{msg}}</span></div>） 这时的textEnd匹配的是</span>中的<
    let text; // 这时候应该截取这段文本
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    // 如果匹配到文本将文本截掉
    if (text) {
      advance(text.length);
      chars(text);
    }
  }
  // 解析前进（截掉已解析的字符串）
  function advance(n) {
    html = html.substring(n);
  }
  // 转换开始标签
  function parseStartTag() {
    // 获取开始标签
    const start = html.match(startTagOpen);
    // 如果匹配到了 就将匹配到的开始标签赋值
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      // 将匹配到的部分删掉
      advance(start[0].length);
      let attr, end;
      // 循环所有的属性 直到开始标签的结束 >
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // 将匹配到的属性截取
        advance(attr[0].length);
        // 将属性push到match对象中
        match.attrs.push({
          name: attr[1],
          // 分别代表双引号、单引号、无引号的情况
          value: attr[3] || attr[4] || attr[5],
        });
      }
      // 如果匹配到结束了那么删除结束的> 开始标签匹配结束
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }
  return root;
}
