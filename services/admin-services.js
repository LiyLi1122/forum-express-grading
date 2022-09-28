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
  }
}
module.exports = adminServices
