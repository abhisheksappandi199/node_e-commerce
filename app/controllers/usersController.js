const User = require('../models/user')
const usersController = {}
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const welcome =  '../../assets/welcome.png'

usersController.register = (req, res) => {
    const body = req.body 
    const user = new User(body)
    user.save()
        .then((user) => {
            console.log("email =========================================================================>",body.email);
                    //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'abhishekbusiness199@gmail.com',
                pass: 'placement'
            }
            });
            
            var mailOptions = {
            from: 'abhishekbusiness199@gmail.com',
            to: `${body.email}`,
            subject: 'welcome',
            text: `welcome to ilkal sarees`,
            html: `<p><b>Welocome to Ilkal Sarees</b></p><img src='https://firebasestorage.googleapis.com/v0/b/react-upload-bd7bd.appspot.com/o/email%2Fwelcome.jpg?alt=media&token=2f86eb10-8f7d-40e9-8665-f6c2990ca57c'/>`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            })
        //////////////////////////////////// NODEMAILER ////////////////////////////////////////////////////////////////////////////////////////
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
                        //console.log(tokenData);
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