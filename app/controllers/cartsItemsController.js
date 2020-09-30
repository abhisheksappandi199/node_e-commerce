const { Cartitem } = require('../models/Cartitem')
const Product = require('../models/product')
const  cartItemsController = {}

cartItemsController.list = (req,res) => {
    // const id = req.params.id
    // console.log(id);
    console.log(req.userId);
        Cartitem.findOne({user : req.userId})
        .then((cart)=>{
            console.log(cart);
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
        if(item){
            res.json(item)
        }
    })
    .catch((err)=>{
        res.json(err)
    })
}

cartItemsController.add =  (req,res) =>{  // async
    const user = req.userId
    console.log("user-id ==========================================> ",req.userId)
    Cartitem.find({user : req.userId})
    .then((cart)=>{
        console.log("cart =============> ",cart);
        if(cart.length === 0){
            console.log('first time add to cart');
            let products = [] 
            products.push({"product" : req.body.product})
           // Cartitem.findOneAndUpdate({user : user},{$push : {product : product}})
            const cartitem = new Cartitem({user,products})
            cartitem.save()
                .then((cart) => {
                    res.json(cart)
                })
                .catch((err) => {
                    res.status(400).json(err)
                    console.log(err)
                    //res.sendStatus(400)
                    //res.json(err)
                })
        }
        else {
            console.log("this is else part of the code");
            let obj= {} , total = 0
            console.log("this is cart ==========================>",JSON.stringify(cart[0].products));
            console.log(req.userId);
            obj.product = req.body.product
                Product.findById(obj.product)
                .then( (product)=>{   //async
                    console.log("this is product=========================",product);
                    if(product){
                        obj.price = product.price
                        obj.productname = product.name
                        //obj.subtotal = parseInt(obj.quantity) * parseInt(product.price) // product.price //
                        //total += String(obj.quantity) * String(product.price) 
                        obj.image = product.image[0]
                        console.log("this is object beign sent to findoneand update ============>",obj);
                        // const part = await Cartitem.findOne({user : req.userId})
                        //console.log(part)    // {_id : part._id}
                        Cartitem.findOne({user : req.userId})
                        .then((cart)=>{
                            if(!cart.products.find(repeated => repeated.product == obj.product)){
                               
                                if(cart)
                                Cartitem.findByIdAndUpdate({_id : cart._id},{ $push : {products: obj}} , {upsert: true ,new : true})
                                .then((data)=>{
                                    console.log("data after ",data);
                                    const newdata = data.total
                                    res.json(data)
                                })
                                .catch((err)=>{
                                    console.log("error on catch",err);
                                    res.sendStatus(400)
                                })
                            }
                            else {
                                res.json('product already added')
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
        }
    })
    .catch((error)=>{
        res.status(400)
        console.log(error);
    })
}

cartItemsController.remove = (req,res) =>{
    console.log(req.params);
    Cartitem.findByIdAndDelete({_id : req.params.cartid },{ $pull : { products : { _id : req.params.productid } }} )
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
cartItemsController.update = (req,res) =>{
    const cartid = req.params.cartid
    const productid = req.params.productid
    const type = req.query.type
    
 //   CounterUpdate(_id, type)
 Cartitem.updateByType(cartid,productid, type)
     .then((counter) => {
         const check = counter.products.find(e => e.quantity < 1)
         if(counter.products.length == 1 && check){
             Cartitem.findByIdAndDelete(counter._id)
             .then((cart)=>{
                 res.json({})
             })
             .catch((err)=>{
                 res.json(err)
             })
         }
         else if(check){
            console.log(check);
            Cartitem.findOneAndUpdate({_id : cartid },{ $pull : { products : { _id : check._id } }}, { new : true})
            .then((filtered)=>{
                //console.log(filtered);
                res.json(filtered)
            })
            .catch(err =>{
                res.json(err)
            })
         } else {
            res.json(counter)
         }
     })
     .catch((err) => {
        res.json(err)
     })
}
module.exports = cartItemsController


// if(filtered.products.length == 0){
//     Cartitem.findByIdAndDelete(filtered._id)
//     .then((item)=> {
//         res.json(item)
//     })
//     .catch((err)=>{
//         res.json(err)
//     })
// } else {