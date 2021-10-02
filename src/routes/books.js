var express = require('express')
var router = express.Router()
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
const Joi = require('joi');
const config = require('../config')

router.get('/books', function(req, res) {
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        const cursor = booksCollection.find().toArray().then(results => {
        // console.log(results)
        client.close();
        res.json(results)
        })
    .catch(error => console.error(error))
    }).catch(error => {
        console.error(error)
    })
})

router.get('/books/:bookId', function(req, res) {
    console.log(req.params.bookId)
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        const cursor = booksCollection.findOne({"_id" : ObjectId(req.params.bookId)}).then(results => {
        client.close();
        if(!results) { return res.status(404).send("Not Found") }
        res.json(results)
        })
    .catch(error => console.error(error))
    }).catch(error => {
        console.error(error)
    })
})

router.post('/books', function(req, res) {
    // if(!req.body.book_title || req.body.book_title.length < 3) { res.status(400).send("Book Title Is Required And Min 3 Char") }
    
    const schema = Joi.object({
        book_title: Joi.string()
        .min(3)
        .max(30)
        .required(),
        publisher: Joi.string()
    });

    const result = schema.validate(req.body)
    if(result.error) {
        return res.status(400).send(result.error.details[0].message)
    }
    
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        booksCollection.insertOne(req.body).then(result => {
            client.close();
            console.log(result)
            res.send(result.insertedId)
        })
        .catch(error => console.error(error))
    }).catch(error => {
        console.error(error)
    })
})

module.exports = router