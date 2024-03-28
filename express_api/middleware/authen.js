const jwt = require('jsonwebtoken')
const jwtSecret = require('../config').jwtSecret

let allows = [ '/api/login', '/api/logout', '/api/resetPassword', '/api/changePassword', '/api/stack' ]

module.exports = (req, res, next) => {
  if (allows.includes(req.originalUrl) || req.originalUrl.startsWith(allows[3])) {
    next()
  }
  else {
    let header = req.headers['authorization']
    if (!header || !header.startsWith('Bearer ')) {
      return res.sendStatus(401)
    }
    else {
      let token = header.substr(7)
      jwt.verify(token, jwtSecret, (error, user) => {
        if (error) {
          return res.sendStatus(401)
        }
        req.user = user
        next()
      })
    }
  }
}