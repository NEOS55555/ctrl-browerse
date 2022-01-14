const map = {}
const setGblData = (key, val) => (map[key] = val)
const getGblData = (key) => map[key]

function gsAb(key, defval = false) {
  map[key] = defval
  return {
    get() {
      return getGblData(key)
    },
    set(f) {
      setGblData(key, f)
    },
    toggle() {
      const flag = !this.get()
      this.set(flag)
      return flag
    },
  }
}

exports.isShowListGsAb = gsAb('isShowList')
exports.isShowSoftware = gsAb('isShowSoftware', true)

exports.getGblData = getGblData
exports.setGblData = setGblData
