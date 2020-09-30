const mongoose  = require('mongoose')
const Product = require('../models/product')

const Schema = mongoose.Schema
const cartitemSchema = new Schema({

    products : [
        {
            product : {
                type : Schema.Types.ObjectId,
                ref : 'Product'
            },
            productname : {
                type : String
            },
            quantity : {
                type : Number,
                default : 1
            },
            price : {
                type : Number
            },
            subtotal: {
                type: Number
            },
            image : {
                type : String
            }
        }
    ],
    user :{
        type : Schema.Types.ObjectId ,
        ref : 'User'
     },
     total : {
         type : String
     }
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

cartitemSchema.pre('save',function(next){
    let cartitem = this
    let total =0
    Product.findById(cartitem.products[0].product)
    .then((item)=>{
        // console.log("this is pre save and add price to product");
        // console.log(item);
        cartitem.products[0].productname = item.name
        cartitem.products[0].price = item.price
        cartitem.products[0].subtotal = cartitem.quantity * item.price
        cartitem.products[0].image = item.image[0]
        next()
    })

})

const Cartitem = mongoose.model('Cartitem',cartitemSchema)
module.exports = { Cartitem , cartitemSchema }
