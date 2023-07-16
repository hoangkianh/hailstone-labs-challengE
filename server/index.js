const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const http = require('http')

const logger = require('./src/logger')
const api = require('./api/index')

const app = express()

dotenv.config()

app.use(cors())
app.use(bodyParser.json())
app.use('/', api)

const server = http.Server(app)
const PORT = process.env.PORT || 4004

server.listen(PORT, '127.0.0.1', () => {
  const host = server.address().address
  const port = server.address().port
  logger.debug('Server start at http://%s:%s', host, port)
})

module.exports = server
