const mongoose = require('mongoose')

const Schema = mongoose.Schema
const myorderSchema = new Schema({

    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    myorders : {
        type : Array
    }
})

const MyOrder = mongoose.model('MyOrder',myorderSchema)
module.exports = MyOrder