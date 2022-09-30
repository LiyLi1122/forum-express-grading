const jwt = require('jsonwebtoken')
// const { User, Comment, Restaurant, Favorite, Followship, Like } = require('../../models') // function named User
// const bcrypt = require('bcryptjs')
// const { imgurFileHandler } = require('../../helpers/file-helpers')
// const { Op, Sequelize } = require('sequelize')

const userController = {
  // JWT 發證
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password // delete object.property
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      // (payload, key, expiresInt)
      // 會先經過 passport.js
      // 簽證期限 30 days

      res.json({
        status: 'success',
        data: {
          token,
          user: userData // 給予登入資訊，成功登入 req add user
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
