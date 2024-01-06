  const express=require('express')
  const mongoose=require('mongoose')
  const cors = require('cors');

  const adminRoutes=require('./routes/admin')
  const shopRoutes=require('./routes/shop')
  const User=require('./models/user')

  const bodyParser=require('body-parser')

  app=express()
  app.use(cors())
  app.use(bodyParser.urlencoded({extended:false}))
  app.use(bodyParser.json()); 
  
  app.use((req,res,next)=>{
    User.findOne().then(user=>{
      req.user=user
      next();
    })
  })

  app.use('/admin',adminRoutes)
  app.use(shopRoutes)



  mongoose.connect('mongodb+srv://menava:menava@cluster0.l1mkcvo.mongodb.net/shop?retryWrites=true&w=majority')
  .then(()=>{
    User.findOne().then(result=>{
      if(!result){
        const user=new User({name:'test',email:'test',cart:{}})
        user.save()
      }
    })
    app.listen(3000);
    console.log('Successful')
  })
  .catch((err)=>{
    console.log(err)
  })