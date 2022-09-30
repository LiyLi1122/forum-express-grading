const express = require('express')
const router = express.Router()
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('passport')

// signin
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // session 關掉在 passport.js 不會繼續走序列化、反序列化，往外走走 userController.signIn

// admin
router.use('/admin', admin)

// normal
router.get('/restaurants', restController.getRestaurants)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
