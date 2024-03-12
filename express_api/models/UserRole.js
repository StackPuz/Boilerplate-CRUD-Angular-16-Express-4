const Sequelize = require('sequelize')
const { db } = require('../db')

module.exports = db.define('UserRole', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  role_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
})