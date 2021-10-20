const logTarget = document.getElementById('logTarget')

logTarget.addEventListener('change', (evt) => {
  for (let file of evt.target.files) {
    replaceCommon(file)
  }
})

const download = async (str, name) => {
  var blob = new Blob([str], { type: 'text/html' })
  var link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '[C]' + name
  link.click()
}
// 読み込み
function replaceCommon(target) {
  const isAll = document.getElementById('isAll').checked
  var reader = new FileReader()
  reader.readAsText(target, 'UTF-8')
  reader.onload = async function () {
    // 置き換え
    if (!isAll) {
      var result = await replacePiece(reader.result)
    } else {
      var result = await replaceAll(reader.result)
    }
    // ダウンロードリンクの表示
    download(result, target.name)
    target.value = ''
  }
}

// 全タブ置き換え
async function replaceAll(logText) {
  // タブ名は残す
  var result = logText.replace(/\]<\/span>/g, ']</span><B>')
  var res = await replaceOther(result)
  return res
}

// 各タブ置き換え
async function replacePiece(logText) {
  // タブ名削除
  var result = logText.replace(/<span> \[.*\]<\/span>/g, '<B>')
  var res = await replaceOther(result)
  return res
}

// 置換_共通
async function replaceOther(result) {
  result = result.replace(/<\/span> :/g, "</span></B> :");
  result = result.replace(/p style="/g, 'p style="margin: 0; ');
  // 繰り返しコマンドの改行
  result = result.replace(/(#\d*)\n/g,'<br>$1<br>')
  return result
}
