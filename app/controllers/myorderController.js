const MyOrder = require('../models/myorder')
const Bill = require('../models/bill')
const User = require('../models/user')
let fs = require('fs')
const PDFDocument = require('pdfkit')
const nodemailer = require('nodemailer')
const myorderController = {}


myorderController.All = (req, res) => {
    MyOrder.find()
        .then((myorder) => {
            res.json(myorder)
        })
        .catch((err) => {
            res.json(err)
        })
}

myorderController.list = (req, res) => {
    MyOrder.find({user : req.userId})
        .then((myorder) => {
            res.json(myorder)
        })
        .catch((err) => {
            res.json(err)
        })
}

// admin-rights
myorderController.create = (req, res) => {
  // get uuser details 
    let customerDetails
    User.findById(req.userId)
    .then((data)=>{
      customerDetails = data
    })
    .catch(err =>{
      console.log(err);
    })
    
    const id = req.params.id
    const ids = req.body
    //let bill
    console.log(id)
    Bill.findById(id)
    .then((bill) => {
        bill.ids = ids
        const user = req.userId
        MyOrder.find({user : req.userId})
        .then((data)=>{
            if(data.length === 0){
                let myorders = [] 
                myorders.push(bill)
                //console.log("this is the bill im working on PDF",{ 'myorders' : myorders});
                const cartitem = new MyOrder({user,myorders})
                cartitem.save()
                    .then((cart) => {
                      console.log("this is the bill im working on PDF",cart);
                      //createbill(cart)
                      //res.json('sucess')
                      //////////////////////////////////

                      let bill = cart
                      let doc = new PDFDocument({ margin: 50 });
          
                      generateHeader(doc);
                      generateCustomerInformation(doc, bill);
                      generateInvoiceTable(doc, bill);
                      generateFooter(doc);
                     doc.pipe(fs.createWriteStream(`C:/Users/abhis/node/E_Commerce/bills/${req.params.id}.pdf`))
                     //doc.pipe(res)
                     doc.end()

                      MyOrder.find({user : req.userId})
                      .then((myorders) => {
                          res.json(myorders)
                      })
                      .catch((err) => {
                          res.json(err)
                      })
                  
                     function generateHeader(doc) {
                         doc
                           //.image('logo.jfif', 50, 45, { width: 50 })
                           .fillColor("#444444")
                           .fontSize(20)
                           .text("Ilkal Sarees Inc.", 110, 57)
                           .fontSize(10)
                           .text("Ilkal Sarees Inc.", 200, 50, { align: "right" })
                           .text("salpeth ward no.2", 200, 65, { align: "right" })
                           .text("ilkal, Karnataka ,587125", 200, 80, { align: "right" })
                           .moveDown();
                       }
                       
                       function generateCustomerInformation(doc, invoice) {
                         doc
                           .fillColor("#444444")
                           .fontSize(20)
                           .text("Invoice", 50, 160);
                       
                         generateHr(doc, 185);
                       
                         const customerInformationTop = 200;
                       
                         doc
                           .fontSize(10)
                           .text("Invoice Number:", 50, customerInformationTop)
                           .font("Helvetica-Bold")
                           .text(`:  ${ bill.myorders[0]._id}`, 150, customerInformationTop)
                           .font("Helvetica")
                           .text("Invoice Date:", 50, customerInformationTop + 15)
                           .text(`:  ${formatDate(new Date())}`, 150, customerInformationTop + 15)
                           .text("Paid amount:", 50, customerInformationTop + 30)
                           .text(`:  Rs.${bill.myorders[0].total}/-`,
                             150,
                             customerInformationTop + 30
                           )
                  
                           .fontSize(10)
                           .text("Name", 320, customerInformationTop)
                           .font("Helvetica-Bold")
                           .text(`:  ${customerDetails.username}`, 370, customerInformationTop)
                           .font("Helvetica")
                           .text("Gender", 320, customerInformationTop + 15)
                           .font("Helvetica")
                           .text(`:  ${customerDetails.email}`, 370, customerInformationTop + 15)
                           .font("Helvetica")
                           .text("Ph", 320, customerInformationTop + 30)
                           .text(`:  ${customerDetails.mobile}` , 370, customerInformationTop + 30)
                           .moveDown();
                       
                         generateHr(doc, 252);
                       }
                  
                       function generateInvoiceTable(doc, invoice) {
                         let j;
                         const invoiceTableTop = 330;
                       
                         doc.font("Helvetica-Bold");
                         generateTableRow(
                           doc,
                           invoiceTableTop,
                           "SL",
                           "id",
                           "Item",
                           "Unit Cost",
                           "Quantity",
                           "Line Total"
                         );
                         generateHr(doc, invoiceTableTop + 20);
                         doc.font("Helvetica");
                       
                         for (i = 0; i < bill.myorders.length ; i++) {
                          
                           for (j = 0; j < bill.myorders[i].lineItems[0].products.length ; j++){
                  
                               const item = bill.myorders[i].lineItems[0].products[j]
                               const position = invoiceTableTop + (j + 1) * 30;
                               generateTableRow(
                                 doc,
                                 position,
                                 `${j+1}.`,
                                  item._id,
                                 item.productname,
                                 item.price,
                                 item.quantity,
                                 item.subtotal
                               )
                             //  generateHr(doc, position + 20 + j++); 
                                  
                           }
                         }
                         const subtotalPosition = invoiceTableTop + (j + 1) * 30;
                         generateTableRow(
                           doc,
                           subtotalPosition,
                           "",
                           "",
                           "",
                           "",
                           "Subtotal :",
                           `Rs.${bill.myorders[0].total}/-`
                         )
                       }
                       
                       function generateFooter(doc) {
                         doc
                           .fontSize(12)
                           .text(
                             "Payment is has to be done within 15 days. Thank you for your business.",
                             50,
                             700,
                             { align: "center", width: 500 }
                           );
                       }
                  
                       function generateTableRow(
                         doc,
                         y,
                         item,
                         _id ,
                         description,
                         unitCost,
                         quantity,
                         lineTotal
                       ) {
                         doc
                           .fontSize(10)
                           .text(item, 30, y)
                           .text(_id ,50 ,y)
                           .text(description, 200, y)
                           .text(unitCost, 280, y, { width: 90, align: "right" })
                           .text(quantity, 370, y, { width: 90, align: "right" })
                           .text(lineTotal, 0, y, { align: "right" });
                       }
                       function generateHr(doc, y) {
                         doc
                           .strokeColor("#aaaaaa")
                           .lineWidth(1)
                           .moveTo(50, y)
                           .lineTo(550, y)
                           .stroke();
                       }
                       function formatDate(date) { 
                         const day = date.getDate();
                         const month = date.getMonth() + 1;
                         const year = date.getFullYear();
                       
                         return day + "-" + month + "-" + year;
                       }


        //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'abhishekbusiness199@gmail.com',
              pass: 'placement'
          }
          });
          
          var mailOptions = {
          from: 'abhishekbusiness199@gmail.com',
          to: ` ${customerDetails.email}`,
          subject: 'e-Bill',
          text: `ths bill of your order is /-`,
          attachments: [
            {
                filename: `${req.params.id}.pdf`,    
                path:`C:/Users/abhis/node/E_Commerce/bills/${req.params.id}.pdf`,                                     
                contentType: 'application/pdf'
            }]
          };
          
          transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
          })
      //////////////////////////////////// NODEMAILER ////////////////////////////////////////////////////////////////////////////////////////
              })
              .catch((err) => {
                console.log("this is a err");
                  res.json(err)
              })
            }
            else{
                MyOrder.findOne({user : req.userId})
                .then((order)=>{
                    if(order){
                        //console.log(order);
                        MyOrder.findByIdAndUpdate({_id : order._id},{ $push : {myorders: bill} } , {upsert: true ,new : true})
                        .then((ordersave)=>{
                          console.log("this is the second bill im working on PDF",ordersave);
                          console.log("this is the second bill order==========================> ",order);
                          //let bill = ordersave
                          console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",bill);
                          let array = []
                          array.push(bill)
                          let obj = {}
                          obj.myorders = array
                          let bills = obj
                          console.log("billllllllllllllllllllllllllllllllllllllll",bills);
                          //createbill(cart)
                            //res.json(ordersave)
                            //////////////////////////////


                            // let doc = new PDFDocument({ margin: 50 });
                            
                            // // Embed a font, set the font size, and render some text
                            // doc.text('Some text with an embedded font!', 100, 100);
                            // doc.pipe( fs.createWriteStream('out.pdf') );
                            // doc.pipe(res)
                            // doc.end();
                            let doc = new PDFDocument({ margin: 50 });
          
                            generateHeader(doc);
                            generateCustomerInformation(doc, bills);
                            generateInvoiceTable(doc, bills);
                            generateFooter(doc);
                           doc.pipe(fs.createWriteStream(`C:/Users/abhis/node/E_Commerce/bills/${req.params.id}.pdf`))
                           //doc.pipe(res)
                           doc.end()

                            MyOrder.find({user : req.userId})
                            .then((myorders) => {
                                res.json(myorders)
                            })
                            .catch((err) => {
                                res.json(err)
                            })
                        
                           function generateHeader(doc) {
                               doc
                                 //.image('logo.jfif', 50, 45, { width: 50 })
                                 .fillColor("#444444")
                                 .fontSize(20)
                                 .text("Ilkal Sarees Inc.", 110, 57)
                                 .fontSize(10)
                                 .text("Ilkal Sarees Inc.", 200, 50, { align: "right" })
                                 .text("salpeth ward no.2", 200, 65, { align: "right" })
                                 .text("ilkal, Karnataka ,587125", 200, 80, { align: "right" })
                                 .moveDown();
                             }
                             
                             function generateCustomerInformation(doc, invoice) {
                               doc
                                 .fillColor("#444444")
                                 .fontSize(20)
                                 .text("Invoice", 50, 160);
                             
                               generateHr(doc, 185);
                             
                               const customerInformationTop = 200;
                             
                               doc
                                 .fontSize(10)
                                 .text("Invoice Number:", 50, customerInformationTop)
                                 .font("Helvetica-Bold")
                                 .text(`:  ${ req.params.id}`, 150, customerInformationTop)
                                 .font("Helvetica")
                                 .text("Invoice Date:", 50, customerInformationTop + 15)
                                 .text(`:  ${formatDate(new Date())}`, 150, customerInformationTop + 15)
                                 .text("Paid amount:", 50, customerInformationTop + 30)
                                 .text(`:  Rs.${bills.myorders[0].total}/-`,
                                   150,
                                   customerInformationTop + 30
                                 )
                        
                                 .fontSize(10)
                                 .text("Name", 320, customerInformationTop)
                                 .font("Helvetica-Bold")
                                 .text(`:  ${customerDetails.username}`, 370, customerInformationTop)
                                 .font("Helvetica")
                                 .text("Gender", 320, customerInformationTop + 15)
                                 .font("Helvetica")
                                 .text(`:  ${customerDetails.email}`, 370, customerInformationTop + 15)
                                 .font("Helvetica")
                                 .text("Ph", 320, customerInformationTop + 30)
                                 .text(`:  ${customerDetails.mobile}` , 370, customerInformationTop + 30)
                                 .moveDown();
                             
                               generateHr(doc, 252);
                             }
                        
                             function generateInvoiceTable(doc, invoice) {
                               let j;
                               const invoiceTableTop = 330;
                             
                               doc.font("Helvetica-Bold");
                               generateTableRow(
                                 doc,
                                 invoiceTableTop,
                                 "SL",
                                 "id",
                                 "Item",
                                 "Unit Cost",
                                 "Quantity",
                                 "Line Total"
                               );
                               generateHr(doc, invoiceTableTop + 20);
                               doc.font("Helvetica");
                             
                               for (i = 0; i < bills.myorders.length ; i++) {
                                
                                 for (j = 0; j < bills.myorders[i].lineItems[0].products.length ; j++){
                        
                                     const item = bills.myorders[i].lineItems[0].products[j]
                                     const position = invoiceTableTop + (j + 1) * 30;
                                     generateTableRow(
                                       doc,
                                       position,
                                       `${j+1}.`,
                                        item._id,
                                       item.productname,
                                       item.price,
                                       item.quantity,
                                       item.subtotal
                                     )
                                   //  generateHr(doc, position + 20 + j++); 
                                        
                                 }
                               }
                               const subtotalPosition = invoiceTableTop + (j + 1) * 30;
                               generateTableRow(
                                 doc,
                                 subtotalPosition,
                                 "",
                                 "",
                                 "",
                                 "",
                                 "Subtotal :",
                                 `Rs.${bills.myorders[0].total}/-`
                               )
                             }
                             
                             function generateFooter(doc) {
                               doc
                                 .fontSize(12)
                                 .text(
                                   "Payment is has to be done within 15 days. Thank you for your business.",
                                   50,
                                   700,
                                   { align: "center", width: 500 }
                                 );
                             }
                        
                             function generateTableRow(
                               doc,
                               y,
                               item,
                               _id ,
                               description,
                               unitCost,
                               quantity,
                               lineTotal
                             ) {
                               doc
                                 .fontSize(10)
                                 .text(item, 30, y)
                                 .text(_id ,50 ,y)
                                 .text(description, 200, y)
                                 .text(unitCost, 280, y, { width: 90, align: "right" })
                                 .text(quantity, 370, y, { width: 90, align: "right" })
                                 .text(lineTotal, 0, y, { align: "right" });
                             }
                             function generateHr(doc, y) {
                               doc
                                 .strokeColor("#aaaaaa")
                                 .lineWidth(1)
                                 .moveTo(50, y)
                                 .lineTo(550, y)
                                 .stroke();
                             }
                             function formatDate(date) { 
                               const day = date.getDate();
                               const month = date.getMonth() + 1;
                               const year = date.getFullYear();
                             
                               return day + "-" + month + "-" + year;
                             }
                          //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
                          var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'abhishekbusiness199@gmail.com',
                                pass: 'placement'
                            }
                            });
                            
                            var mailOptions = {
                            from: 'abhishekbusiness199@gmail.com',
                            to: ` ${customerDetails.email}`,
                            subject: 'e-Bill',
                            text: `ths bill of your order is /-`,
                            attachments: [
                              {
                                  filename: `${req.params.id}.pdf`,    
                                  path:`C:/Users/abhis/node/E_Commerce/bills/${req.params.id}.pdf`,                                     
                                  contentType: 'application/pdf'
                              }]
                            };
                            
                            transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                            })
                        //////////////////////////////////// NODEMAILER ////////////////////////////////////////////////////////////////////////////////////////
                            //////////////////////////
                        })
                        .catch((err)=>{
                            res.json(err)
                        })
                    }
                    else{
                        res.send("myorder is not found")
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
    })
    .catch((err)=>{
        res.send('bill not found')
    })
}

function createbill(bill){
    console.log("this is billl section",bill)

return true
}

module.exports = myorderController