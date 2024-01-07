  const express=require('express')
  const session=require('express-session')
  const mongoose=require('mongoose')
  const cors = require('cors');

  const adminRoutes=require('./routes/admin')
  const shopRoutes=require('./routes/shop')
  const authRoutes=require('./routes/auth')
  const User=require('./models/user')

  const bodyParser=require('body-parser')

  app=express()

  app.enable('trust proxy',1);

  app.use(cors({
    origin:"http://127.0.0.1:5500",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  }))

  app.use(bodyParser.urlencoded({extended:false}))
  app.use(bodyParser.json()); 
  app.use(session({
    secret:'this is a secret',
    resave:false,
    saveUninitialized:false,
    cookie: {
      sameSite: 'none',
      httpOnly: false,
      secure: false,
  }
  }))
  
  app.use((req,res,next)=>{
    User.findOne().then(user=>{
      req.user=user
      next();
    })
  })

  app.use('/admin',adminRoutes)
  app.use(shopRoutes)
  app.use(authRoutes)



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