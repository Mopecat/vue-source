// +？非贪婪模式 （尽可能的少取）
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配双花括号的
// 将属性拼接成字符串
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      let obj = {};
      let styles = attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

// 编译每一个child
function gen(node) {
  // 如果当前的节点是元素 那么就递归循环
  if (node.type === 1) {
    return generate(node);
  } else {
    // 如果是文本的话 需要处理将变量和普通文本区分出来
    let text = node.text;
    // 如果没有变量则直接返回
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = []; // 用于放截取出来的字符串
      let lastIndex = (defaultTagRE.lastIndex = 0); // 正则的lastIndex 修正test过后的变化 置为0
      let match, index;
      while ((match = defaultTagRE.exec(text))) {
        index = match.index; // 当前这次匹配的第一个位置
        // 当前匹配的位置>上次匹配的结尾 说明当前这一次匹配的位置和上次匹配的位置中间有普通文本，将文本push到tokens中
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        // 将匹配到的变量用_s()包裹起来
        tokens.push(`_s(${match[1].trim()})`);
        console.log(lastIndex);
        // 将lastIndex修改为匹配到的位置结尾处
        lastIndex = index + match[0].length;
      }
      // 都匹配完了 结尾可能还有一部分 如 helloworld {{msg}}  aa 其中的aa也需要push进去
      tokens.push(JSON.stringify(text.slice(lastIndex)));
      return `_v(${tokens.join("+")})`;
    }
  }
}
// 编译children
function genChildren(el) {
  const children = el.children;
  if (children) {
    return children.map((c) => gen(c)).join(",");
  } else {
    return false;
  }
}
export function generate(el) {
  let children = genChildren(el);
  let code = `_c("${el.tag}",${
    el.attrs.length ? genProps(el.attrs) : "undefined"
  }${children ? `,${children}` : ""})`;
  return code;
}
