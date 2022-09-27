const { Restaurant, Category } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 按其他類別 || 沒有按給預設（全部）// url 是文字
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 這邊預留未來可能讓使用者決定要顯示的筆數
    const offset = getOffset(limit, page) // 忽略筆數

    return Promise.all([
      Restaurant.findAndCountAll({ // [{}, {}...]
        include: 'Category',
        where: {
          ...(categoryId ? { categoryId } : {})
        }, // categoryId 有值 { categoryId } + ... -> categoryId，沒有值就忽略不查詢
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true }) // 這邊就不用 nest
    ])
      .then(([restaurants, categories]) => { // 做縮字整理至 50 字
        const favoriteRestaurantsIdList = req.user?.FavoritedRestaurants?.map(fr => fr.id) || [] // req.user 沒有的原因是因為：沒有登入
        const likedRestaurantsIdList = req.user?.LikedRestaurants?.map?.(like => like.id) || []
        const data = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.substring(0, 50), // 沒有寫 restaurant 會出 description 還沒定義的錯誤
            isFavorited: favoriteRestaurantsIdList.includes(restaurant.id),
            isLiked: likedRestaurantsIdList.includes(restaurant.id)
            // {} 裡新增 isFavorited key
            // === map( => ({...回傳到陣列的值}))
            // [].includes(...) 振列裡面包含撈出來的餐廳 id 就給 T 否則 F 到 restaurants.hbs
          }
        })
        res.json({
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // restaurants.count === 資料總筆數
        })
      }).catch(error => next(error))
  }
}
module.exports = restaurantController
