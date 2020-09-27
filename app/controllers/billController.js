const Bill = require('../models/bill')
const { Cartitem }= require('../models/Cartitem')
const Address = require('../models/address')
const shortid = require('shortid')
var Razorpay=require("razorpay");
const  billController = {}

const razorpay = new Razorpay({
    key_id: 'rzp_test_6FWcmU32U1iLtf',
    key_secret: 'hMykYDzfmlJKMlJeJGWqJQYH',
});


billController.addbill = (req,res) => {
   // const body = req.body
    Cartitem.findOne({user : req.userId})
    .then((cart)=>{
        if(cart){
            const object = {}
            const lineItems = []
            const obj = {}
            obj.products = cart.products
            lineItems.push(obj)
            object.lineItems =  lineItems
                const bill = new Bill(object)
                bill.save()
                .then((data)=>{
                    if(data){
                        //res.json(data)
                        console.log("sucessfully stored",data);
                        Address.findOne({user : req.userId})
                        .then((address)=>{
                            console.log(address)
                            data.address = address
                            console.log('this is bill along with addrsess',data);
                            res.json(data)
                        })
                        .catch((err)=>{
                            res.send("address not found")
                        })
                    }
                   else {
                       res.send("cannot generate the bill")
                   }
                })
                .catch((err) => {
                    res.json(err)
                })
        }
        else {
            res.send('Cart not found')
        }
    })
    .catch((err)=>{
        console.log(err);
    })

}
billController.removebill = (req, res) => {
    const user = req.userId
    Bill.findOneAndDelete({user})
    .then((bill) => {
        res.json(bill)
    })
    .catch((err)=>{
        res.json(err)
    })
}

billController.order = (req,res) => {
    try {
        const options = {
          amount: 10 * 100, // amount == Rs 10
          currency: "INR",
          receipt: "receipt#1",
          payment_capture: 1,
     // 1 for automatic capture // 0 for manual capture
        };
      instance.orders.create(options, async function (err, order) {
        if (err) {
          return res.status(500).json({
            message: "Something Went Wrong",
          });
        }
      return res.status(200).json(order);
     });
    } catch (err) {
      return res.status(500).json({
        message: "Something Went Wrong",
      });
     }
}

billController.payment = (req,res) => {
  console.log("in payment");
    try {
        return request(
          {
            method: "POST",
            url: `https://rzp_test_6FWcmU32U1iLtf:hMykYDzfmlJKMlJeJGWqJQYH@api.razorpay.com/v1/payments/${req.params.id}/capture`,
            form: {
               amount: 10 * 100, // amount == Rs 10 // Same As Order amount
               currency: "INR",
             },
             auth : {
              'Username' : 'rzp_test_6FWcmU32U1iLtf' ,
              'Password' : 'hMykYDzfmlJKMlJeJGWqJQYH'
             }
           },
       async function (err, response, body) {
         if (err) {
          console.log("in  inner error");
          return res.status(500).json({
             message: "Something Went Wrong",
           }); 
         }
          console.log("Status:", response.statusCode);
          console.log("Headers:", JSON.stringify(response.headers));
          console.log("Response:", body);
          return res.status(200).json(body);
        });
      } catch (err) {
        console.log("in  outer error");
        return res.status(500).json({
          message: "Something Went Wrong",
       });
      }
}



billController.verfication = (req,res) => {
        // do a validation
      const secret = '12345678'

      console.log(req.body)

      const crypto = require('crypto')

      const shasum = crypto.createHmac('sha256', secret)
      shasum.update(JSON.stringify(req.body))
      const digest = shasum.digest('hex')

      console.log(digest, req.headers['x-razorpay-signature'])

      if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        // process it
        require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
      } else {
        // pass it
      }
      res.json({ status: 'ok' })
}

billController.razorpay = async (req ,res) => {
      const payment_capture = 1
      const amount = 499
      const currency = 'INR'

      const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture
      }

      try {
        const response = await razorpay.orders.create(options)
        console.log(response)
        // res.json({
        // 	id: response.id,
        // 	currency: response.currency,
        // 	amount: response.amount
        // })
        console.log("this is response",response);
        res.json(response)
      } catch (error) {
        console.log("error",error)
	}
}



module.exports = billController