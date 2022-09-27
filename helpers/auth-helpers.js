const getUser = req => {
  return req.user || null // 驗證成功 || 驗證不成功(檢查從 passport 過來的 req，讓 hbs 可以視情況顯示該顯示的部分)
}

const ensureAuthenticated = req => {
  return req.isAuthenticated() // req.isAuthenticated() -> true 或 false
}

// 之後可以在 { } 放多個要匯出的函式
// 或是 { 函式們 }
// export 什麼 require 就會拿到甚麼 -> { getUser: getUser }
module.exports = { getUser, ensureAuthenticated }
