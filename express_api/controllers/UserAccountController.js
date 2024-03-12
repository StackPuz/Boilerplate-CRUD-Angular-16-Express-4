const bcrypt = require('bcrypt')
const { knex, db } = require('../db')
const util = require('../util')
const UserAccount = require('../models/UserAccount')
const UserRole = require('../models/UserRole')

exports.index = (req, res, next) => {
  let page = req.query.page || 1
  let size = req.query.size || 10
  let sort = req.query.sort || 'UserAccount.id'
  let sortDirection = req.query.sort ? (req.query.desc ? 'desc' : 'asc') : 'asc'
  let column = req.query.sc
  let query = knex('UserAccount')
    .select('UserAccount.id', 'UserAccount.name', 'UserAccount.email', 'UserAccount.active')
    .orderBy(sort, sortDirection)
  let columns = query._statements.find(e => e.grouping == 'columns').value
  if (util.isInvalidSearch(columns, column)) {
    return res.sendStatus(403)
  }
  if (req.query.sw) {
    let search = req.query.sw
    let operator = util.getOperator(req.query.so)
    if (operator == 'like') {
      search = `%${search}%`
    }
    query.where(column, operator, search)
  }
  let sqlCount = query.clone().clearSelect().clearOrder().count('* as "count"').toString()
  let sqlQuery = query.offset((page - 1) * size).limit(size).toString()
  Promise.all([
    db.query(sqlCount, { type: 'SELECT', plain: true }),
    db.query(sqlQuery, { type: 'SELECT' })
  ]).then(([count, userAccounts]) => {
    let last = Math.ceil(count.count / size)
    res.send({ userAccounts, last })
  }).catch(next)
}

exports.getCreate = (req, res, next) => {
  let sqlRole = knex('Role')
    .select('Role.id', 'Role.name')
    .toString()
  db.query(sqlRole, { type: 'SELECT' }).then(roles => {
    res.send({ roles })
  }).catch(next)
}

exports.create = (req, res, next) => {
  let userAccount = util.parseData(UserAccount, { ...req.body })
  let token = [...Array(4)].map(() => Math.random().toString(36).substring(2)).join('').substr(0, 40)
  userAccount.password_reset_token = token
  userAccount.password = bcrypt.hashSync(Math.random().toString(36).substring(2), 10)
  if (userAccount.active === undefined) {
    userAccount.active = false
  }
  UserAccount.create(userAccount).then(async (data) => {
  await (async() => {
      let roles = req.body.role_id
      if (roles) {
        await UserRole.bulkCreate(
          roles.map(role => {
            return {
              user_id: data.id,
              role_id: role
            }
          })
        )
      }
    })()
    await util.sentMail('welcome', userAccount.email, token, userAccount.name)
    res.end()
  }).catch(next)
}

exports.get = (req, res, next) => {
  let sqlUserAccount = knex('UserAccount')
    .select('UserAccount.id', 'UserAccount.name', 'UserAccount.email', 'UserAccount.active')
    .where('UserAccount.id', req.params.id)
    .toString()
  let sqlUserAccountUserRole = knex('UserAccount')
    .join('UserRole', 'UserAccount.id', 'UserRole.user_id')
    .join('Role', 'UserRole.role_id', 'Role.id')
    .select('Role.name as role_name')
    .where('UserAccount.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlUserAccount, { type: 'SELECT', plain: true }),
    db.query(sqlUserAccountUserRole, { type: 'SELECT' })
  ]).then(([ userAccount, userAccountUserRoles ]) => {
    res.send({ userAccount, userAccountUserRoles })
  }).catch(next)
}

exports.edit = (req, res, next) => {
  let sqlUserAccount = knex('UserAccount')
    .select('UserAccount.id', 'UserAccount.name', 'UserAccount.email', 'UserAccount.active')
    .where('UserAccount.id', req.params.id)
    .toString()
  let sqlUserAccountUserRole = knex('UserAccount')
    .join('UserRole', 'UserAccount.id', 'UserRole.user_id')
    .select('UserRole.role_id')
    .where('UserAccount.id', req.params.id)
    .toString()
  let sqlRole = knex('Role')
    .select('Role.id', 'Role.name')
    .toString()
  Promise.all([
    db.query(sqlUserAccount, { type: 'SELECT', plain: true }),
    db.query(sqlUserAccountUserRole, { type: 'SELECT' }),
    db.query(sqlRole, { type: 'SELECT' })
  ]).then(([ userAccount, userAccountUserRoles, roles ]) => {
    res.send({ userAccount, userAccountUserRoles, roles })
  }).catch(next)
}

exports.update = (req, res, next) => {
  let userAccount = util.parseData(UserAccount, { ...req.body })
  if (userAccount.password) {
    userAccount.password = bcrypt.hashSync(userAccount.password, 10)
  }
  else {
    delete userAccount.password
  }
  if (userAccount.active === undefined) {
    userAccount.active = false
  }
  UserAccount.update(userAccount, { where: { id: req.params.id }}).then(async () => {
  await (async() => {
      await UserRole.destroy({ where: { user_id: req.params.id }})
      let roles = req.body.role_id
      if (roles) {
        await UserRole.bulkCreate(
          roles.map(role => {
            return {
              user_id: req.params.id,
              role_id: role
            }
          })
        )
      }
    })()
    res.end()
  }).catch(next)
}

exports.getDelete = (req, res, next) => {
  let sqlUserAccount = knex('UserAccount')
    .select('UserAccount.id', 'UserAccount.name', 'UserAccount.email', 'UserAccount.active')
    .where('UserAccount.id', req.params.id)
    .toString()
  let sqlUserAccountUserRole = knex('UserAccount')
    .join('UserRole', 'UserAccount.id', 'UserRole.user_id')
    .join('Role', 'UserRole.role_id', 'Role.id')
    .select('Role.name as role_name')
    .where('UserAccount.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlUserAccount, { type: 'SELECT', plain: true }),
    db.query(sqlUserAccountUserRole, { type: 'SELECT' })
  ]).then(([ userAccount, userAccountUserRoles ]) => {
    res.send({ userAccount, userAccountUserRoles })
  }).catch(next)
}

exports.delete = (req, res, next) => {
  UserAccount.destroy({ where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}
