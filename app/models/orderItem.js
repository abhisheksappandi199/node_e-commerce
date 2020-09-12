const mongoose = require('mongoose')
const Product = require('../models/product')

const Schema = mongoose.Schema
const orderItemSchema = new Schema({
    product : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    },
    // order : {
    //     type : Schema.Types.ObjectId,
    //     ref : 'Order'
    // },
    quantity : {
        type : Number,
        default : 1
    },
    price : {
        type : Number
    },
    subtotal: {
        type: Number
    }  
})
orderItemSchema.pre('save',function(next){
    let orderitem = this
    let total =0
    Product.findById(orderitem.product)
    .then((item)=>{
        orderitem.price = item.price
        orderitem.subtotal = orderitem.quantity * item.price
        next()
    })

})

const OrderItem = mongoose.model('OrderItem',orderItemSchema)

module.exports = {
    orderItemSchema ,
    OrderItem
}