const mongoose = require('mongoose')

configureDB = () =>{
    // db configuration 
    mongoose.connect('mongodb+srv://e-commerce:e-commerce@e-commerce.hlgu8.mongodb.net/e-commerce?retryWrites=true&w=majority', { useFindAndModify: false , useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex : true}) // 'mongodb://localhost:27017/E-commerce'
    .then(()=>{
        console.log('connected to DB');
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = configureDB