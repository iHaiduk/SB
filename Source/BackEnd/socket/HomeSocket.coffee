HomeModel = require("../models/Home")
Socket = require("../class/Socket")

class HomeSocket extends Socket
  init: ()->
    if @isConnected()
      socketIo.emit 'news', hello: 'world'
      socketIo.on 'add_new_row', (msg) ->
        test = new HomeModel(msg.my)
        test.save (err, history)->

          socketIo.emit 'add_new_row_added',
            result: true
            data: history

          socketIo.broadcast.emit 'add_new_row_added',
            result: true
            data: history

          return

        return
    return

module.exports = HomeSocket


