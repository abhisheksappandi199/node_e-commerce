const mongoose  = require('mongoose')
const { orderItemSchema } = require('./orderItem')
const Product = require('../models/product')

const Schema = mongoose.Schema
const cartitemSchema = new Schema({

    products : [orderItemSchema],

    // product :{
    //     type : Schema.Types.ObjectId ,
    //     ref : 'Product'
    // },
    user :{
        type : Schema.Types.ObjectId ,
        ref : 'User'
     }
    // quantity : {
    //     type : String,
    //     required : true
    // }
})

cartitemSchema.statics.updateByType = function(cartid,productid, type){
    const Cart = this 
    if(type === 'down'){
        return Cart.findOneAndUpdate({_id : cartid , 'products._id': productid } , { $inc : {"products.$.quantity" : -1}},{ new : true}) 
    }
    else if(type === 'up') {
        return Cart.findOneAndUpdate({_id : cartid ,'products._id': productid } , { $inc : {"products.$.quantity" : 1}} ,{ new : true}) 
    } 
    else if(type === 'reset'){
        return Cart.findOneAndUpdate({_id : cartid , 'products._id': productid } , { $set : {"products.$.quantity" : 0}},{ new : true}) 

    }
}

const Cartitem = mongoose.model('Cartitem',cartitemSchema)
module.exports = Cartitem