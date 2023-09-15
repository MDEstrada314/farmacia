require ('dotenv').config()
const Server = require('./model/Server.js')


const server = new Server()

server.listen()