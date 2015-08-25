mongoose = require('mongoose')


module.exports = (config)->

  if config?
    for i of config.dataBase
      base = config.dataBase[i]
      if base? and  i is "mongo"
        mongoose.connect 'mongodb://' + ( if base.user? and base.user isnt "" then base.user + ':' + base.password + '@' else "") + base.host + ':' + base.port + '/'+ base.table, (err, db) ->
          return console.log(err) if err?
          console.log 'Successfully connected to mongodb://' + ( if base.user? and base.user isnt "" then base.user + ':' + base.password + '@' else "") + base.host + ':' + base.port + '/'+ base.table
          return