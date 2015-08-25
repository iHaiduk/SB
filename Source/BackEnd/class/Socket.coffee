sockIo = require('socket.io')(http)
class Socket
  constructor: ()->
    _this = @
    if not socketIo?
      global["socketIo"] = "wait"
      sockIo.sockets.on 'connection', (socket) ->
        global["socketIo"] = socket
        _this.init()
        return
    else
      _this.init()

  isConnected: ->
    socketIo? and socketIo isnt "wait"

  init: ()->
    console.log(socketIo)

module.exports = Socket