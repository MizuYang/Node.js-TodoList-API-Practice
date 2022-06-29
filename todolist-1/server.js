const http = require('http')
const errorMessage = require('./errorMessage')
const successRes = require('./successRes')
const headers = require('./headers')
const { v4: uuidv4 } = require('uuid');
const todoData = []

function requestListener(req, res) {
  const method = req.method
  const isTodoUrl = req.url === '/todolist'

  let body = ''
  req.on('data', (chunk) => body += chunk)

  if (isTodoUrl && method === 'GET') { //* 取得全部
    successRes(res, todoData)
    res.end()
  } else if (isTodoUrl && method === 'POST') { //* 編輯
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        const add8Hr = +new Date() + 8 * 3600 * 1000 //* 補回八小時
        const time = new Date(add8Hr).toLocaleString() //* toLocaleString 有8H時差
        if (title !== undefined) { //* 屬性必須是 title
          const todo = {
            title: title,
            id: uuidv4(),
            time: time
          }
          todoData.unshift(todo)
          successRes(res, todoData)
        } else {  //* 屬性錯誤
          errorMessage(res, '請輸入正確的屬性')
        }
      } catch { //* {}錯誤
        errorMessage(res, '請輸入正確的格式')
      }
      res.end()
    })
  } else if (isTodoUrl && method === 'DELETE') { //* 刪除全部
    todoData.length = 0
    successRes(res, todoData)
    res.end()
  } else if (req.url.match('/todolist/') && method === 'DELETE') { //* 刪除單一
    const id = req.url.split('/').pop()
    const idIndex = todoData.findIndex(todo => todo.id === id)
    if (idIndex !== -1) { //* ID 對的話才刪除
      todoData.splice(idIndex, 1)
      successRes(res, todoData)
    } else {
      errorMessage(res, '請輸入正確刪除 ID')
    }
    res.end()
  } else if (req.url.match('/todolist/') && method === 'PATCH') { //* 編輯
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        const id = req.url.split('/').pop()
        const idIndex = todoData.findIndex(todo => todo.id === id)
        if (idIndex !== -1 && title !== undefined) { //* 必須有該 id 且屬性必須為 title
          todoData[idIndex].title = title
          successRes(res, todoData)
        } else { //* 屬性或 id 錯
          errorMessage(res, '請輸入正確 ID 或屬性')
        }
      } catch { //* {} 錯
        errorMessage(res, '請輸入正確格式')
      }
      res.end();
    })
  } else if (method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorMessage(res, '請輸入正確網址')
    res.end();
  }
}

const server = http.createServer(requestListener)
server.listen(process.env.PORT || 8000)