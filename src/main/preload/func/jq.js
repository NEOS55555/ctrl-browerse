// JavaScript Document
var $Q = function (args) {
  return new Base(args)
}
function Base(args) {
  this.elements = []
  if (typeof args == 'string') {
    //css模拟
    if (args.indexOf(' ') != -1) {
      var elements = args.split(' ') //args以空格(原文中的空格)的形式分开成数组
      var childElements = [] //存放临时节点对象的数组,解决被覆盖的问题
      var node = [] //用来存放父节点
      for (var i = 0; i < elements.length; i++) {
        if (node.length == 0) node.push(document) //如果默认没有父节点酒吧document放入
        switch (elements[i].charAt(0)) {
          case '#':
            childElements = [] //清理掉临时节点，以便父节点失效，子节点有效
            childElements.push(this.getId(elements[i].substring(1)))
            node = childElements //保存父节点，因为childElements要清理
            break
          case '.':
            childElements = []
            for (var j = 0; j < node.length; j++) {
              var temps = this.getClass(elements[i].substring(1), node[j])
              for (var k = 0; k < temps.length; k++) {
                childElements.push(temps[k])
              }
            }
            node = childElements
            break
          default:
            childElements = []
            for (var j = 0; j < node.length; j++) {
              var temps = this.getTagName(elements[i], node[j])
              for (var k = 0; k < temps.length; k++) {
                childElements.push(temps[k])
              }
            }
            node = childElements
        }
      }
      this.elements = childElements
    } else {
      //find模拟
      switch (args.charAt(0)) {
        case '#':
          this.elements.push(this.getId(args.substring(1)))
          break
        case '.':
          this.elements = this.getClass(args.substring(1))
          break
        default:
          this.elements = this.getTagName(args)
      }
    }
  } else if (typeof args == 'object') {
    if (args != undefined) {
      this.elements[0] = args //_this是一个对象，undefined也是一个对象,却别与typeof返回的带单引号的
    }
  }
}
Base.prototype = {
  length: 0,
}
Base.prototype.getTagName = function (tag, parentNode) {
  var node = null
  var temps = []
  if (parentNode != undefined) {
    node = parentNode
  } else {
    node = document
  }
  var tags = node.getElementsByTagName(tag)
  for (var i = 0; i < tags.length; i++) {
    temps.push(tags[i])
  }
  return temps
}
Base.prototype.getId = function (id) {
  return document.getElementById(id)
}
Base.prototype.getClass = function (className, parentNode) {
  var node = null
  var temps = []
  if (parentNode != undefined) {
    node = parentNode
  } else {
    node = document
  }
  var allNodes = node.getElementsByTagName('*')
  for (var i = 0; i < allNodes.length; i++) {
    if (allNodes[i].className.indexOf(className) != -1) {
      temps.push(allNodes[i])
    }
  }
  return temps
}
//跨浏览器获取style
function getStyle(element, attr) {
  if (typeof window.getComputedStyle != 'undefined') {
    //W3C得到计算后的样式
    return window.getComputedStyle(element, null)[attr]
  } else if (typeof element.currentStyle != 'undefined') {
    //IE
    return element.currentStyle[attr]
  }
}
const hasClass = (node, cls) => node.classList.contains(cls)
//添加css
Base.prototype.addClass = function (cls) {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].classList.add(cls)
  }
  return this
}
Base.prototype.removeClass = function (cls) {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].classList.remove(cls)
  }
  return this
}
Base.prototype.foreach = function (cb) {
  for (var i = 0; i < this.elements.length; i++) {
    cb(this.elements[i], i)
  }
  return this
}
//设置css样式
Base.prototype.css = function (attr, value) {
  for (var i = 0; i < this.elements.length; i++) {
    if (value == null) {
      //获取css样式
      return getStyle(this.elements[i], attr)
    }
    if (typeof attr === 'object') {
      for (let atr in attr) {
        this.elements[i].style[atr] = attr[atr] //设置css样式
      }
    } else {
      this.elements[i].style[attr] = value //设置css样式
    }
  }
  return this
}
Base.prototype.attr = function (key, value) {
  for (var i = 0; i < this.elements.length; i++) {
    if (value == null) {
      //获取css样式
      return this.elements[i].getAttribute(key)
    }
    this.elements[i].setAttribute(key, value)
  }
  return this
}
//获取某一个节点，并返回这个节点对象
Base.prototype.get = function (num) {
  return this.elements[num]
}
Base.prototype.append = function (hstr) {
  var div = document.createElement('div')
  div.innerHTML = hstr
  this.elements[0].appendChild(div.firstChild)
  div.removeChild(div.firstChild)
  div = null
  // return this.elements[num]
}
Base.prototype.first = function () {
  return this.elements[0]
}
//获取某一个节点，并返回Base对象
Base.prototype.eq = function (num) {
  if (typeof num == 'undefined') num = 0
  var element = this.elements[num]
  this.elements = []
  this.elements[0] = element
  return this
}
Base.prototype.hide = function () {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].style.display = 'none'
  }
}
Base.prototype.show = function () {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].style.display = 'block'
  }
}
//获取当前节点的下一个节点
Base.prototype.next = function () {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i] = this.elements[i].nextSibling
    if (this.elements[i] == null) throw new Error('找不到下一个节点')
    if (this.elements[i].nodeType == 3) this.next()
  }
  return this
}
//获取当前节点上下一个节点
Base.prototype.prev = function () {
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i] = this.elements[i].prevSibling
    if (this.elements[i] == null) throw new Error('找不到上一个节点')
    if (this.elements[i].nodeType == 3) this.next()
  }
  return this
}
//设置html
Base.prototype.html = function (str) {
  for (var i = 0; i < this.elements.length; i++) {
    if (arguments.length == 0) {
      return this.elements[i].innerHTML
    }
    this.elements[i].innerHTML = str
  }
  return this
}

