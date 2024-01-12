const Product=require('../models/product')
const User=require('../models/user')
const Order=require('../models/order')

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
  req.user.populate('cart.items.productID')
  .then(user=>{
    res.send(user.cart.items)
  })  
}

exports.addCart=(req,res,next)=>{
  const productID=req.params.productID
  req.user.addToCart(productID).then(result=>{
    res.send('cart has been updated')
  })
}

exports.deleteCart=(req,res,next)=>{
  const productID=req.params.productID
  req.user.deleteCart(productID).then(result=>{
    res.send('Product has been removed by cart')
  })
}

exports.getOrder=(req,res,next)=>{
  Order.find({'user.userID':req.user._id}).then(orders=>{
    res.send(orders)
  })
}

exports.addOrder=(req,res,next)=>{
  req.user.populate('cart.items.productID')
  .then(user=>{
    const products=user.cart.items.map(i=>{
      return {product:{...i.productID._doc},quantity:i.quantity}
    })
    const order=new Order({user:{
      userID:req.user,
      name:req.user.name
    },
    items:products
  })
    return order.save()
  }
  ).then(result=>{
    req.user.clearCart().then(result=>{
      res.send('order has been saved')
    })
  })
}