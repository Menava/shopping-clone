  const express=require('express')
  const session=require('express-session')
  const mongoose=require('mongoose')
  const cors = require('cors');
  const bodyParser=require('body-parser')

  const adminRoutes=require('./routes/admin')
  const shopRoutes=require('./routes/shop')
  const authRoutes=require('./routes/auth')
  const User=require('./models/user')

  app=express()
  app.use(bodyParser.urlencoded({extended:false}))
  app.use(bodyParser.json()); 

  app.use(cors({
    origin:"http://localhost:5500",
    credentials: true,
  }))

  app.use(session({
    secret:'this is a secret',
    resave:false,
    saveUninitialized:false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
  }
  }))
  
  app.use((req,res,next)=>{
    if(!req.session.user){
      return next()
    }
    User.findById(req.session.user._id).then(user=>{
      req.user=user
      next()
    })
  })

  app.use('/admin',adminRoutes)
  app.use(shopRoutes)
  app.use(authRoutes)

  mongoose.connect('mongodb+srv://menava:menava@cluster0.l1mkcvo.mongodb.net/shop?retryWrites=true&w=majority')
  .then(()=>{
    app.listen(3000);
    console.log('Successful')
  })
  .catch((err)=>{
    console.log(err)
  })