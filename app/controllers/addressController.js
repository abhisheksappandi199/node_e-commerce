const Address = require('../models/address')
const addressController = {}

addressController.list = (req, res) => {
    console.log("logged",req.userId);
    Address.findOne({user : req.userId})
        .then((addresss) => {
            res.json(addresss)
        })
        .catch((err) => {
            res.json(err)
        })
}
// addressController.add =  (req,res) =>{  // async
//     const user = req.userId
//     console.log("user-id ==========================================> ",req.userId)
//     Address.find({user : req.userId})
//     .then((address)=>{
//         console.log("address =============> ",address);
//         if(address.length === 0){
//             const user = req.userId
//             const body = req.body 
//             body.user = user
//             console.log(body);
//             const address = new Address(body)
//             address.save()
//                 .then((address) => {
//                     res.json(address)
//                 })
//                 .catch((err) => {
//                     res.json(err)
//                 })
//         }
//         else {
//             Address.findOne({user : req.userId})
//             .then((address)=>{
//                 if(address){
//                     Address.findOneAndUpdate({_id:address._id},{$push : req.body },{upsert: true ,new : true})
//                     .then((added)=>{
//                         console.log("added",added);
//                         res.json(added)
//                     })
//                     .catch((err)=>{
//                         res.json(err)
//                     })
//                 }
//                 else {
//                     res.json('error in addind the address')
//                 }
//             })
//             .catch((err)=>{
//                res.json(err)
//             })
//         }
//     })
//     .catch((err)=>{
//         res.json(err)
//     })     
// }
addressController.show = (req, res) => {
    const id = req.params.id
    Address.findById(id)
        .then((address) => {
            if (address) {
                res.json(address)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}
// admin-rights
addressController.create = (req, res) => {
        const user = req.userId
        const body = req.body 
        body.user = user
        console.log(body);
        Address.find({user : req.userId})
        .then((data)=>{
            if(data){
                console.log("this is data in if statement ",data);
                if(data.length == 0){
                    const address = new Address({
                        user , 
                        name:body.name,
                        mobile : body.mobile,
                        alternatemobile:body.alternatemobile,
                        street:body.street,
                        lankmark:body.landmark,
                        city : body.city,
                        states:body.states,
                        pincode :body.pincode,
                        addresstype:body.addresstype                    
                    })
                    address.save()
                        .then((address) => {
                            console.log("this is saved address",address);
                            res.json(address)
                        })
                        .catch((err) => {
                            res.json(err)
                        })
                }
                else {
                    res.json("unable to save the address")
                }
            }
            else {
                res.json("user not found...!")
            }
        })
        .catch((err)=>{
            res.json(err)
        })
}

// admin - rights
addressController.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Address.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((address) => {
            if (address) {
                res.json(address)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

addressController.destroy = (req, res) => {
    const id = req.params.id
    Address.findByIdAndDelete(id)
        .then((address) => {
            if (address) {
                res.json(address)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = addressController