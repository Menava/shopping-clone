const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  cart:{
    items:[
      {
      productID:{type:Schema.ObjectId,ref:'Product',required:true},
      quantity:{type:Number,required:true}
    }
  ]
  },
})

userSchema.methods.addToCart=function(productID){
  const productIndex=this.cart.items.findIndex(product=>product.productID.toString()===productID.toString())

  if(productIndex>=0){
    this.cart.items[productIndex].quantity+=1
  }
  else{
    this.cart.items.push({productID:productID,quantity:1})
  }
  return this.save()

}

module.exports=mongoose.model('User',userSchema)