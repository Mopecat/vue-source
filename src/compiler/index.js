import { parserHTML } from "./parser";
import { generate } from "./generate";

export function compileToFunctions(template) {
  console.log(template);
  // 第一步 由模板编译成ast语法树
  let ast = parserHTML(template);
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
  let code = generate(ast);
  code = `with(this){return ${code}}`;
  console.log(code);

  let render = new Function(code); // 将字符串转换为函数
  return render;
}
