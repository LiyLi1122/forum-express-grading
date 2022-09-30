const express = require('express')
const router = express.Router()
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

// signin
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // session 關掉在 passport.js 不會繼續走序列化、反序列化，最後往後走走到 userController.signIn，去取得簽證

// admin
router.use('/admin', authenticated, authenticatedAdmin, admin) // 得到 req.user 前往 authenticatedAdmin 確認權限

// normal
router.get('/restaurants', authenticated, restController.getRestaurants)

// error handler
router.use('/', apiErrorHandler)

module.exports = router
