const express = require('express')
const router = express.Router()

const { authenticateUser }= require('../app/middleware/authentication')
const { admin_authenticateUser }= require('../app/middleware/admin-authenticateUser')

const usersController = require('../app/controllers/usersController')
const productsController = require('../app/controllers/productsController')
const cartItemsController = require('../app/controllers/cartsItemsController')
const addresssController = require('../app/controllers/addressController')
const categoryController = require('../app/controllers/categoryController')
const billController = require('../app/controllers/billController')

router.post('/api/category' , categoryController.create)
router.get('/api/category' ,categoryController.list)

router.post('/api/users/register', usersController.register)
router.post('/api/users/login', usersController.login)
router.post('/api/users/login/admin',authenticateUser , usersController.admin)

router.get('/api/products',productsController.list)
router.get('/api/products/:id',productsController.show)
router.post('/api/products' , productsController.create)
router.put('/api/products/:id',admin_authenticateUser , productsController.update)
router.delete('/api/products/:id', admin_authenticateUser ,productsController.destroy)
router.get('/api/products/category/:id',productsController.listspecific)

router.get('/api/cartitems',authenticateUser ,cartItemsController.list)
//router.get('/api/cartitems/addcart/:id',authenticateUser ,cartItemsController.addcart) // add product for first time
router.post('/api/cartitems/addcart/:id',authenticateUser ,cartItemsController.addcart)
router.delete('/api/cartitems/removecart/:id',cartItemsController.removecart)
router.post('/api/cartitems/add',authenticateUser,cartItemsController.add)
router.delete('/api/cartitems/remove/:cartid/:productid',cartItemsController.remove)
router.put('/api/cartitems/quantity/inc/:cartid/:productid',cartItemsController.increment)
router.put('/api/cartitems/quantity/dec/:cartid/:productid',cartItemsController.decrement)
router.put('/api/cartitems/quantity/:cartid/:productid',cartItemsController.update)


router.get('/api/account',authenticateUser,usersController.account)
router.put('/api/account/edit', authenticateUser, usersController.update)

//.post('/api/address/add',authenticateUser ,addresssController.add)
router.get('/api/address',authenticateUser ,addresssController.list)
router.get('/api/address/:id',authenticateUser ,addresssController.show)
router.post('/api/address' ,authenticateUser , addresssController.create)
router.put('/api/address/:id',authenticateUser , addresssController.update)
router.delete('/api/address/:id',authenticateUser , addresssController.destroy)

router.get('/api/bill',authenticateUser ,billController.addbill)

module.exports = router