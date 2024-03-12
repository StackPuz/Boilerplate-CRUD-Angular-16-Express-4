const Sequelize = require('sequelize')
const { db } = require('../db')

module.exports = db.define('UserAccount', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password_reset_token: Sequelize.STRING,
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
})