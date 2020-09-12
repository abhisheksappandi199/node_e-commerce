const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')
const bcryptjs = require('bcryptjs')

const Schema = mongoose.Schema
const userSchema = new Schema({
    username : {
        type : String,
        required : [true , 'username is required'],
        unique : true ,
        minlength : [3 ,'minimum length is 3 character']
    },
    mobile : {
        type : String ,
        required : [true , 'mobile no. is required'],
        unique : true,
        minlength : [10 ,'invalid mobile number'] ,
        maxlength : [10 ,'invalid mobile number']
    },
    email : {
        type : String ,
        required : [true , 'email is required'],
        unique : true ,
        validate : {
            validator : function(value){
                return isEmail(value)
            },
            message : function(){
                return 'invalid email format'
            }
        }
    },
    password : {
        type : String,
        required : [true , 'password needs to be within 8 - 128 characters'],
        minlength : [8 ,'minimum length is 8 character'] ,
        maxlength : [128 ,'maximum length is 128 character']
    },
    role : {
        type : String
    },
    admincode : {
        type : String
    }
})

userSchema.pre('save', function(next){
    const user = this
    bcryptjs.genSalt()
        .then((salt) => {
            bcryptjs.hash(user.password, salt)
                .then((encryptedPassword) => {
                    user.password = encryptedPassword
                    next()
                })
        })
})

const User = mongoose.model('User', userSchema)

module.exports = User