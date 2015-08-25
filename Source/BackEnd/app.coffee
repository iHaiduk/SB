'use strict'
express = require('express')
http = require('http')
path = require('path')
app = express()
server = http.createServer(app)
app.get '/', (req, res) ->
  res.send('<p>Hello World!!!</p> 777');
  return

app.use express.static('public')
server.listen 3000, 'localhost'

server.on 'listening', ->
  console.log 'Express server started on port %s at %s', server.address().port, server.address().address
  return