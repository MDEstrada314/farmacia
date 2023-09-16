const { json } = require('express/lib/response')
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




/* const ejercio7 = async(req,res)=>{
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
 */

const ejercio7 = async(req,res)=>{
    try {
        const colección = await getCollection('Compras')
        const pipeline = await colección.aggregate ([
            {
              $unwind: "$medicamentosComprados" // Desagregar el array de medicamentos
            },
            {
              $group: {
                _id: '$proveedor.nombre',
                totalCantidadComprada: { $sum: "$medicamentosComprados.cantidadComprada" } // Sumar cantidadComprada por nombreMedicamento
              }
            },
            {
              $sort: { _id: 1 } // Ordenar por nombreMedicamento en orden ascendente (1) o descendente (-1)
            }
          ]).toArray();
      
         
      
          res.json(pipeline);
        } catch (error) {
          console.error('Error al calcular la cantidad comprada por medicamento:', error);
        } 
}


/* const ejercio8 = async (req,res) =>{
    try {
        const colección = await getCollection('Ventas')
        const valor = await colección.aggregate([
            {
            $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id:null,
                    precioTotal: { $sum: { $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] } } // Calcular el precio total
                }
            }
    ]).toArray()
    res.json(valor)
        
    } catch (error) {
        console.error('Error al calcular la cantidad comprada por medicamento:', error);
    }
}
 */


const ejercio8 = async (req,res) =>{
    try {
        const colección = await getCollection('Ventas')
        const valor = await colección.find().toArray()
        let valorTotal = 0
        valor.forEach(element => {
            element.medicamentosVendidos.forEach(doc =>{
                valorTotal += doc.cantidadVendida * doc.precio
            })

            
        });
        res.json({
            totalVentas :`$ ${valorTotal}`
        })

          

        
    } catch (error) {
        console.error('Error al calcular la cantidad comprada por medicamento:', error);
    }
}


const ejercio9 = async (req,res) =>{
    try {
        const colección = await getCollection('Medicamentos')
        const medicamentos = await colección.aggregate([
            {
                $lookup:{
                    from:"Ventas",
                    localField: "nombre",
                    foreignField: "medicamentosVendidos.nombreMedicamento",
                    as: "vendidos"
                }
            },
            {
                $match: {
                  "vendidos": {$size:0}
                }
            }
        
        
        ]).toArray()
        res.json(medicamentos)

          
    } catch (error) {
        console.error('Error al calcular la cantidad comprada por medicamento:', error);
    }
}

const ejercio10 = async (req,res) =>{
    try {
        const colección = await getCollection('Medicamentos')
        const medicamentos = await colección.find().sort({precio:-1}).limit(1).toArray()
        res.json(medicamentos)

          
    } catch (error) {
        console.error('Error al calcular la cantidad comprada por medicamento:', error);
    }
}

const ejercio11 = async (req,res) =>{
    try {
        const colección = await getCollection('Medicamentos')
        const medicamentos = await colección.find().toArray();
        let totales = [0,0,0]
        medicamentos.map((e)=>{
            if(e.proveedor.nombre == 'ProveedorA'){
                totales[0]++;
            }
            if(e.proveedor.nombre == 'ProveedorB'){
                totales[1]++
            }
            else if(e.proveedor.nombre == 'ProveedorC'){totales[2]++}
    })
        const mediProvee = [
            {proveedorA: `${totales[0]} medicamnetos`},
            {proveedorB: `${totales[1]} medicamnetos`},
            {proveedorC: `${totales[2]} medicamnetos`},
        ]

        res.json({
            CantidadMedicamentos: mediProvee
        })  

          
    } catch (error) {
        console.error('Error al calcular la cantidad comprada por medicamento:', error);
    }
}

const ejercio12 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')
        const result = await colecion.find({'medicamentosVendidos.nombreMedicamento':'Paracetamol'})
        .project({ "_id": 0, "paciente.nombre": 1, "medicamentosVendidos.nombreMedicamento": 1 }).toArray()
        res.json(result)
        cliente.close()

    } catch (error) {
        
            res.status(404).json("no se encontro datos")
        
    }
}


const ejercio13 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Compras')
        const fecha_busqueda = new Date('2023-01-01');
        colecion.find({"fechaCompra": {"$lt": fecha_busqueda}}).toArray()
            .then(resultados => {
                res.json(resultados) 
                })

        } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}

const ejercio14 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')
        const fecha_inicio = new Date('2023-05-01');
        const fecha_final = new Date('2023-05-30');
       
        
        const result = await colecion.find({
            fechaVenta: { $gte: fecha_inicio, $lte: fecha_final }
        }).toArray();

        
        res.json(result);

        } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}

// Obtener el medicamento menos vendido en 2023.
const ejercio15 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')
        const result = await colecion.aggregate([
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $match: {
                    "fechaVenta": {
                        $gte: new Date("2023"),
                        $lte: new Date("2024")
                    }
                }
            },
            {
                $group: {
                    _id: "$medicamentosVendidos.nombreMedicamento",
                    totalVendido: { $sum: "$medicamentosVendidos.cantidadVendida" }
                }
            },
            {
                $sort: { totalVendido: 1 }
            },
            {
                $limit: 1
            }
        ]).toArray();
        res.json(result)
        cliente.close()
    } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}   

