const express = require('express')
const router = express.Router()
const restController = require('../../controllers/apis/restaurant-controller')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../../middleware/error-handler')

// admin
router.use('/admin', admin)

// normal
router.get('/restaurants', restController.getRestaurants)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
