const express=require('express')
const router=express.Router()
const shopController=require('../controllers/shop')
const isAuth=require('../middleware/is-auth')

router.get('/products',shopController.getProducts)

router.get('/products/:productID',shopController.getProduct)

router.get('/add-to-cart/:productID',isAuth,shopController.addCart)

router.get('/getCart',isAuth,shopController.getCart)

router.get('/deleteCart/:productID',isAuth,shopController.deleteCart)

router.get('/order',isAuth,shopController.getOrder)

router.get('/addOrder',isAuth,shopController.addOrder)

module.exports=router