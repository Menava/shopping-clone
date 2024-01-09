const express=require('express')
const router=express.Router()
const AuthController=require('../controllers/auth')

router.post('/login',AuthController.postLogin)

router.get('/login',AuthController.getLogin)


module.exports=router