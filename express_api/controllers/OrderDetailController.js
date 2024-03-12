const { knex, db } = require('../db')
const util = require('../util')
const OrderDetail = require('../models/OrderDetail')

exports.getCreate = (req, res, next) => {
  let sqlProduct = knex('Product')
    .select('Product.id', 'Product.name')
    .toString()
  db.query(sqlProduct, { type: 'SELECT' }).then(products => {
    res.send({ products })
  }).catch(next)
}

exports.create = (req, res, next) => {
  let orderDetail = util.parseData(OrderDetail, { ...req.body })
  OrderDetail.create(orderDetail).then(() => {
    res.end()
  }).catch(next)
}

exports.edit = (req, res, next) => {
  let sqlOrderDetail = knex('OrderDetail')
    .select('OrderDetail.order_id', 'OrderDetail.no', 'OrderDetail.product_id', 'OrderDetail.qty')
    .where('OrderDetail.order_id', req.params.orderId)
    .where('OrderDetail.no', req.params.no)
    .toString()
  let sqlProduct = knex('Product')
    .select('Product.id', 'Product.name')
    .toString()
  Promise.all([
    db.query(sqlOrderDetail, { type: 'SELECT', plain: true }),
    db.query(sqlProduct, { type: 'SELECT' })
  ]).then(([ orderDetail, products ]) => {
    res.send({ orderDetail, products })
  }).catch(next)
}

exports.update = (req, res, next) => {
  let orderDetail = util.parseData(OrderDetail, { ...req.body })
  OrderDetail.update(orderDetail, { where: { order_id: req.params.orderId, no: req.params.no }}).then(() => {
    res.end()
  }).catch(next)
}

exports.getDelete = (req, res, next) => {
  let sqlOrderDetail = knex('OrderDetail')
    .leftJoin('Product', 'OrderDetail.product_id', 'Product.id')
    .select('OrderDetail.order_id', 'OrderDetail.no', 'Product.name as product_name', 'OrderDetail.qty')
    .where('OrderDetail.order_id', req.params.orderId)
    .where('OrderDetail.no', req.params.no)
    .toString()
  db.query(sqlOrderDetail, { type: 'SELECT', plain: true }).then(orderDetail => {
    res.send({ orderDetail })
  }).catch(next)
}

exports.delete = (req, res, next) => {
  OrderDetail.destroy({ where: { order_id: req.params.orderId, no: req.params.no }}).then(() => {
    res.end()
  }).catch(next)
}
