const restaurantServices = require('../../services/service-restaurant')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
    // 為符合 test 檔所以這邊 return
    // 符合條件要執行時需要 err、data
    // err 執行 err、沒有執行 res.json(data)
  }
}
module.exports = restaurantController
