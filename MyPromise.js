class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(func) {
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      // 此处resolve，reject两个函数作为参数传递至外面，this指向可能发生变换，提前绑定一下。
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      // 捕获到的异常也需要通过reject方式
      this.reject(error);
    }
  }

  resolve(result) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach((callback) => {
        setTimeout(() => {
          callback(result);
        });
      });
    }
  }

  reject(reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach((callback) => {
        setTimeout(() => {
          callback(reason);
        });
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (this.PromiseState === MyPromise.PENDING) {
      // 当resolve或reject是异步调用时，此时then方法会是pending状态
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
    if (
      this.PromiseState === MyPromise.FULFILLED &&
      typeof onFulfilled === "function"
    ) {
      setTimeout(() => {
        onFulfilled(this.PromiseResult);
      });
    }
    if (
      this.PromiseState === MyPromise.REJECTED &&
      typeof onRejected === "function"
    ) {
      setTimeout(() => {
        onRejected(this.PromiseResult);
      });
    }
    // 链式调用待实现
    return new MyPromise();
  }
}

window.MyPromise = MyPromise;
