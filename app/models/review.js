const mongoose  = require('mongoose')

const Schema = mongoose.Schema
const reviewSchema = new schema({
    product :{
        type : Schema.Types.ObjectId ,
        ref : 'Product'
    },
    user :{
        type : Schema.Types.ObjectId ,
        ref : 'User'
    },
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    }
})

const Review = mongoose.model('Review',reviewSchema)
module.exports = Review