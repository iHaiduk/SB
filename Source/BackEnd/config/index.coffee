_Config =
	url: "127.0.0.1"
	port: 3000
	mode: "local"
	socket: true
	publicFolder: "../view"
	dirViews: ".development/template"
	viewEngine: "jade"
	dataBase:
		mongo:
			host: "127.0.0.1"
			port: 27017
			user: ""
			password: ""
			table: "siteBilder"


module.exports = _Config