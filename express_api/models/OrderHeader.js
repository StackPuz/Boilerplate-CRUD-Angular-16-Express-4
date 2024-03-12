const Sequelize = require('sequelize')
const { db } = require('../db')

module.exports = db.define('OrderHeader', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  order_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
})