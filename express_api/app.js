const express = require('express')
const cors = require('cors')
const authen = require('./middleware/authen')
const router = require('./router.js')
const util = require('./util')

const app = express()
app.use(cors(), express.json())
app.use('/uploads', express.static('uploads'))
app.use('/api', authen, router)
app.use((err, req, res, next) => {
  res.status(500).send(util.getError(err))
})
app.listen(8000)