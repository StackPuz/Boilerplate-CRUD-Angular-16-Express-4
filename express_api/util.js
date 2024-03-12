const moment = require('moment')
const multer = require('multer')
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const config = require('./config')

module.exports = {
  format: {
    date: 'MM/DD/YYYY',
    time: 'HH:mm:ss',
    dateTime: 'MM/DD/YYYY HH:mm:ss'
  },
  operators: {
    c: 'like',
    e: '=',
    g: '>',
    ge: '>=',
    l: '<',
    le: '<='
  },
  getOperator(oper) {
    return this.operators[oper] || '='
  },
  isInvalidSearch(selectedColumns, column) {
    let columns = selectedColumns.map(e => e.split(' as ')[0])
    return column && columns.indexOf(column) < 0
  },
  async sentMail(type, email, token, user) {
    let body = config.mail[type]
    body = body.replace(/{app_url}/g, config.app.url)
    body = body.replace('{app_name}', config.app.name)
    body = body.replace('{token}', token)
    if (user) {
      body = body.replace('{user}', user)
    }
    let subject = (type == 'welcome' ? 'Login Information' : (type == 'reset' ? 'Reset Password' : config.app.name + ' message'))
    /* You need to complete the SMTP Server configuration before you can sent mail
    let transport = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      tls: {
        servername: config.smtp.host
      },
      requireTLS: true,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password
      }
    })
    var options = {
      from: config.mail.sender,
      to: email,
      subject: subject,
      text: body
    }
    return await transport.sendMail(options)
    */
  },
  getError(error) {
    if (error.constructor.name == 'ValidationError') {
      let errors = error.errors.reduce((errors, e) => {
        errors[e.path] = e.message
        return errors
      }, {})
      return { errors }
    }
    else if (error.constructor.name == 'UniqueConstraintError') {
      let errors = error.errors.map(e => e.message).join('\n') || 'Unique constraint violated'
      return { message: errors }
    }
    return { message: error.message }
  },
  parseData(table, obj) {
    let attrs = table.tableAttributes
    Object.keys(obj).filter(e => obj[e] != null && attrs[e]).forEach(e => {
      if (obj[e] === '' && (attrs[e].allowNull === undefined || attrs[e].allowNull)) {
        obj[e] = null
      }
      else if (attrs[e].type.key == 'DATEONLY') {
        obj[e] = this.getDate(obj[e])
      }
      else if (attrs[e].type.key == 'TIME') {
        obj[e] = this.getTime(obj[e]).format('HH:mm:ss')
      }
      else if (attrs[e].type.key == 'DATE') {
        obj[e] = this.getDateTime(obj[e])
      }
      else if (attrs[e].type.key == 'BOOLEAN' && typeof obj[e] == 'string') { //multipart/form-data fix
        obj[e] = (obj[e] == '1' ? true : (obj[e] == '0' ? false : obj[e]))
      }
    })
    return obj
  },
  getFile(folder, names) {
    let destination = './uploads/' + folder
    return multer({
      storage: multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
          let filename = Math.random().toString(36).substring(2) + '.' + file.originalname.split('.').slice(-1)[0]
          while (fs.existsSync(path.join(destination, filename))) {
            filename = Math.random().toString(36).substring(2) + '.' + file.originalname.split('.').slice(-1)[0]
          }
          cb(null, filename)
        }
      })
    }).fields(names.split(',').map(e => ({ name: e })))
  },
  getDate(value) {
    return moment(value, this.format.date)
  },
  getTime(value) {
    return moment(value, this.format.time)
  },
  getDateTime(value) {
    return moment(value, this.format.dateTime)
  },
  formatDate(value) {
    return moment.utc(value).format(this.format.date)
  },
  formatTime(value) {
    return moment.utc(value, typeof(value) == 'string' ? 'HH:mm:ss': null).format(this.format.time)
  },
  formatDateTime(value) {
    return moment.utc(value).format(this.format.dateTime)
  },
  formatDateStr(value) {
    if (value.length == this.format.time.length) {
      return this.getTime(value).format('HH:mm:ss')
    }
    else if (value.length == this.format.date.length) {
      return this.getDate(value).format('YYYY-MM-DD')
    }
    else {
      return this.getDateTime(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  formatData(field, next) {
    if (next.toString() == 'function() { return packet.readLengthCodedBuffer() }') {
      if (field.type == 'BIT') {
        let buffer = field.buffer()
        return buffer && buffer[0]
      }
      else if (field.type == 'STRING') { //BINARY (STRING)
        let string = field.string()
        return string && string.replace(/\0/g, '')
      }
      return field.string() //VARBINARY (VAR_STRING), BLOB
    }
    else if (field.type == 'DATE') {
      let value = field.string()
      return value && this.formatDate(value)
    }
    else if (field.type == 'TIME') {
      let value = field.string()
      return value && this.formatTime(value)
    }
    else if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
      let value = field.string()
      return value && this.formatDateTime(value)
    }
    return next()
  }
}