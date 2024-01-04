const express=require('express')
const adminController=require('../controllers/admin')
const router=express.Router()

router.post('/add-product',adminController.addProduct)

router.get('/get-product',adminController.getProduct)

module.exports=router