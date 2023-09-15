const { MongoClient } = require('mongodb')
require ('dotenv').config()

const baseDb = process.env.MONGO_URI  
const cliente = new MongoClient(baseDb)

async function getCollection(collectionName){
    try {
        await cliente.connect()
        const db = cliente.db('farmaciaCampus') 
        const collection = db.collection(collectionName)
        return collection
    } catch (error) {
        console.log('Yuca en la nuca');
    }
}

const ejercio1 = async (req,res)=>{
    try {
        const colecion = await getCollection('Medicamentos')
        const result = await colecion.find({"stock":{"$lt":50}}).toArray()
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}

const ejercio2 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Medicamentos')
        const result = await colecion.distinct('proveedor')
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}

const ejercio3 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Medicamentos')
        const result = await colecion.find({'proveedor.nombre':'ProveedorA'}).toArray()
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}

const ejercio4 = async (req,res)=>{
    const colecion =  await getCollection('Ventas')
    const result = await colecion.find({
        fecha: {
            $gte: new Date("2023-01-15T00:00:00.000+00:00")
          }
      }).toArray()
    res.json(result)

}











module.exports = {
    ejercio1,ejercio2,ejercio3,ejercio4
}