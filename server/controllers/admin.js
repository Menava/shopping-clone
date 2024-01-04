const Product=require('../models/product')

exports.addProduct=(req,res,next)=>{
  const title=req.body.title
  const price=req.body.price
  const description=req.body.description
  const imageUrl=req.body.imageUrl

  const product=new Product({
    title:title,
    price:price,
    description:description,
    imageUrl:imageUrl})
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

exports.getProduct=(req,res,next)=>{
  Product.find().then(result=>{
    res.send(result)
}).catch(err=>{
  console.log(err)
})
}
