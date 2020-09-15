const Address = require('../models/address')
const addressController = {}

addressController.list = (req, res) => {
    Address.find()
        .then((addresss) => {
            res.json(addresss)
        })
        .catch((err) => {
            res.json(err)
        })
}

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
        const body = req.body 
        const address = new Address(body)
        address.save()
            .then((address) => {
                res.json(address)
            })
            .catch((err) => {
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