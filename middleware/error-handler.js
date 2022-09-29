module.exports = {
  // page's error handler
  generalErrorHandler (error, req, res, next) {
    if (error instanceof Error) { // 判斷是否為物件，如果是物件會有屬性 name、message //不是物件的話就是我們自訂的內容
      req.flash('error_messages', `${error.name}: ${error.message}`)
    } else { // 不是物件表示可能只是一串字串
      req.flash('error_messages', `${error}`)
    }
    res.redirect('back') // 回上一頁
    next(error) // 將 error 傳給下一個 error handler ??為何? -> 因為 error 傳下去可以針對不同的錯誤進行更細目的判斷，作為伺服器運作錯誤的 log 或其他用途 -> 還是不太懂...
  },
  // api's error handler
  apiErrorHandler: (error, req, res, next) => {
    if (error instanceof Error) {
      res.status(error.status || 500).json({ // 沒有特別設定 status code：500
        status: 'error', // 也可以撰寫成用狀態碼代表錯誤
        message: `${error.name}: ${error.message}` // 加以說明
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${error}`
      })
    }
    next(error)
  }

}
