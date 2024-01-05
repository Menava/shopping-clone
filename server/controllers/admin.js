const Product=require('../models/product')

exports.addProduct=(req,res,next)=>{
  const product=new Product({
    title:req.body.title,
    price:req.body.price,
    description:req.body.description,
    imageUrl:req.body.imageUrl})
    product.save()
    .then(result=>{
      res.status(200).send(product)
    }
    )
    .catch(err=>{
      console.log(err)
      res.status(500).send(err)
    })
  
}

exports.updateProduct=(req,res,next)=>{
  const productID=req.params.productID
  Product.findById(productID).then(product=>{
    product.title=req.body.title
    product.price=req.body.price
    product.description=req.body.description
    product.imageUrl=req.body.imageUrl
    product.save().then(result=>{
      console.log('product updated sucessfully')
      res.status(200).send(product)
    })
    .catch(err=>{
      console.log(err)
    })  
  })
}