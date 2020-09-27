const mongoose = require('mongoose')
const {cartitemSchema} = require('./Cartitem')
const Product = require('../models/product')
const Schema = mongoose.Schema

const billSchema = new Schema({
    date: {
        type: Date, 
        default: Date.now 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    address : {
        type : Schema.Types.ObjectId,
        ref: 'Address'
    },
    total: {
        type: Number
    },
    lineItems: [ cartitemSchema ]
}, { timestamps: true })

billSchema.pre('save', function(next){
    const bill = this 
    let total = 0 
    const productIds = bill.lineItems[0].products.map(items => items.product)
    Product.find().where('_id').in(productIds)
        .then((lineItemss) => {
            bill.lineItems[0].products.forEach(lineItem => {
                const price = lineItemss.find(product => String(product._id) == String(lineItem.product)).price 
                lineItem.price = price
                lineItem.subtotal = price * lineItem.quantity
                total += lineItem.subtotal
            })
            bill.total = total 
            next()
        })
})

const Bill = mongoose.model('Bill',billSchema)

module.exports = Bill