const express=require('express')
const adminController=require('../controllers/admin')
const router=express.Router()

router.post('/add-product',adminController.addProduct)

router.post('/update-product/:productID',adminController.updateProduct)

module.exports=router