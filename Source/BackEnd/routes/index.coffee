routes =
	home:
		type: 'get'
		link: '/'
		control: (req, res) ->
			UserController::index(req, res)
			return

	signin:
		type: 'post'
		link: '/signin'
		control: (req, res) ->
			UserController::signin(req, res)
			return

	redactor:
		type: 'get'
		link: '/redactor'
		control: (req, res) ->
			HomeController::run(req, res)
			return

	save:
		type: 'post'
		link: '/save'
		control: (req, res) ->
			HomeController::save(req, res)
			return

	cancel:
		type: 'get'
		link: '/cancel/'
		control: (req, res) ->
			HomeController::cancel(req, res)
			return

module.exports = class Routes
	init: (app)->
		for i of routes
			page = routes[i]
			app[page.type] page.link, page.control
		return