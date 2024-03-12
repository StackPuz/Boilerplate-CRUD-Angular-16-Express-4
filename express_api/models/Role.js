const Sequelize = require('sequelize')
const { db } = require('../db')

module.exports = db.define('Role', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
})