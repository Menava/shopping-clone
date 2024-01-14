const express=require('express')
const router=express.Router()
const AuthController=require('../controllers/auth')
const isAuth=require('../middleware/is-auth')

router.post('/login',AuthController.postLogin)

router.post('/signup',AuthController.postSignup)

router.post('/reset-password',AuthController.postResetPassword)

router.post('/reset-password/:token',AuthController.postConfirmResetPassword)

router.get('/logout',isAuth,AuthController.postLogout)
module.exports=router