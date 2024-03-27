const { knex, db } = require('../db')
const util = require('../util')
const Brand = require('../models/Brand')

exports.index = (req, res, next) => {
  let page = req.query.page || 1
  let size = req.query.size || 10
  let sort = req.query.sort || 'Brand.id'
  let sortDirection = req.query.sort ? (req.query.desc ? 'desc' : 'asc') : 'asc'
  let column = req.query.sc
  let query = knex('Brand')
    .select('Brand.id', 'Brand.name')
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
  ]).then(([count, brands]) => {
    let last = Math.ceil(count.count / size)
    res.send({ brands, last })
  }).catch(next)
}

exports.getCreate = (req, res, next) => {
  res.end()
}

exports.create = (req, res, next) => {
  let brand = util.parseData(Brand, { ...req.body })
  Brand.create(brand).then(() => {
    res.end()
  }).catch(next)
}

exports.get = (req, res, next) => {
  let sqlBrand = knex('Brand')
    .select('Brand.id', 'Brand.name')
    .where('Brand.id', req.params.id)
    .toString()
  let sqlBrandProduct = knex('Brand')
    .join('Product', 'Brand.id', 'Product.brand_id')
    .select('Product.name', 'Product.price')
    .where('Brand.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlBrand, { type: 'SELECT', plain: true }),
    db.query(sqlBrandProduct, { type: 'SELECT' })
  ]).then(([ brand, brandProducts ]) => {
    res.send({ brand, brandProducts })
  }).catch(next)
}

exports.edit = (req, res, next) => {
  let sqlBrand = knex('Brand')
    .select('Brand.id', 'Brand.name')
    .where('Brand.id', req.params.id)
    .toString()
  let sqlBrandProduct = knex('Brand')
    .join('Product', 'Brand.id', 'Product.brand_id')
    .select('Product.name', 'Product.price', 'Product.id')
    .where('Brand.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlBrand, { type: 'SELECT', plain: true }),
    db.query(sqlBrandProduct, { type: 'SELECT' })
  ]).then(([ brand, brandProducts ]) => {
    res.send({ brand, brandProducts })
  }).catch(next)
}

exports.update = (req, res, next) => {
  let brand = util.parseData(Brand, { ...req.body })
  Brand.update(brand, { where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}

exports.getDelete = (req, res, next) => {
  let sqlBrand = knex('Brand')
    .select('Brand.id', 'Brand.name')
    .where('Brand.id', req.params.id)
    .toString()
  let sqlBrandProduct = knex('Brand')
    .join('Product', 'Brand.id', 'Product.brand_id')
    .select('Product.name', 'Product.price')
    .where('Brand.id', req.params.id)
    .toString()
  Promise.all([
    db.query(sqlBrand, { type: 'SELECT', plain: true }),
    db.query(sqlBrandProduct, { type: 'SELECT' })
  ]).then(([ brand, brandProducts ]) => {
    res.send({ brand, brandProducts })
  }).catch(next)
}

exports.delete = (req, res, next) => {
  Brand.destroy({ where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}
