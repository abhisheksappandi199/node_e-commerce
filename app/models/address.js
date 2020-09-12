const mongoose  = require('mongoose')
const { schema } = require('./user')

const Schema = mongoose.Schema
const addressSchema = new schema({
    name :{
        type : Schema.Types.ObjectId ,
        ref : 'User'
    },
    street : {
        type : String,
        required : true
    },
    landmark : {
        type : String,
        required : true
    },
    city :{
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    }
})

const Address = mongoose.model('Address',addressSchema)
module.exports = Address