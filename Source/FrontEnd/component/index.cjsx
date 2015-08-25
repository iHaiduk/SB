'use strict'
#Template = require("template")

NeatComponent = React.createClass
  render: ->
    `<div class="neat-component" id="name">
        <p>
    You! Click to toggle.
    </p>
    </div>`

React.render(
  React.createElement(NeatComponent, null),
  document.getElementById('content')
)







