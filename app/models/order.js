const mongoose = require('mongoose')
const { orderItemSchema } = require('./orderItem')

const Schema = mongoose.Schema
const orderSchema = new Schema({

    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    date : {
        type : Date
    },
    orderItems : [ orderItemSchema ],
    total : {
        type : Number
    },
    createdAt : {
        type : String
    },
    address : {
        type : Schema.Types.ObjectId,
        ref : 'Address'
    }
})

const Order = mongoose.model('Order',orderSchema)
module.exports = Order