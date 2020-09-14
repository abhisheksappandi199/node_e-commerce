const User = require('../models/user')
const usersController = {}
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

usersController.register = (req, res) => {
    const body = req.body 
    const user = new User(body)
    user.save()
        .then((user) => {
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
}

usersController.login = (req, res) => {
    const body = req.body 
    // check if email is present 
    User.findOne({ email: body.email })
        .then((user) => {
            if(user) {
                bcryptjs.compare(body.password, user.password)
                    .then((result) => {
                        if(result) {
                            const tokenData = {
                                id: user._id
                            }
                            const token = jwt.sign(tokenData, 'dct@123', { expiresIn: '2d'})
                            res.json({
                                token: token
                            })
                        } else {
                            res.json({ errors: 'invalid email / password' })
                        }
                    })
            } else {
                res.json({ errors: 'invalid email / password'})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

usersController.admin = (req,res) => {
    const body  = req.body
    if(body.admincode){
        User.findOne({ email: body.email })
        .then((user)=>{
            if(user && user.admincode === body.admincode){
                bcryptjs.compare(body.password, user.password)
                .then((result) => {
                    if(result) {
                        const tokenData = {
                            id: user._id,
                            admincode : user.admincode
                        }
                        console.log(tokenData);
                        const token = jwt.sign(tokenData, 'dct@123', { expiresIn: '2d'})
                        res.json({
                            token: token
                        })
                    } else {
                        res.json({ errors: 'invalid email / password' })
                    }
                })
            } else {
                res.json({ errors: 'invalid email / password / admincode'})
            }
        })
    } else {
        res.json('Admin code is required')
    }

}

usersController.account = (req, res) => {   
    User.findById(req.userId)
        .then((user) => {
            const userDetails = Object.assign({},user._doc)
            delete userDetails.password 
            delete userDetails.role
            res.json(userDetails)
        })
        .catch((err) => {
            res.json(err)
        })
}
usersController.update = (req, res) => {
    const id = req.userId
    const body = req.body
        User.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .then((user) => {
            if (user) {
                const userDetails = Object.assign({},user._doc)
                delete userDetails.password 
                delete userDetails.role
                res.json(userDetails)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = usersController