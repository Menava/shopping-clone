const Product=require('../models/product')

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