const express = require('express')
require('dotenv').config({path : './keys.env'})
const configureDB = require('./config/database')
const routes = require('./config/routes')
const cors = require('cors')
const fs = require('fs')
const morgan = require('morgan')

const app = express()
const port = 3333

configureDB()
app.use(express.json())
app.use(cors())

////////////////////////  MORGON - to print logs ////////////////////////////////////////
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log',{flags: 'a'});
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
/////////////////////////////////////////////////////////////////////////////////////////

app.get('/',(req,res)=>{
    res.send('the server is up')
})


app.use(routes)
app.listen(port ,() =>{
    console.log('server is running on the port',port);
})