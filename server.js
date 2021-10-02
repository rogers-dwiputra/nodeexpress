const express = require('express')
const bodyParser = require('body-parser')

const books = require('./src/routes/books')
const { checkApiKey } = require('./src/middleware/apikey')

const app = express();

/* Middleware */
app.set('json spaces', 2)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(checkApiKey)
app.use(express.json())
app.use('/', books)

app.listen(3000, function() {
    console.log('listening on port 3000')
})

app.get('/', function(req, res) {
    res.json({nama: 'Rogers', text: 'Halo Dunia'})
})