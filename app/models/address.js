const mongoose  = require('mongoose')

const Schema = mongoose.Schema
const addressSchema = new Schema({
    user :{
        type : Schema.Types.ObjectId ,
        ref : 'User'
        //type : String
     },
    name :{
        type : String,
        required :[true , 'username is required']
    },
    mobile : {
        type : String ,
        required : [true , 'mobile no. is required'],
        //unique : true,
        min : [10 ,'invalid mobile number'] ,
        max : [10 ,'invalid mobile number']
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
        required: true
    }
})

const Address = mongoose.model('Address',addressSchema)
module.exports = Address