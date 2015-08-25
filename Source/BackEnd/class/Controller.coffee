String::capitalize = ->
  @charAt(0).toUpperCase() + @slice(1)

fs = require('fs')
path = require('path')
dir = __dirname + '/../controllers'

class Controllers
  init: ->
    fs.readdir dir, (err, files) ->
      if err
        throw err
      files.forEach (file) ->
        file = path.parse(file, '.js')
        return if file.name is "index"
        global[file.name.capitalize()] = require(dir + "/" + file.name)
        return
      return
    return


module.exports = Controllers