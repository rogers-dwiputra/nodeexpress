const checkApiKey = function (req, res, next) {
    console.log(req.headers.apikey)
    if(req.headers.apikey == '123456') {
        next()
    }
    else {
        return res.status(403).send("Unauthorized")
    }
};

module.exports = { checkApiKey }