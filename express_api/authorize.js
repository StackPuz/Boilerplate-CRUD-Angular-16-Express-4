module.exports = (roles) => {
  return (req, res, next) => {
    if (roles.split(',').some(e => req.user.roles.includes(e))) {
      next()
    }
    else {
      res.sendStatus(403)
    }
  }
}