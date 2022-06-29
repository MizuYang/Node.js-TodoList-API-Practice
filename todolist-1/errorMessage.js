const headers = require('./headers')
function errorMessage(res, msg) {
  res.writeHead(404, headers)
  res.write(JSON.stringify({
    status: "fail",
    message: msg
  }))
}

module.exports = errorMessage