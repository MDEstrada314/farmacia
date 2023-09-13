const express  = require('express')
const mongo = require('mongodb').MongoClient

const router = require('./router/router.js')
require ('dotenv').config()


const port = process.env.PORT


const app = express()


app.use('/',router)

app.use(express.json())
app.listen(port,()=>{
    console.log('hola a todos');
})



