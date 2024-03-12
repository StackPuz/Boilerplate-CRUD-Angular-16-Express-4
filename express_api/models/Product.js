const Sequelize = require('sequelize')
const { db } = require('../db')

module.exports = db.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  brand_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  image: Sequelize.STRING,
  create_user: Sequelize.INTEGER,
  create_date: Sequelize.DATE,
})