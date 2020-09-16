const mongoose  = require('mongoose')
const { schema } = require('./user')

const Schema = mongoose.Schema
const addressSchema = new Schema({
    name :{
        type : String,
        required :[true , 'username is required']
    },
    mobile : {
        type : String ,
        required : [true , 'mobile no. is required'],
        unique : true,
        minlength : [10 ,'invalid mobile number'] ,
        maxlength : [10 ,'invalid mobile number']
    },
    alternatemobile : {
        type : String ,
    } ,
    street : {
        type : String,
        required : true
    },
    landmark : {
        type : String
    },
    city :{
        type : String,
        required : true
    },
    states : {
        type : String,
        required : true
    },
    pincode : {
        type : String,
        required : true
    },
    addresstype : {
        type : String,
        requiredc: true
    }
})

const Address = mongoose.model('Address',addressSchema)
module.exports = Address