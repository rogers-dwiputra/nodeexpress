const express = require('express')
const bodyParser = require('body-parser')
const helmet = require("helmet");

const books = require('./src/routes/books.route')
const { checkApiKey } = require('./src/middleware/apikey')

const port = process.env.PORT || 5000

const app = express();

/* Middleware */
app.set('json spaces', 2)
app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(checkApiKey)
app.use('/', books)

app.listen(port, function() {
    console.log(`listening on port ${port}`)
})

app.get('/', function(req, res) {
    res.send("Hello World")
})