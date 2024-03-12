const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { knex, db } = require('../db')
const { jwtSecret, menu } = require('../config.js')
const util = require('../util')
const User = require('../models/UserAccount')

async function getUserRoles(userId) {
  let sql = knex('UserRole')
    .join('Role', 'Role.id', 'UserRole.role_id')
    .where('UserRole.user_id', userId)
    .select('Role.name as "name"')
    .toString()
  return (await db.query(sql, { type: 'SELECT' })).map(e => e.name)
}

function getMenu(roles) {
  return menu.filter(e => e.show && (!e.roles || e.roles.split(',').some(role => roles.includes(role)))).map((e) => ({
    title: e.title,
    path: e.path
  }))
}

exports.user = (req, res) => {
  res.send({
    name: req.user.name,
    menu: getMenu(req.user.roles)
  })
}

exports.login = async (req, res, next) => {
  let user = await User.findOne({ where: { name: req.body.name }})
  if (user && user.active && bcrypt.compareSync(req.body.password, user.password)) {
    let roles = await getUserRoles(user.id)
    let token = jwt.sign({ id: user.id, name: user.name, roles }, jwtSecret, { expiresIn: '1d' })
    return res.send({
      token,
      user: {
        name: user.name,
        menu: getMenu(roles)
      }
    })
  }
  let message = (user && !user.active ? 'User is disabled' : 'Invalid credentials')
  res.status(400).send({ message })
}

exports.logout = (req, res, next) => {
  res.end()
}

exports.resetPassword = async (req, res, next) => {
  let email = req.body.email
  let user = await User.findOne({ where: { email: email } })
  if (user) {
    var token = [...Array(4)].map(() => Math.random().toString(36).substring(2)).join('').substr(0, 40)
    await User.update({ password_reset_token: token }, { where: { id: user.id } })
    await util.sentMail('reset', email, token)
    res.end()
  }
  else {
    res.sendStatus(404)
  }
}

exports.getChangePassword = async (req, res, next) => {
  let user = await User.findOne({ where: { password_reset_token: req.params.token } })
  if (user) {
    res.end()
  }
  else {
    res.sendStatus(404)
  }
}

exports.changePassword = async (req, res, next) => {
  let user = await User.findOne({ where: { password_reset_token: req.params.token } })
  if (user) {
    let data = {
      password: bcrypt.hashSync(req.body.password, 10),
      password_reset_token: null
    }
    await User.update(data, { where: { id: user.id } })
    res.end()
  }
  else {
    res.sendStatus(404)
  }
}