const ejercio16 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Compras')
        const result = await colecion.aggregate([
            {
                $unwind: "$medicamentosComprados"
            },
            {
                $group:{
                    _id:"$proveedor.nombre",
                    gananciasPesos: { $sum:"$medicamentosComprados.precioCompra"}

                }
            },
            {
                $sort: { _id: 1 } 
              }

        ]).toArray()

        
        res.json(result);

        } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}




// Promedio de medicamentos comprados por venta.
const ejercio17 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')
        const result = await colecion.aggregate([
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: "$_id",
                    totalMedicamentos: { $sum: "$medicamentosVendidos.cantidadVendida" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    promedioMedicamentosPorVenta: { $avg: "$totalMedicamentos" }
                }
            },
            {
                $project:{
                    _id: 0
                }
            }
        ]).toArray();

        res.json(result[0]); 
        cliente.close()
    } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}  

// Cantidad de ventas realizadas por cada empleado en 2023.
const ejercio18 = async (req, res) => {
    try {
        const coleccion = await getCollection('Ventas');
        const result = await coleccion.aggregate([
            {
                $unwind:'$medicamentosVendidos'
            },
            {
                $match: {
                    fechaVenta: {
                        $gte: new Date("2023"),
                        $lt: new Date("2024")
                    }
                }
            },
            {
                $group: {
                    _id: "$empleado.nombre",
                    cantidadVentas: { $sum: '$medicamentosVendidos.cantidadVendida' }
                }
            }
        ]).toArray();

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json("No se encontraron datos");
        }

    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 

const ejercio19 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Medicamentos')
        const date_init = new Date('2024-01-01')
        const date_fin = new Date('2024-12-31')
        const result = await colecion.find({fechaExpiracion: { $gte:date_init , $lte:date_fin}}).toArray()
        res.json(result)

      
    } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}  


const ejercio20 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')

        const result = await colecion.aggregate([
          {
            $unwind:'$medicamentosVendidos'
          },
          {
            $group:{
                _id:"$empleado.nombre",
                cantidadVendida:{ $sum:"$medicamentosVendidos.cantidadVendida"}
            }
          }

        ]).toArray()
        let result2 = []
        result.map((e)=>{
            if(e.cantidadVendida > 5){
                result2.push(`nombre:${e._id} -------- Total ventas :${e.cantidadVendida}`)
                
            }
        })
        res.json(result2)




      
    } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}  


const ejercio21 = async (req,res) =>{
    try {
        const colección = await getCollection('Ventas')
        const medicamentos = await colección.aggregate([
            {
                $lookup:{
                    from:"Compras",
                    localField: "medicamentosVendidos.nombreMedicamento",
                    foreignField: "medicamentosComprados.nombreMedicamento",
                    as: "vendidos"
                }
            },
            {
                $match: {
                  "vendidos": {$size:0}
                }
            }
        
        
        ]).toArray()
        res.json(medicamentos)

          
    } catch (error) {
        console.error('Error al calcular la cantidad comprada por medicamento:', error);
    }
}


