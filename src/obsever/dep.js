let id = 0;

class Dep {
  constructor() {
    this.id = id++; // 用于标记Dep
    this.subs = [];
  }
  depend() {
    // 1.让dep记住（存）watcher
    // 2.让watcher记住dep 双向记忆
    Dep.target.addDep(this); // 这个时候Dep.target就是watcher
  }
  // 存watcher
  addSub(watcher) {
    this.subs.push(watcher);
  }
  // 通知更新方法
  notify() {
    // 调用当前属性对应的每一个watcher的update方法
    this.subs.forEach((watcher) => watcher.update());
  }
}

// 用于标记属性 在defineProperty中 如果Dep.target 不是null 证明被赋值了watcher 然后就走依赖收集的流程
Dep.target = null;
const stack = [];
// 赋值target
export function pushTarget(watcher) {
  Dep.target = watcher;
  // 这个主要是的computed 和 watch 对应的watcher的标记
  // stack.push(watcher);
}

// 删除target
export function popTarget() {
  Dep.target = null;
  // stack.pop();
  // Dep.target = stack[stack.length - 1];
}

export default Dep;
