applicationDirectory = __dirname + '/'
express = require('express')
favicon = require('serve-favicon')
bodyParser = require("body-parser")
app = express()
path = require('path')
global["http"] = require('http').Server(app)
config = require(applicationDirectory + 'config')

### Path to express public directory ###
pub = __dirname + '/' + config.publicFolder
app.set 'views', config.dirViews
app.set 'view engine', config.viewEngine
app.use express['static'](pub)
app.use bodyParser.json limit: '500mb'
app.use bodyParser.urlencoded
  limit: '500mb'
  extended: false


### Adapter ###
require(applicationDirectory + 'adapter')(config)
require(applicationDirectory + 'class/Controller')::init();

### Socket ###
if config? and config.socket
  global["socketIo"] = null

### Routing ###
require(applicationDirectory + 'routes')::init(app)

### Start server ###
http.listen config.port, ->
  console.log 'Server started. Link: http(s)://' + config.url + ':' + config.port
  return