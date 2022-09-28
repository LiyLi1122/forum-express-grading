// const { authenticated } = require('../../middleware/auth')
const express = require('express')
const router = express.Router()
const restController = require('../../controllers/apis/restaurant-controller')
const adminController = require('../../controllers/apis/admin-controller')

router.get('/restaurants', restController.getRestaurants)
router.get('/admin/restaurants', adminController.getRestaurants)

module.exports = router