//设置表单字段内容获取
Base.prototype.value = function (str) {
  for (var i = 0; i < this.elements.length; i++) {
    if (arguments.length == 0) {
      return this.elements[i].value
    }
    this.elements[i].value = str
  }
  return this
}
//设置事件发生器
Base.prototype.bind = function (event, fn) {
  for (var i = 0; i < this.elements.length; i++) {
    addEvent(this.elements[i], event, fn)
  }
  return this
}
//点击事件
Base.prototype.click = function (fn) {
  for (var i = 0; i < this.elements.length; i++) {
    addEvent(this.elements[i], 'click', fn)
  }
}
//hover事件
Base.prototype.hover = function (fn1, fn2) {
  for (var i = 0; i < this.elements.length; i++) {
    addEvent(this.elements[i], 'mouseover', fn1)
    addEvent(this.elements[i], 'mouseout', fn2)
  }
  return this
}

//跨浏览器事件绑定
function addEvent(obj, type, fn) {
  if (typeof obj.addEventListener != 'undefined') {
    obj.addEventListener(type, fn, false) //w3c
  } else {
    //创建一个存放事件的哈希表
    if (!obj.events) obj.events = {} //不存在才创建
    //第一次执行时执行
    if (!obj.events[type]) {
      //创建一个存放事件处理函数的数组
      obj.events[type] = []
    } else {
      //屏蔽同一个注册函数,不添加到计数器中
      //alert('fn');
      if (addEvent.equal(obj.events[type], fn)) return false
    }
    //从第二次开始用事件计数器来存储
    obj.events[type][addEvent.ID++] = fn
    //执行事件处理函数
    obj['on' + type] = addEvent.exec
  }
}
//为每个事件非配一个计数器
addEvent.ID = 0
//执行事件处理函数
addEvent.exec = function (event) {
  var e = event || addEvent.fixEvent(window.event)
  var es = this.events[e.type]
  for (var i in es) {
    es[i].call(this, e)
  }
}
//屏蔽同一个注册函数
addEvent.equal = function (es, fn) {
  for (var i in es) {
    if (es[i] == fn) return true
  }
  return false
}
//把IE常用的Event对象配对到W3C中去
addEvent.fixEvent = function (event) {
  event.preventDefault = addEvent.fixEvent.preventDefault
  event.stopPropagation = addEvent.fixEvent.stopPropagation
  event.target = event.srcElement
  return event
}
//阻止IE默认行为
addEvent.fixEvent.preventDefault = function () {
  this.returnValue = false
}
//IE取消冒泡
addEvent.fixEvent.stopPropagation = function () {
  this.cancelBubble = true
}

exports.$ = $Q