const ejercio22 = async (req, res) => {
    try {
        const coleccion = await getCollection('Ventas');
        const result = await coleccion.aggregate([
            {
                $unwind:'$medicamentosVendidos'
            },
            {
                $match: {
                    fechaVenta: {
                        $gte: new Date("2023"),
                        $lt: new Date("2024")
                    }
                }
            },
            {
                $group: {
                    _id: "$paciente.nombre",
                    cantidadVendida: { $sum: '$medicamentosVendidos.precio' }
                }
               
            },
            {
                $sort:{precio:-1}
            },
            {
                $limit:1
            } 
        ]).toArray();

            res.json(result);
      

    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 


const ejercio23 = async (req, res) => {
    try {
        const coleccion = await getCollection('Empleados');
        const result = await coleccion.aggregate([
            {
                $lookup: {
                    from: 'Ventas',
                    localField: 'nombre',
                    foreignField: 'empleado.nombre',
                    as: 'ventas'
                }
            },
            {
                $match: {
                    ventas: { $size: 0 },
                }
            }
        ]).toArray();
        res.json(result)
    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 

const ejercio24 = async (req, res) => {
    try {
        const coleccion = await getCollection('Compras');
        const result = await coleccion.aggregate([
            {
                $match: {
                  fechaCompra: {
                    $gte: new Date("2023"),
                    $lt: new Date("2024")
                  }
                }
              },
              {
                $unwind: "$medicamentosComprados"
              },
              {
                $group: {
                  _id: "$proveedor.nombre",
                  cantidadSuministrada: { $sum: "$medicamentosComprados.cantidadComprada" }
                }
              },
              {
                $sort: {
                  cantidadSuministrada: -1
                }
              },
              {
                $limit: 1
              }
        ]).toArray();
        res.json(result)
    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 



const ejercio25 = async (req, res) => {
    try {
        const coleccion = await getCollection('Ventas');
        const result = await coleccion.aggregate([
            {
                $unwind:'$medicamentosVendidos'
            },
            {
                $match: {
                    fechaVenta: {
                        $gte: new Date("2023"),
                        $lt: new Date("2024")
                    },
                    'medicamentosVendidos.nombreMedicamento':'Paracetamol'

                }
            },
            {
                $group: {
                    _id: "$paciente.nombre",
                    registros: { $push: "$$ROOT" }
                }
               
            }

        ]).toArray();

            res.json(result);
      

    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 


const ejercio26 = async (req, res) => {
    try {
        const coleccion = await getCollection('Ventas');
        const result = await coleccion.aggregate([
            {
                $unwind:'$medicamentosVendidos'
            },
            {
              $group: {
                _id: { $month: "$fechaVenta" },
                totalVentas: { $sum: '$medicamentosVendidos.cantidadVendida' },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ])
          .toArray();
        res.json(result);
      

    } catch (error) {
        res.status(500).json("Error interno del servidor");
   
    }

}

const ejercio27 = async (req,res)=>{
    try {
        const colecion =  await getCollection('Ventas')

        const result = await colecion.aggregate([
          {
            $unwind:'$medicamentosVendidos'
          },
          {
            $group:{
                _id:"$empleado.nombre",
                cantidadVendida:{ $sum:"$medicamentosVendidos.cantidadVendida"}
            }
          }

        ]).toArray()
        let result2 = []
        result.map((e)=>{
            if(e.cantidadVendida < 5){
                result2.push(`nombre:${e._id} -------- Total ventas :${e.cantidadVendida}`)
                
            }
        })
        res.json(result2)


      
    } catch (error) {
            res.status(404).json("no se encontro datos")
    }
}  



const ejercio28 = async (req, res) => {
    try {
        const coleccion = await getCollection('Compras');
        const result = await coleccion.aggregate([
            {
                $match: {
                    fechaCompra: {
                        $gte: new Date("2023"),
                        $lt: new Date("2024")
                    },
                }
            },
            {
                $group: {
                    _id: "$proveedor.nombre"
                }
            }

        ]).toArray();
        const total = result.length
            res.json({
                total,result});
      
    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 



const ejercio29 = async (req, res) => {
    try {
        const coleccion = await getCollection('Medicamentos');
        const result = await coleccion.aggregate([
            {
                $match: {
                    stock: {
                        $lte: 50
                        
                    },
                }
            },
            {
                $group: {
                    _id: "$proveedor.nombre",
                    registros: { $push: "$$ROOT" }
                }
            }

        ]).toArray();
        const total = result.length
            res.json({
                total,result});
      
    } catch (error) {
        res.status(500).json("Error interno del servidor");
    }
} 

const ejercio30 = async(req,res)=>{
   try {
    const coleccion = await getCollection('Pacientes')
    const result = await coleccion.aggregate([

        {
            $lookup: {
                from: 'Ventas',
                localField: 'nombre',
                foreignField: 'paciente.nombre',
                as: 'ventas'
            }
        },
        {
            $match: {
                ventas: { $size: 0 },
            }
        }
    ]).toArray();
    res.json(result)

   } catch (error) {
    res.status(500).json("Error interno del servidor");
   }
}


const ejercio31 = async (req, res) => {
    try {
        const coleccion = await getCollection('Ventas');
        const result = await coleccion.aggregate([
            {
                $unwind:'$medicamentosVendidos'
            },
            {
              $group: {
                  _id: { $month: "$fechaVenta" },
                  medicamento:{ $push: '$medicamentosVendidos.nombreMedicamento'},
                  totalVentas: { $sum: '$medicamentosVendidos.cantidadVendida' },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ])
          .toArray();
        res.json(result);
      

    } catch (error) {
        res.status(500).json("Error interno del servidor");
   
    }

}


const ejercio32 = async (req, res) => {
    try {
        const coleccion = await getCollection('Ventas');
        const result = await coleccion.aggregate([
            {
                $unwind:'$medicamentosVendidos'
            },
            {
                $match: {
                    fechaVenta: {
                        $gte: new Date("2023"),
                        $lt: new Date("2024")
                    },
                }
            },
          
            {
              $group: {
                  _id:"$empleado.nombre",
                  medicamento:{ $push: '$medicamentosVendidos.nombreMedicamento'},
                  totalVentas: { $sum: '$medicamentosVendidos.cantidadVendida' },
              },
            },
            {
              $sort: { totalVentas: -1 },
            },
            {
                $limit:1
            }
          ])
          .toArray();
        res.json(result);
      

    } catch (error) {
        res.status(500).json("Error interno del servidor");
   
    }

}






module.exports = {
    ejercio1,ejercio2,ejercio3,ejercio4,ejercio5,ejercio6,ejercio7,ejercio8,ejercio9,
    ejercio10,ejercio11,ejercio12,ejercio13,ejercio14,ejercio15,ejercio16,ejercio17,ejercio18,ejercio19,
    ejercio20,ejercio21,ejercio22,ejercio23,ejercio24,ejercio25,ejercio26,ejercio27,ejercio28,ejercio29,ejercio30,ejercio31,
    ejercio32
}