let has = {}; // 用于判断是否是重复的watcher 避免同时重复修改某一个属性时 多次的更新视图 浪费性能
let queue = []; // watcher的队列

// 将watcher存储进队列
export function queueWatcher(watcher) {
  const id = watcher.id;
  // 重复的watcher不加入队列
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);
    nextTick(flushSchedulerQueue);
  }
}

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  // 清空 保证当再次更新的时候用的是新的watcher
  has = {};
  queue = [];
}
let callbacks = []; // 用于收集当前这次更新调用nextTick方法的所有回调函数，其中第一个回调时上面的flushSchedulerQueue代表的是渲染watcher 他总是在第一个，所后续调用的$nextTick是在渲染后执行的
let pending = false; // 代表正在更新
// 异步更新方法
export function nextTick(fn) {
  callbacks.push(fn);
  if (!pending) {
    // 异步执行  用 setTimeout模拟一下 实际上涉及到不同浏览器以及不同情况的事件环兼容 包括Promise，setImmediate, MutationObserver等的情况用法
    setTimeout(() => {
      flushCallbacksQueue();
    }, 0);
    pending = true;
  }
}

function flushCallbacksQueue() {
  callbacks.forEach((fn) => fn());
  pending = false; // 更新完毕 置为false
}
