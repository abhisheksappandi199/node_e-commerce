const Bill = require('../models/bill')
const { Cartitem }= require('../models/Cartitem')
const  billController = {}

billController.addbill = (req,res) => {
   // const body = req.body
    Cartitem.findOne({user : req.userId})
    .then((cart)=>{
        if(cart){
            const object = {}
            const lineItems = []
            const obj = {}
            obj.products = cart.products
            lineItems.push(obj)
            object.lineItems =  lineItems
                const bill = new Bill(object)
                bill.save()
                .then((data)=>{
                    res.json(data)
                    console.log("sucessfully stored",data);
                })
                .catch((err) => {
                    res.json(err)
                    console.log(err);
                })
        }
        else {
            res.json('Cart not found')
        }
    })
    .catch((err)=>{
        console.log(err);
    })

}
billController.removebill = (req, res) => {
    const user = req.userId
    Bill.findOneAndDelete({user})
    .then((bill) => {
        res.json(bill)
    })
    .catch((err)=>{
        res.json(err)
    })
}

module.exports = billController