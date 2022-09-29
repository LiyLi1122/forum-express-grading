const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (error, data) => error ? next(error) : res.json({ status: 'success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (error, data) => error ? next(error) : res.json({ status: 'success', data }))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (error, data) => error ? next(error) : res.json({ status: 'success', data }))// next(error) 直接去 error handler
  }
}
module.exports = adminController
