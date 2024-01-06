const express=require('express')
const router=express.Router()
const shopController=require('../controllers/shop')

router.get('/products',shopController.getProducts)

router.get('/products/:productID',shopController.getProduct)

router.get('/add-to-cart/:productID',shopController.addCart)

router.get('/getCart',shopController.getCart)

module.exports=router