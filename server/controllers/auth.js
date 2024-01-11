const User=require('../models/user')
const bcrypt = require('bcrypt');

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
  const name=req.body.name
  const password=req.body.password
  const email=req.body.email

  User.findOne({'email':email}).then(result=>{
    if(result)
    {
      return res.status(500).send('User already in database')
    }

    bcrypt.hash(password, 12).then(hashedPassword=>{
      const user=new User({name:name,password:hashedPassword,email:email,cart:{items:[]}})
      user.save().then(result=>res.send('User has been created'))
    })  
  });
}