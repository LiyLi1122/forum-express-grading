const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (error, data) => error ? next(error) : res.json(data))
  }
}

module.exports = adminController
