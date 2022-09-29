const { Restaurant, User, Category } = require('../models') // === require('../models/index')
// const { imgurFileHandler } = require('../helpers/file-helpers')
// const { localFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getRestaurants: (req, callback) => {
    return Restaurant.findAll({ // [{}, {}]
      raw: true, // 轉成單純 JS 物件，不轉也可以但要在.dataValues 取值
      nest: true, // 變成巢狀( key-value )
      include: [Category] // Category 資料表併入
    })
      .then(restaurants => {
        return callback(null, { restaurants }) // 去 res.render(...) // 這邊要注意 { }
      })
      .catch(error => callback(error)) // 去 next(error)
  },
  deleteRestaurant: (req, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        console.log('\nrestaurant\n', restaurant)
        console.log('\nreq.params.id\n', req.params.id)
        if (!restaurant) {
          const error = new Error("Restaurant isn't exist!") // new Error -> obj
          error.status = 404 // error object 新增 status property
          throw error // to .catch() //catch to middleware
        }

        return restaurant.destroy()
      })
      .then(deletedRestaurant => {
        return callback(null, { restaurant: deletedRestaurant }) // restaurant: deletedRestaurant 後續雖然不會用到，但還是拋出去，讓前端決定要不要使用這資料(例如前端可能會需要做一個彈跳視窗...) // res.json() 成功就給狀態以及資料、res.redirect 承接
      })
      .catch(error => callback(error))
  }
}
module.exports = adminServices
