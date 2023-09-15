const express = require('express')


class Server {
    constructor(){
            this.app = express()
            this.path = '/'
            this.router()
            this.middleware()
            this.port = process.env.PORT
            
    }
    middleware(){
        this.app.use(express.json())
    }
    router(){
        this.app.use(this.path, require('../router/router.js'))
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log('bueno creo que ya');
        })
    }
}

module.exports = Server