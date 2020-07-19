import { pushTarget, popTarget } from "./dep";
import { queueWatcher } from "./scheduler";
let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.deps = []; // 用于记住（存）dep
    this.depIds = new Set(); // 用于去重dep
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }
    this.id = id++; // 用于标记watcher 后面去重用
    // 需要直接调用渲染和更新的方法 并进行对应的依赖收集 所以直接调用get
    this.get();
  }
  get() {
    // 标记 这个时候Dep.target就不是null了
    pushTarget(this);
    // 渲染和更新方法会访问data中的属性，访问的时候就会调用当前属性get方法 通过get方法中判断Dep.target 进行依赖收集 而此时Dep.target不是null
    this.getter();
    // 清空Dep.target
    popTarget(this);
  }
  // 收集dep
  addDep(dep) {
    // 判断有没有存过当前的这个dep
    if (!this.depIds.has(dep.id)) {
      // 存dep
      this.deps.push(dep);
      // 存dep的id
      this.depIds.add(dep.id);
      // 将当前的这个watcher存到dep中
      dep.addSub(this);
    }
  }
  // 更新wather列队
  update() {
    queueWatcher(this); // 将watcher存储起来
    // this.get();
  }
  // 更新方法
  run() {
    this.get();
  }
}

export default Watcher;
