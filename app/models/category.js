const mongoose = require('mongoose')
const { model } = require('./user')

const Schema = mongoose.Schema
const categorySchema = new Schema({
    name :{
        type : String,
        required : true
    },
    proucts :[
        {
            type : Schema.Types.ObjectId,
            ref : 'Product'
        }
    ]
})

const Category = mongoose.model('Category',categorySchema)
model.exports = Category