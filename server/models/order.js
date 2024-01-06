const mongoose=require('mongoose')
const Schema=mongoose.Schema

const orderSchema=new Schema({
  items:[
    {
      product:{type:Object,required:true},
      quantity:{type:Number,required:true}
    }
  ],
  user:{
    userID:{
      type:Schema.Types.ObjectId,
      required:true
    },
    name:{
      type:String,
      required:true,
      ref:'User'
    } 
  }

})

module.exports=mongoose.model('Order',orderSchema)