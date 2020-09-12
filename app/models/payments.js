const mongoose  = require('mongoose')
const { schema } = require('./user')

const Schema = mongoose.Schema
const paymentSchema = new schema({
    order_id :{
        type : Schema.Types.ObjectId ,
        ref : 'Order'
    },
    type : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    total :{
        type : String,
        required : true
    },
    timestamps : {
        type : String,
        required : true
    }
})

const Payment = mongoose.model('Payment',paymentSchema)
module.exports = Payment