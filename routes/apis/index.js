const express = require('express')
const router = express.Router()
const restController = require('../../controllers/apis/restaurant-controller')
// const { authenticated } = require('../../middleware/auth')

router.get('/restaurants', restController.getRestaurants)

module.exports = router
