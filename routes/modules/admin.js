const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')// 將預計檔案存放位置相關設定載進來

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/restaurants/:id/edit', adminController.editRestaurant)

router.patch('/restaurants/:id', upload.single('image'), adminController.patchRestaurant)

router.get('/restaurants/create', adminController.createRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
