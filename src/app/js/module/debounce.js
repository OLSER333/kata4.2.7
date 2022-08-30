export default function debounce(fn, debounceTime)  {
  let timerId
  return function(...args) {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn.apply(this, args)
    }, debounceTime)
  }
};
