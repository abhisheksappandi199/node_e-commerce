const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    price :{
        type : String,
        required : true,
        min : 1
    },
    description : {
        type : String,
        required : true
    },
    category : {
        type : Schema.Types.ObjectId ,
        ref : 'Category'
    },
    stock : {
        type : String,
        required : true
    },
    avaliable_from : {
        type : Date 
    },
    image : {
        type : Array 
    },
    color : {
        type : String,
        required : true
    },
    size : {
        type : String,
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product