const express=require('express')
const router=express.Router()
const AuthController=require('../controllers/auth')

router.post('/login',AuthController.postLogin)

router.post('/signup',AuthController.postSignup)

router.get('/logout',AuthController.postLogout)
module.exports=router