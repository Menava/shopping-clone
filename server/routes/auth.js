const express=require('express')
const router=express.Router()
const { body } = require('express-validator');
const AuthController=require('../controllers/auth')
const isAuth=require('../middleware/is-auth')
const User=require('../models/user')

router.post('/login',AuthController.postLogin)

router.post(
  '/signup',
  [
    body('name').notEmpty(),
    body('email')
      .notEmpty()
      .custom((value,{req})=>{
        return User.findOne({'email':value}).then(result=>{
          if(result)
          {
            return Promise.reject('User already in database')
          }
        })
      }),
    body('password').notEmpty(),
  ],
  AuthController.postSignup)

router.post('/reset-password',AuthController.postResetPassword)

router.post('/reset-password/:token',AuthController.postConfirmResetPassword)

router.get('/logout',isAuth,AuthController.postLogout)
module.exports=router