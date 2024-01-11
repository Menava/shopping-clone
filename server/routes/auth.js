const express=require('express')
const router=express.Router()
const AuthController=require('../controllers/auth')

router.post('/login',AuthController.postLogin)

router.post('/signup',AuthController.postSignup)

module.exports=router