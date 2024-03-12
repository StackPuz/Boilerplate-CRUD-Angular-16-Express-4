const bcrypt = require('bcrypt')
const { knex, db } = require('../db')
const util = require('../util')
const UserAccount = require('../models/UserAccount')

exports.profile = (req, res, next) => {
  let sqlUserAccount = knex('UserAccount')
    .select('UserAccount.name', 'UserAccount.email')
    .where('UserAccount.id', req.user.id)
    .toString()
  db.query(sqlUserAccount, { type: 'SELECT', plain: true }).then(userAccount => {
    res.send({ userAccount })
  }).catch(next)
}

exports.updateProfile = (req, res, next) => {
  let userAccount = util.parseData(UserAccount, { ...req.body })
  if (userAccount.password) {
    userAccount.password = bcrypt.hashSync(userAccount.password, 10)
  }
  else {
    delete userAccount.password
  }
  UserAccount.update(userAccount, { where: { id: req.user.id } }).then(() => {
    res.end()
  }).catch(next)
}

exports.stack = (req, res, next) => {
  res.send('Angular 16 + Express 4 + MySQL')
}