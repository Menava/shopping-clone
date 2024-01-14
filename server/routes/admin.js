const express=require('express')
const adminController=require('../controllers/admin')
const router=express.Router()
const isAuth=require('../middleware/is-auth')

router.post('/add-product',isAuth,adminController.addProduct)

router.post('/update-product/:productID',isAuth,adminController.updateProduct)
router.get('/delete-product/:productID',isAuth,adminController.deleteProduct)

module.exports=router