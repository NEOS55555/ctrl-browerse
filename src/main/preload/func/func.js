exports.listCss = `.q-abc-list {
	width: 250px;
	border: 1px solid #ccc;
	position: fixed;
	font-size:16px;
	background:#fff;
	z-index:100001;
	box-shadow:1px 1px 15px #ccc;
}
.q-abc-title {
	font-weight: bold;
	font-size:16px;
	padding: 5px;
	border-bottom: 1px solid;
}
.q-abc-list ul {
	list-style: none;
	padding: 0;
	margin: 0;
}
.q-abc-list .q-abc-list-li {
	padding: 5px 10px;
	border-bottom: 1px solid #ccc;
	cursor: pointer;
}

.q-abc-list .q-abc-list-li .q-abc-check {
	display:none;
}
.q-abc-list .q-abc-list-li.active .q-abc-check {
	display:block;
	float:right;
}
.q-abc-list .q-abc-list-li:hover {
	background-color: bisque;
}
.q-abc-list .q-abc-list-li.active {
	background-color: #00c4ff;
}
.q-abc-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 100000;
	background-color: rgba(0, 0, 0, .7);
}
`

function getListLi(arr, sortNum) {
  return arr
    .map(
      (it, idx) =>
        `<li class="q-abc-list-li q-no-ms-abc ${
          it.active ? 'active' : ''
        }" data-data='${JSON.stringify(it)}'>${
          (sortNum && !it.notSort ? idx + 1 + '.' : '') + it.name
        } <button class="q-abc-check">检测</button></li>`
    )
    .join('')
}
exports.getListLi = getListLi
exports.getListHtml = function (arr, { id, style, title, sortNum }) {
  return `<div id="${id}" class="q-abc-list" style="${style}" >
	<div class="q-abc-title">${title}</div>
	<ul>${getListLi(arr, sortNum)}</ul>
	</div>`
}

exports.getMaskModal = function (ctn) {
  return `<div class="q-abc-mask">${ctn}</div>`
}

exports.init = function () {
  var div = document.createElement('div')
  div.innerHTML =
    '<style type="text/css">' +
    '.nbaMask { position: fixed; z-index: 100002; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       ' +
    '.nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; } ' +
    '.nbaDialog { position: fixed; z-index: 100002; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }' +
    '.nbaDialog .nbaDialogHd { padding: .2rem .27rem .08rem .27rem; }' +
    '.nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; }' +
    '.nbaDialog .nbaDialogBd { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000; }' +
    '.nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }' +
    '.nbaDialog .nbaDialogFt:after { content: " "; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               ' +
    '.nbaDialog .nbaDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #09BB07; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       ' +
    '.nbaDialog .nbaDialogBtn:after { content: " "; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             ' +
    '.nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }' +
    '</style>' +
    '<div id="dialogs2" style="display: none">' +
    '<div class="nbaMask"></div>' +
    '<div class="nbaDialog">' +
    '    <div class="nbaDialogHd">' +
    '        <strong class="nbaDialogTitle"></strong>' +
    '    </div>' +
    '    <div class="nbaDialogBd" id="dialog_msg2">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>' +
    '    <div class="nbaDialogHd">' +
    '        <strong class="nbaDialogTitle"></strong>' +
    '    </div>' +
    '    <div class="nbaDialogFt">' +
    '        <a href="javascript:;" class="nbaDialogBtn nbaDialogBtnPrimary" id="dialog_ok2">确定</a>' +
    '    </div></div></div>'
  document.body.appendChild(div)
  function message(msg, callback) {
    var dialogs2 = document.getElementById('dialogs2')
    dialogs2.style.display = 'block'

    var dialog_msg2 = document.getElementById('dialog_msg2')
    dialog_msg2.innerHTML = msg

    // var dialog_cancel = document.getElementById("dialog_cancel");
    // dialog_cancel.onclick = function() {
    // dialogs2.style.display = 'none';
    // };
    var dialog_ok2 = document.getElementById('dialog_ok2')
    dialog_ok2.onclick = function () {
      dialogs2.style.display = 'none'
      callback()
    }
    return function () {
      document.getElementById('dialog_ok2').style.display = 'none'
    }
  }

  window.message = message
}

exports.get$aurl = function ($item, itempath, urlpath) {
  let $a = null
  let $node = $item
  if (!$node) {
    return
  }
  if (itempath != urlpath) {
    $node = $node.find(urlpath).eq(0)
    // send('不等啊')
  } else {
    $node = $node.eq(0)
  }
  if ($node.length == 0) {
    return
  }

  if ($node[0].tagName.toLocaleLowerCase() == 'a') {
    $a = $node
  } else {
    let temp = $node.find('a').eq(0)
    if (temp.length > 0) {
      $a = temp
    } else {
      $a = $node.parents('a').eq(0)
    }
  }
  return $a.attr('href')
}
exports.get$name = function ($item, itempath, namepath) {
  let $node = $item
  if (!$node) {
    return
  }
  if (itempath != namepath) {
    $node = $node.find(namepath)
  }

  return $node.text()
}
