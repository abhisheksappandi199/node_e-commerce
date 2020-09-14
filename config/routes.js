const express = require('express')
const router = express.Router()
const { authenticateUser }= require('../app/middleware/authentication')
const { admin_authenticateUser }= require('../app/middleware/admin-authenticateUser')
const usersController = require('../app/controllers/usersController')
const productsController = require('../app/controllers/productsController')
const cartItemsController = require('../app/controllers/cartsItemsController')

router.post('/api/users/register', usersController.register)
router.post('/api/users/login', usersController.login)
router.post('/api/users/login/admin', usersController.admin)

router.get('/api/products',productsController.list)
router.get('/api/products/:id',productsController.show)
router.post('/api/products' , productsController.create)
router.put('/api/products/:id',admin_authenticateUser , productsController.update)
router.delete('/api/products/:id', admin_authenticateUser ,productsController.destroy)

router.get('/api/cartitems/:id',cartItemsController.list)
router.get('/api/cartitems/addcart/:id',authenticateUser ,cartItemsController.addcart) // add product for first time
router.delete('/api/cartitems/removecart/:id',cartItemsController.removecart)
router.post('/api/cartitems/add/:id',cartItemsController.add)
router.delete('/api/cartitems/remove/:cartid/:productid',cartItemsController.remove)
router.put('/api/cartitems/quantity/inc/:cartid/:productid',cartItemsController.increment)
router.put('/api/cartitems/quantity/dec/:cartid/:productid',cartItemsController.increment)

router.get('/api/account',authenticateUser,usersController.account)
router.put('/api/account/edit', authenticateUser, usersController.update)

module.exports = router