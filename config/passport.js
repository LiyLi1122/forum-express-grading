// 登入用(session、JWT)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// JWT 驗證用
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// localStrategy(session、JWT)
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } }) // user -> 因為是 findOne 所以 {}
      .then(user => {
        console.log('y')
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤!'))

        bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤!'))
            return done(null, user) // 這邊表示登入的驗證成功
          })
      })
  }))

// JWT Strategy token
// options is an object literal containing options to control how the token is extracted(提取) from the request or verified.(因這邊的設定可以在後續順利解客戶端 token )
// 驗證 token + 解開 token 到資料庫找出 user to request，因為 session 設定為 false 所以不會走序列化那邊，所以要在這邊撈使用者，最後產出 req.user
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // 設定去 request 的哪裡找過來的 token
  secretOrKey: process.env.JWT_SECRET // 從.env 提領 key 為了跟客戶端過來的 request token 裡的 key 做比較，以確保沒有被串改。
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => { // 解開客戶端 token，利用裡面的資訊 (payload - 在 signin 的時候頒發token 中放入的，由 jwtPayload {} 承接 payload) 查找 user
  User.findByPk(jwtPayload.id, { // jwtPayload.id -> id 的原因是因為在 payload 的長相就是這樣，沒有什麼特別的原因
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user)) // req {} 新增 user
    .catch(error => cb(error)) // to error handler
}))

// 當在 passport.authenticate() 的 {session 等於 true} 時才會執行下面
// 序列化 使用者 必要
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

// 反序列化 使用者 必要 (得 req.user)
passport.deserializeUser((id, done) => {
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }, // 根據 FavoriteRestaurants 關係到 Restaurant model 得到 user 收藏列表(登入時 req.user 就會自帶有關收藏的相關資料)
      { model: Restaurant, as: 'LikedRestaurants' }, // 跟 Restaurant 有一個關聯叫做 LikedRestaurants，將其引入
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }) // sequelize 物件
    .then(user => done(null, user.toJSON())
    )
})

module.exports = passport
