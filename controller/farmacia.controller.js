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
    const fecha_busqueda = new Date('2023-01-10');
    colecion.find({"fechaVenta": {"$gte": fecha_busqueda}}).toArray()

        .then(resultados => {
            const fechaFinal = []
            const fechas = resultados.map(documento => documento.fechaVenta);
            for (let index = 0; index < fechas.length; index++) {
                const element = `fecha ${index} ---> ${fechas[index]}`;
                fechaFinal.push(element)

                
            }
        res.json(fechaFinal);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Error en la consulta' });
        });

}


/* const ejercio5 = async (req,res)=>{
    const colecion =  await getCollection('Ventas')
    colecion.find({'medicamentosVendidos.nombreMedicamento':'Paracetamol'}).toArray()
    .then(resultado => {
        res.json(resultado); // Responder con los resultados
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "Error de consulta"});
    });
    
}    */


const ejercio5 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')
        const ventas = await colecion.find({'medicamentosVendidos.nombreMedicamento': 'Paracetamol'}).toArray();
    const totalVentas = ventas.reduce((total, venta) => {
        const medicamento = venta.medicamentosVendidos.find((m) => m.nombreMedicamento === 'Paracetamol');
        if (medicamento) {
            total.precio += medicamento.precio;
            total.cantidadVendida += medicamento.cantidadVendida;
        }
        return total;
    }, { precio : 0, cantidadVendida: 0 });

    res.json(totalVentas);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la consulta" });
}
    
}   



const ejercio6 = async (req,res)=>{
    const colección = await getCollection('Medicamentos')
    const fecha_busqueda = new Date ('2024-01-02')
    colección.find({"fechaExpiracion": {"$lt": fecha_busqueda}})
    .project({ "_id": 0, "nombre": 1, "fechaExpiracion": 1 }) // Incluye solo los campos "nombre" y "fechaExpiracion"
    .toArray()
    .then(result => {
        res.json(result);
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Error en la consulta' });
    });
}

const ejercio7 = async(req,res)=>{
    try {
        const colección = await getCollection('Medicamentos')
        const nombres = await colección.aggregate([
            {
                $group: {
                    _id: "$proveedor.nombre",
                    total: { $sum: 1 }
                }
            }
        ]).toArray();
        res.json(nombres);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la consulta' });
    }


}





module.exports = {
    ejercio1,ejercio2,ejercio3,ejercio4,ejercio5,ejercio6,ejercio7
}