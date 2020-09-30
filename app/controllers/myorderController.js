const MyOrder = require('../models/myorder')
const Bill = require('../models/bill')
const myorderController = {}

myorderController.list = (req, res) => {
    Product.find()
        .then((myorder) => {
            res.json(myorder)
        })
        .catch((err) => {
            res.json(err)
        })
}

// admin-rights
myorderController.create = (req, res) => {
    const id = req.params.id
    const ids = req.body
    //let bill
    console.log(id)
    Bill.findById(id)
    .then((bill) => {
        bill.ids = ids
        const user = req.userId
        MyOrder.find({user : req.userId})
        .then((data)=>{
            if(data.length === 0){
                let myorders = [] 
                myorders.push(bill)
                const cartitem = new MyOrder({user,myorders})
                cartitem.save()
                    .then((cart) => {
                        res.json(cart)
                    })
                    .catch((err) => {
                        res.json(err)
                    })
            }
            else{
                MyOrder.findOne({user : req.userId})
                .then((order)=>{
                    if(order){
                        //console.log(order);
                        MyOrder.findByIdAndUpdate({_id : order._id},{ $push : {myorders: bill} } , {upsert: true ,new : true})
                        .then((ordersave)=>{
                            res.json(ordersave)
                        })
                        .catch((err)=>{
                            res.json(err)
                        })
                    }
                    else{
                        res.send("myorder is not found")
                    }
                })
                .catch((err)=>{
                    res.json(err)
                })
            }
        })
        .catch((err)=>{
            res.json(err)
        })
    })
    .catch((err)=>{
        res.send('bill not found')
    })


}

module.exports = myorderController