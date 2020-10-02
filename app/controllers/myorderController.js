const MyOrder = require('../models/myorder')
const Bill = require('../models/bill')
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
                const cartitem = new MyOrder({user,myorders})
                cartitem.save()
                    .then((cart) => {
                        createbill(cart)
                        res.json(cart)
                    })
                    .catch((err) => {
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
                            res.json(ordersave)
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

createbill = (bill) => {
    console.log("this is billl section")



    const products = bill.myorders.map(e => e.product)
    let abhis = []
    for(let k=0; k< products.length ; k++){
    Product.findById(products[k])
        .then((product)=>{
            abhis.push(product.name)
            })
    }



    let doc = new PDFDocument({ margin: 50 });
          
    generateHeader(doc);
    generateCustomerInformation(doc, bill);
    generateInvoiceTable(doc, bill);
    generateFooter(doc);
   doc.pipe(fs.createWriteStream(`C:/Users/abhis/node/E_Commerce/${customer.name}.pdf`))
   doc.pipe(res)
   doc.end()

   function generateHeader(doc) {
       doc
         .image('logo.jfif', 50, 45, { width: 50 })
         .fillColor("#444444")
         .fontSize(20)
         .text("Billing System Inc.", 110, 57)
         .fontSize(10)
         .text("Billing System Inc.", 200, 50, { align: "right" })
         .text("123 Main Street", 200, 65, { align: "right" })
         .text("Bangalore, Karnataka ,560070", 200, 80, { align: "right" })
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
         .text(`:  ${bill._id}`, 150, customerInformationTop)
         .font("Helvetica")
         .text("Invoice Date:", 50, customerInformationTop + 15)
         .text(`:  ${formatDate(new Date())}`, 150, customerInformationTop + 15)
         .text("Balance Due:", 50, customerInformationTop + 30)
         .text(`:  Rs.${bill.total}/-`,
           150,
           customerInformationTop + 30
         )

         .fontSize(10)
         .text("Name", 300, customerInformationTop)
         .font("Helvetica-Bold")
         .text(`:  ${customer.name}`, 350, customerInformationTop)
         .font("Helvetica")
         .text("Gender:", 300, customerInformationTop + 15)
         .font("Helvetica")
         .text(`:  ${customer.gender}`, 350, customerInformationTop + 15)
         .font("Helvetica")
         .text("Ph:", 300, customerInformationTop + 30)
         .text(`:  ${customer.mobile}` , 350, customerInformationTop + 30)
         .moveDown();
     
       generateHr(doc, 252);
     }

     function generateInvoiceTable(doc, invoice) {
       let i;
       const invoiceTableTop = 330;
     
       doc.font("Helvetica-Bold");
       generateTableRow(
         doc,
         invoiceTableTop,
         "id",
         "Item",
         "Unit Cost",
         "Quantity",
         "Line Total"
       );
       generateHr(doc, invoiceTableTop + 20);
       doc.font("Helvetica");
     
       for (i = 0; i < bill.orderItems.length ; i++) {
         const item = bill.orderItems[i];
         const position = invoiceTableTop + (i + 1) * 30;
         generateTableRow(
           doc,
           position,
           `${i+1}.`,
           abhis[i],
           item.price,
           item.quantity,
           item.quantity * item.price
         )
         generateHr(doc, position + 20);
       }
     
       const subtotalPosition = invoiceTableTop + (i + 1) * 30;
       generateTableRow(
         doc,
         subtotalPosition,
         "",
         "",
         "Subtotal",
         "",
         `Rs.${bill.total}/-`
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
       description,
       unitCost,
       quantity,
       lineTotal
     ) {
       doc
         .fontSize(10)
         .text(item, 50, y)
         .text(description, 150, y)
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

}

module.exports = myorderController