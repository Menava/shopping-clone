const Product=require('../models/product')
const User=require('../models/user')

exports.getProducts=(req,res,next)=>{
  Product.find().then(result=>{
    res.send(result)
}).catch(err=>{
  console.log(err)
})
}

exports.getProduct=(req,res,next)=>{
  const prodID=req.params.productID
  Product.findById(prodID).then(result=>{
    res.send(result)
}).catch(err=>{
  console.log(err)
})
}

exports.getCart=(req,res,next)=>{
  console.log(req.user.cart)
}

exports.addCart=(req,res,next)=>{
  const productID=req.params.productID
  req.user.addToCart(productID).then(result=>{
    res.send('cart has been updated')
  })
}