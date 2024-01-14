const User=require('../models/user')
const bcrypt = require('bcrypt');
const crypto=require('crypto')

exports.postLogin=(req,res,next)=>{
  User.findOne({'email':req.body.email}).then(user=>{
    if(!user){
      return res.status(500).send('User does not exist')
    }
    bcrypt.compare(req.body.password,user.password).then(result=>{
      if(!result){
        return res.status(500).send('Password is wrong')
      }
      req.session.user=user
      res.status(200).send(user)
    })
  })
}

exports.postSignup=(req,res,next)=>{
  User.findOne({'email':req.body.email}).then(result=>{
    if(result)
    {
      return res.status(500).send('User already in database')
    }
    bcrypt.hash(req.body.password, 12).then(hashedPassword=>{
      const user=new User({name:req.body.name,password:hashedPassword,email:req.body.email,cart:{items:[]}})
      user.save().then(result=>res.send('User has been created'))
    })  
  });
}

exports.postLogout=(req,res,next)=>{
  req.session.destroy(result=>{
    res.status(200).send('Logged out')
  })
}

exports.postResetPassword=(req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      return res.status(500).send('Buffer failed')
    }
    const token=buffer.toString('hex')
    User.findOne({'email':req.body.email}).then(user=>{
      if(!user){
        return res.status(500).send('Email does not exist')
      }
      user.resetToken=token
      user.tokenExpiration=Date.now()+3600000
      return user.save().then(result=>{
        return res.send(token)
      })
    })
  })
}

exports.postConfirmResetPassword=(req,res,next)=>{
  const token=req.params.token
  User.findOne({'resetToken':token,'tokenExpiration':{$gt:Date.now()}}).then(user=>{
    if(!user){
      return res.status(500).send('Something went wrong')
    }
    bcrypt.hash(req.body.password,12).then(hashedPassword=>{
      user.password=hashedPassword
      user.resetToken=undefined
      user.tokenExpiration=undefined
      return user.save().then(result=>{
        res.status(200).send('Password Successfully Updated')
      })
    })
  })
  .catch(err=>{
    console.log(err)
  })
}