const Sequelize = require('sequelize')
const { db } = require('../db')

module.exports = db.define('OrderDetail', {
  order_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  no: {
    type: Sequelize.SMALLINT,
    primaryKey: true
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  qty: {
    type: Sequelize.SMALLINT,
    allowNull: false
  },
})