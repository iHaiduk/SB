path = require 'path'
filename = path.parse __filename

module.exports = (response, template = "index") ->
  @name = filename.name
  @response = response
  @template = @name + "/" + template
  return

module.exports.prototype =
  extend: (properties) ->
    Child = module.exports
    Child.prototype = module.exports.prototype
    for key of properties
      Child.prototype[key] = properties[key]
    Child
  send: (data)->
    @response.json(data)
  render: (data) ->
    if @response and @template
      @response.render @template, data
    return
  getHtml: (data, cb) ->
    _this = @
    if @response and @template
      @response.render @template, data, (err, html)->
        if typeof cb is "function"
          cb html
        else
          _this.response.writeHead(200, {'Content-Type': 'text/html'});
          _this.response.write(html)
          _this.response.end()
        return
      return
