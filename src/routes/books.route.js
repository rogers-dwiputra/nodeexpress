var express = require('express')
var router = express.Router()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const Joi = require('joi');

const config = require('../database/config')

router.get('/books', function(req, res) {
    // Connect Ke Database
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        // Jalankan Query
        const cursor = booksCollection.find().toArray().then(results => {
            // console.log(results)
            client.close()
            res.json(results)
        })
        .catch(error => console.error(error))
        // Setelah Dapat Result, Close Connection
    }).catch(error = () => { console.error(error) })
})

router.get('/books/:bookId', function(req, res) {
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        console.log(req.params.bookId)
        const cursor = booksCollection.findOne({ "_id" : ObjectId(req.params.bookId) }).then(results => {
            client.close()
            if(results == null){
                return res.status(404).send(`Book ID ${req.params.bookId} Not Found`)
            }
            res.json(results)
        })
        .catch(error => console.error(error))
    }).catch(error = () => { console.error(error) })
})

router.post('/books', function(req, res) {
    const schema = Joi.object({
        book_title: Joi.string()
            .min(3)
            .max(30)
            .required(),
        publisher: Joi.string()
    })

    const validationResult = schema.validate(req.body);

    if(validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message)
    }

    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        booksCollection.insertOne(req.body).then(result => {
            client.close()
            console.log(result)
            res.send("OK")
        })
        .catch(error => console.error(error))
    }).catch(error = () => { console.error(error) })
})

router.put('/books/:bookId', function(req, res) {
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        const cursor = booksCollection.findOneAndUpdate(
            { "_id" : ObjectId(req.params.bookId) }, { $set: {
                book_title: req.body.book_title,
                publisher: req.body.publisher
            } },
            {
                upsert: true
            }).then(results => {
            client.close()
            res.json(results.value)
        })
        .catch(error => console.error(error))
    }).catch(error = () => { console.error(error) })
})

router.delete('/books/:bookId', function(req, res) {
    MongoClient.connect(config.connectionString, {useUnifiedTopology: true}).then((client) => {
        console.log('Connected To Database')
        const db = client.db('books')
        const booksCollection = db.collection('booksCollection')
        const cursor = booksCollection.deleteOne({ "_id" : ObjectId(req.params.bookId) }).then(result => {
            client.close()
            console.log(result)
            res.json(result.acknowledged)
        }).catch(error => console.error(error))
    }).catch(error = () => { console.error(error) })
})

module.exports = router