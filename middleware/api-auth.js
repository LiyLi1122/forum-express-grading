// 驗證 token
// => 成功得 req.user -> 判斷是否為 admin
// => 失敗( 驗證錯誤、不是一般使用者、也不是 admin ) -> 給錯誤碼

const passport = require('../config/passport') // 設定好的套件檔案載入

// 這邊 trigger passport.use(new JWTStrategy) 去解析 token 一連串處理，這邊得到 req.user
const authenticated = passport.authenticate('jwt', { session: false })

// 這邊對 req.user 做進一步判斷是不是 admin 身份
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()

  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
