// restaurantController 物件裡面有 getRestaurants 方法
const { Restaurant, Category, User, Comment } = require('../../models')
const restaurantServices = require('../../services/service-restaurant')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return restaurantServices.getRestaurants(req, (error, data) => error ? next(error) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: [ // Category 併入 Restaurant
        Category,
        { model: Comment, include: User } // 取得關聯資料表 Comment 將 User 併入
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        restaurant.increment('view_count', { by: 1 }) // 這邊要注意，不需要 nest
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      }).catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { include: 'Category', raw: true, nest: true, attributes: ['id', 'name', 'view_count'] }) // 為何??
      .then(restaurant => {
        res.render('dashboard', { restaurant })
      })
      .catch(error => next(error))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ]).then(([restaurants, comments]) => {
      res.render('feeds', {
        restaurants,
        comments
      })
    }).catch(error => next(error))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{
        model: User, as: 'FavoritedUsers'
      }]
    })
      .then(restaurants => {
        const result = restaurants.map(rest => ({
          ...rest.toJSON(),
          description: rest.dataValues.description.substring(0, 50),
          favoritedCount: rest.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(r => r.id === rest.id) // some 有一個符合就是 true
        })).sort((a, b) => b.favoritedCount - a.favoritedCount)
        res.render('top-restaurants', { restaurants: result.slice(0, 10) })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController // 匯出才能在其他檔案中使用
