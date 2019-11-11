/**
 * 函数防抖 (单位时间内只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fun, delay) => {
  return function(args) {
    let d = delay || 500;
    let that = this;
    let _args = args;
    clearTimeout(fun.id);
    fun.id = setTimeout(function() {
      fun.call(that, _args);
    }, d);
  };
};
/**
 * 函数节流（单位时间内只执行第一次）
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fun, delays) => {
  let last, deferTimer;
  let t = delays || 2000;
  return function() {
    let that = this;
    let _args = arguments;
    let now = +new Date();
    if (last && now < last + t) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fun.apply(that, _args);
      }, t);
    } else {
      last = now;
      fun.apply(that, _args);
    }
  };
};
