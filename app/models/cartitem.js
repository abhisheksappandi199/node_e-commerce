const mongoose  = require('mongoose')
const { orderItemSchema } = require('./orderItem')

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

const Cartitem = mongoose.model('Cartitem',cartitemSchema)
module.exports = Cartitem