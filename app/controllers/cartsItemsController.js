const Cartitem = require('../models/Cartitem')
const Product = require('../models/product')
const  cartItemsController = {}

cartItemsController.list = (req,res) => {
    const id = req.params.id
    Cartitem.findById(id)
    .then((cart)=>{
        res.json(cart)
    })
    .catch((err)=>{
        res.json(err)
    })
}
cartItemsController.addcart = (req, res) => {
    const user = req.userId
    let products = [] 
    products.push({"product" : req.params.id})
   // Cartitem.findOneAndUpdate({user : user},{$push : {product : product}})
    const cartitem = new Cartitem({user,products})
    cartitem.save()
        .then((cart) => {
            res.json(cart)
        })
        .catch((err) => {
            res.json(err)
        })
}

cartItemsController.removecart = (req,res) =>{
    const id = req.params.id
    Cartitem.findByIdAndDelete(id)
    .then((item)=> {
        res.json(item)
    })
    .catch((err)=>{
        res.json(err)
    })
}

cartItemsController.add = (req,res) =>{
    let obj = {}
    obj.product = req.body.product
    req.body.quantity && ( obj.quantity = req.body.quantity)
    req.body.quantity && (
        Product.findById(obj.product)
        .then((product)=>{
            obj.price = product.price
            obj.subtotal = obj.quantity * product.price
            obj.image = product.image[0]
            Cartitem.findByIdAndUpdate({_id : req.params.id},{ $push : {products: obj}} , {safe: true, upsert: true})
            .then((data)=>{
                res.json(data)
            })
            .catch((err)=>{
                res.json(err)
            })
        })
        .catch((err)=>{
            res.json(err)
        })
    )
}

cartItemsController.remove = (req,res) =>{
    console.log(req.params);
    Cartitem.updateOne({_id : req.params.cartid },{ $pull : { products : { _id : req.params.productid } }} )
    .then((cart)=>{
        res.json(cart)
    })
    .catch((err)=>{
        res.json(err)
    })
}

cartItemsController.increment = (req,res) => {
    Cartitem.updateOne({_id : req.params.cartid , 'products._id': req.params.productid } , { $inc : {"products.$.quantity" : 1}})
    .then((data)=>{
        res.json(data)
    })
    .catch((err)=>{
        res.json(err)
    })
}
cartItemsController.decrement = (req,res) => {
    Cartitem.updateOne({_id : req.params.cartid , 'products._id': req.params.productid } , { $inc : {"products.$.quantity" : -1}})
    .then((decrement_data)=>{
        
        Cartitem.findById(req.params.cartid)
        .then((cart)=>{
            let removeditem = cart.products.find(e => e.quantity < 1)
            console.log(removeditem);
            if(decrement_data.n === 1 && removeditem == undefined){
                res.json(decrement_data)
            }           
            else if(removeditem._id){
                Cartitem.updateOne({_id : req.params.cartid },{ $pull : { products : { _id : removeditem._id } }} )
                .then((updated)=>{
                    //updated["deleted"] = deleted_completely
                    res.json(updated)             
                })
                .catch((err)=>{
                    console.log('3');
                    res.json(err)
                })
            }

        })
        .catch((err)=>{
            console.log('2');
            res.json(err)
        })
        //res.json(data)
    })
    .catch((err)=>{
        console.log('1');
        res.json(err)
    })
}

module.exports = cartItemsController