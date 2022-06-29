const headers = require('./headers')
function successRes(res, todoData) {
  res.writeHead(200, headers)
  res.write(JSON.stringify({
    status: "success",
    data: todoData
  }))
}

module.exports = successRes