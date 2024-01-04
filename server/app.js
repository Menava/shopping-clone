  const express=require('express')
  const mongoose=require('mongoose')
  const cors = require('cors');

  const adminRoutes=require('./routes/admin')
  const shopRoutes=require('./routes/shop')

  const bodyParser=require('body-parser')

  app=express()
  app.use(cors())
  app.use(bodyParser.urlencoded({extended:false}))
  app.use(bodyParser.json()); 

  app.use('/admin',adminRoutes)
  app.use(shopRoutes)

  app.use('/',(req,res,next)=>{
    res.status(404).send('Page Not Found')
  })

  mongoose.connect('mongodb+srv://menava:menava@cluster0.l1mkcvo.mongodb.net/shop?retryWrites=true&w=majority')
  .then(()=>{
    app.listen(3000);
    console.log('Successful')
  })
  .catch((err)=>{
    console.log(err)
  })