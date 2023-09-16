const router = require('express').Router()
const { ejercio1,ejercio2,ejercio3, ejercio4, ejercio5, ejercio6, ejercio7, ejercio8, ejercio9, ejercio10, ejercio11, ejercio12, ejercio13 } = require('../controller/farmacia.controller')



router.get('/hola', async(req,res)=>{
    try {
        res.json({"mes":"si se pudo"})
    } catch (error) {
        res.json("pailas")
    }
})  


//Rutas
router.get('/ejercio1', ejercio1)
router.get('/ejercio2', ejercio2)
router.get('/ejercio3', ejercio3)
router.get('/ejercio4', ejercio4)
router.get('/ejercio5', ejercio5)
router.get('/ejercio6', ejercio6)
router.get('/ejercio7', ejercio7)
router.get('/ejercio8', ejercio8)
router.get('/ejercio9', ejercio9)
router.get('/ejercio10', ejercio10)
router.get('/ejercio11', ejercio11)
router.get('/ejercio12', ejercio12)
router.get('/ejercio13', ejercio13)




module.exports= router