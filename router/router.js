const router = require('express').Router()
const { ejercio1,ejercio2,ejercio3 } = require('../controller/farmacia.controller')



router.get('/hola', async(req,res)=>{
    try {
        res.json({"mes":"si se pudo"})
    } catch (error) {
        res.json("pailas")
    }
})  


//ejercion 1
router.get('/ejercio1', ejercio1)
router.get('/ejercio2', ejercio2)
router.get('/ejercio3', ejercio3)


module.exports= router