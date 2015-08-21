
Template = require("template")

NeatComponent = React.createClass

  handleClick: ->
    @setState liked: @liked

  render: ->
    Template.index()







