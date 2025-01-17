'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' })
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite, // 多對多的關係是建立(透過)於 favorite 表單裡面
        foreignKey: 'restaurantId', // 對 Favorite 表做餐廳的 FK 設定
        as: 'FavoritedUsers' // 餐廳多對多使用者這個關聯取一個名字 //表示 restaurant 跟 user 有一個多對多關係稱為 favoriteUser
      })
      Restaurant.belongsToMany(models.User,
        {
          through: models.Like,
          foreignKey: 'restaurantId',
          as: 'LikedUsers'
        })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
