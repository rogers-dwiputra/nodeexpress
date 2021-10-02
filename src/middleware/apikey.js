const checkApiKey = function (req, res, next) {
    console.log(JSON.stringify(req.headers))
    if(req.headers.apikey == '123456') {
        next()
    }
    else {
        return res.status(403).send("API Key Salah")
    }
  }

module.exports = { checkApiKey }