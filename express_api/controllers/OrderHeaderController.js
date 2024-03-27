const { knex, db } = require('../db')
const util = require('../util')
const OrderHeader = require('../models/OrderHeader')

exports.index = (req, res, next) => {
  let page = req.query.page || 1
  let size = req.query.size || 10
  let sort = req.query.sort || 'OrderHeader.id'
  let sortDirection = req.query.sort ? (req.query.desc ? 'desc' : 'asc') : 'asc'
  let column = req.query.sc
  let query = knex('OrderHeader')
    .leftJoin('Customer', 'OrderHeader.customer_id', 'Customer.id')
    .select('OrderHeader.id', 'Customer.name as customer_name', 'OrderHeader.order_date')
    .orderBy(sort, sortDirection)
  let columns = query._statements.find(e => e.grouping == 'columns').value
  if (util.isInvalidSearch(columns, column)) {
    return res.sendStatus(403)
  }
  if (req.query.sw) {
    let search = req.query.sw
    let operator = util.getOperator(req.query.so)
    if (column == 'OrderHeader.order_date') {
      search = util.formatDateStr(search)
    }
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
  ]).then(([count, orderHeaders]) => {
    let last = Math.ceil(count.count / size)
    res.send({ orderHeaders, last })
  }).catch(next)
}

exports.getCreate = (req, res, next) => {
  let sqlCustomer = knex('Customer')
    .select('Customer.id', 'Customer.name')
    .toString()
  db.query(sqlCustomer, { type: 'SELECT' }).then(customers => {
    res.send({ customers })
  }).catch(next)
}

exports.create = (req, res, next) => {
  let orderHeader = util.parseData(OrderHeader, { ...req.body })
  OrderHeader.create(orderHeader).then(() => {
    res.end()
  }).catch(next)
}

exports.get = (req, res, next) => {
  let sqlOrderHeader = knex('OrderHeader')
    .leftJoin('Customer', 'OrderHeader.customer_id', 'Customer.id')
    .select('OrderHeader.id', 'Customer.name as customer_name', 'OrderHeader.order_date')
    .where('OrderHeader.id', req.params.id)
    .toString()
  let sqlOrderHeaderOrderDetail = knex('OrderHeader')
    .join('OrderDetail', 'OrderHeader.id', 'OrderDetail.order_id')
    .join('Product', 'OrderDetail.product_id', 'Product.id')
    .select('OrderDetail.no', 'Product.name as product_name', 'OrderDetail.qty')
    .where('OrderHeader.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlOrderHeader, { type: 'SELECT', plain: true }),
    db.query(sqlOrderHeaderOrderDetail, { type: 'SELECT' })
  ]).then(([ orderHeader, orderHeaderOrderDetails ]) => {
    res.send({ orderHeader, orderHeaderOrderDetails })
  }).catch(next)
}

exports.edit = (req, res, next) => {
  let sqlOrderHeader = knex('OrderHeader')
    .select('OrderHeader.id', 'OrderHeader.customer_id', 'OrderHeader.order_date')
    .where('OrderHeader.id', req.params.id)
    .toString()
  let sqlOrderHeaderOrderDetail = knex('OrderHeader')
    .join('OrderDetail', 'OrderHeader.id', 'OrderDetail.order_id')
    .join('Product', 'OrderDetail.product_id', 'Product.id')
    .select('OrderDetail.no', 'Product.name as product_name', 'OrderDetail.qty', 'OrderDetail.order_id')
    .where('OrderHeader.id', req.params.id)
    .toString()
  let sqlCustomer = knex('Customer')
    .select('Customer.id', 'Customer.name')
    .toString()
  Promise.all([
    db.query(sqlOrderHeader, { type: 'SELECT', plain: true }),
    db.query(sqlOrderHeaderOrderDetail, { type: 'SELECT' }),
    db.query(sqlCustomer, { type: 'SELECT' })
  ]).then(([ orderHeader, orderHeaderOrderDetails, customers ]) => {
    res.send({ orderHeader, orderHeaderOrderDetails, customers })
  }).catch(next)
}

exports.update = (req, res, next) => {
  let orderHeader = util.parseData(OrderHeader, { ...req.body })
  OrderHeader.update(orderHeader, { where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}

exports.getDelete = (req, res, next) => {
  let sqlOrderHeader = knex('OrderHeader')
    .leftJoin('Customer', 'OrderHeader.customer_id', 'Customer.id')
    .select('OrderHeader.id', 'Customer.name as customer_name', 'OrderHeader.order_date')
    .where('OrderHeader.id', req.params.id)
    .toString()
  let sqlOrderHeaderOrderDetail = knex('OrderHeader')
    .join('OrderDetail', 'OrderHeader.id', 'OrderDetail.order_id')
    .join('Product', 'OrderDetail.product_id', 'Product.id')
    .select('OrderDetail.no', 'Product.name as product_name', 'OrderDetail.qty')
    .where('OrderHeader.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlOrderHeader, { type: 'SELECT', plain: true }),
    db.query(sqlOrderHeaderOrderDetail, { type: 'SELECT' })
  ]).then(([ orderHeader, orderHeaderOrderDetails ]) => {
    res.send({ orderHeader, orderHeaderOrderDetails })
  }).catch(next)
}

exports.delete = (req, res, next) => {
  OrderHeader.destroy({ where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}
