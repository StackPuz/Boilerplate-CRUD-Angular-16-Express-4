const { knex, db } = require('../db')
const util = require('../util')
const Product = require('../models/Product')

exports.index = (req, res, next) => {
  let page = req.query.page || 1
  let size = req.query.size || 10
  let sort = req.query.sort || 'Product.id'
  let sortDirection = req.query.sort ? (req.query.desc ? 'desc' : 'asc') : 'asc'
  let column = req.query.sc
  let query = knex('Product')
    .leftJoin('Brand', 'Product.brand_id', 'Brand.id')
    .leftJoin('UserAccount', 'Product.create_user', 'UserAccount.id')
    .select('Product.id', 'Product.image', 'Product.name', 'Product.price', 'Brand.name as brand_name', 'UserAccount.name as user_account_name')
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
  ]).then(([count, products]) => {
    let last = Math.ceil(count.count / size)
    res.send({ products, last })
  }).catch(next)
}

exports.getCreate = (req, res, next) => {
  let sqlBrand = knex('Brand')
    .select('Brand.id', 'Brand.name')
    .toString()
  db.query(sqlBrand, { type: 'SELECT' }).then(brands => {
    res.send({ brands })
  }).catch(next)
}

exports.create = (req, res, next) => {
  let product = util.parseData(Product, { ...req.body })
  Array.from([ 'image' ]).forEach(e => {
    if (req.files[e]) {
      product[e] = req.files[e][0].filename
    }
  })
  product.create_user = req.user.id
  product.create_date = Date.now()
  Product.create(product).then(() => {
    res.end()
  }).catch(next)
}

exports.get = (req, res, next) => {
  let sqlProduct = knex('Product')
    .leftJoin('Brand', 'Product.brand_id', 'Brand.id')
    .leftJoin('UserAccount', 'Product.create_user', 'UserAccount.id')
    .select('Product.id', 'Product.name', 'Product.price', 'Brand.name as brand_name', 'UserAccount.name as user_account_name', 'Product.image')
    .where('Product.id', req.params.id)
    .toString()
  db.query(sqlProduct, { type: 'SELECT', plain: true }).then(product => {
    res.send({ product })
  }).catch(next)
}

exports.edit = (req, res, next) => {
  let sqlProduct = knex('Product')
    .select('Product.id', 'Product.name', 'Product.price', 'Product.brand_id', 'Product.image')
    .where('Product.id', req.params.id)
    .toString()
  let sqlBrand = knex('Brand')
    .select('Brand.id', 'Brand.name')
    .toString()
  Promise.all([
    db.query(sqlProduct, { type: 'SELECT', plain: true }),
    db.query(sqlBrand, { type: 'SELECT' })
  ]).then(([ product, brands ]) => {
    res.send({ product, brands })
  }).catch(next)
}

exports.update = (req, res, next) => {
  let product = util.parseData(Product, { ...req.body })
  Array.from([ 'image' ]).forEach(e => {
    if (req.files[e]) {
      product[e] = req.files[e][0].filename
    }
  })
  Product.update(product, { where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}

exports.getDelete = (req, res, next) => {
  let sqlProduct = knex('Product')
    .leftJoin('Brand', 'Product.brand_id', 'Brand.id')
    .leftJoin('UserAccount', 'Product.create_user', 'UserAccount.id')
    .select('Product.id', 'Product.name', 'Product.price', 'Brand.name as brand_name', 'UserAccount.name as user_account_name', 'Product.image')
    .where('Product.id', req.params.id)
    .toString()
  db.query(sqlProduct, { type: 'SELECT', plain: true }).then(product => {
    res.send({ product })
  }).catch(next)
}

exports.delete = (req, res, next) => {
  Product.destroy({ where: { id: req.params.id }}).then(() => {
    res.end()
  }).catch(next)
}
