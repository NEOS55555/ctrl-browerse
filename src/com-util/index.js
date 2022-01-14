exports.getRandId = function getRandId() {
  const t = Date.now()
  const r = parseInt(Math.random() * 1000000)
  return t + r
}

exports.debounce = (lastCb, timeout = 500, firstCb) => {
  let isFristEval = false
  let timmer = null
  // console.log('就尼玛离谱')
  function gomov(...args) {
    if (!isFristEval) {
      firstCb && firstCb()
      isFristEval = true
    }
    clearTimeout(timmer)
    return new Promise((resolve) => {
      timmer = setTimeout(() => {
        isFristEval = false
        resolve(lastCb && lastCb(...args))
      }, timeout)
    })
  }
  gomov.clear = function () {
    isFristEval = false
    clearTimeout(timmer)
  }

  return gomov
}

exports.getRand = function getRand(a, b) {
  return Math.floor(Math.random() * (b - a) + a)
}
