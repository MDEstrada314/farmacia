const { MongoClient } = require('mongodb')
require ('dotenv').config()
const baseDb = process.env.MONGO_URI  
const cliente = new MongoClient(baseDb)
cliente.connect()
const db = cliente.db('farmaciaCampus') 

const ejercio1 = async (req,res)=>{
    try {
        const colecion = db.collection('Medicamentos')
        const result = await colecion.find({"stock":{"$lt":50}}).toArray()
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}

const ejercio2 = async (req,res)=>{
    try {
        const colecion = db.collection('Medicamentos')
        const result = await colecion.distinct('proveedor')
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}

const ejercio3 = async (req,res)=>{
    try {
        const colecion = db.collection('Medicamentos')
        const result = await colecion.find({'proveedor.nombre':'ProveedorA'}).toArray()
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}


module.exports = {
    ejercio1,ejercio2,ejercio3
}