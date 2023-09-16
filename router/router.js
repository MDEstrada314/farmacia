const router = require('express').Router()
const { ejercio1,ejercio2,ejercio3, ejercio4, ejercio5, ejercio6, ejercio7, ejercio8, ejercio9,
     ejercio10, ejercio11, ejercio12, ejercio13, ejercio14, ejercio15, ejercio16, ejercio17, 
     ejercio18, ejercio19, ejercio20, ejercio21, ejercio22, ejercio23, ejercio24, ejercio25, ejercio26, ejercio27, ejercio28, ejercio29, ejercio30, ejercio31, ejercio32 } = require('../controller/farmacia.controller')



router.get('/hola', async(req,res)=>{
    try {
        res.json({"mes":"si se pudo"})
    } catch (error) {
        res.json("pailas")
    }
})  


//Rutas
/* const numero = 38
for (let index = 1; index < numero; index++) {
    const ejercio = "ejercio";
    router.get(`/ejercio${index}`, ejercio,`${index}`)
} */
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
router.get('/ejercio14', ejercio14)
router.get('/ejercio15', ejercio15)
router.get('/ejercio16', ejercio16)
router.get('/ejercio17', ejercio17)
router.get('/ejercio18', ejercio18)
router.get('/ejercio19', ejercio19)
router.get('/ejercio20', ejercio20)
router.get('/ejercio21', ejercio21)
router.get('/ejercio22', ejercio22)
router.get('/ejercio22', ejercio22)
router.get('/ejercio23', ejercio23)
router.get('/ejercio24', ejercio24)
router.get('/ejercio25', ejercio25)
router.get('/ejercio26', ejercio26)
router.get('/ejercio27', ejercio27)
router.get('/ejercio28', ejercio28)
router.get('/ejercio29', ejercio29)
router.get('/ejercio30', ejercio30)
router.get('/ejercio31', ejercio31)
router.get('/ejercio32', ejercio32)






module.exports= router