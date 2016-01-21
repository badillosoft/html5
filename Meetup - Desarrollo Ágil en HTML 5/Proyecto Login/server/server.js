// Alan Badillo Salas | badillo.soft@hotmail.com | @badillosoft

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/LoginProject');

var db = mongoose.connection;

var connected = false;

db.on('error', function (err) {
	console.log('No se puede establecer conexión a la base de datos');
});

var UserSchema = mongoose.Schema({ username: String, password: String });

var Users = mongoose.model('Users', UserSchema);

db.once('open', function () {
	console.log('Conectado a la base de datos');
	connected = true;
	
	var john = new Users({ username: 'john', password: 'doe' });
	
	john.save();
}); 

app.use(bodyParser.json());

app.post('/login', function(req, res) {
	if (!connected) {
		res.send(JSON.stringify({
			code: 100,
			message: "Error al conectarse a la base de datos"
		}));
		return;
	}
	
	var data = req.body;
	
	console.log('Validando usuario: ' + JSON.stringify(data));
	
	if (!data.username) {
		res.send(JSON.stringify({
			code: 2,
			message: "No se ha recibido el nombre de usuario"
		}));
		return;
	}
	
	if (!data.password) {
		res.send(JSON.stringify({
			code: 3,
			message: "No se ha recibido la contraseña"
		}));
		return;
	}
	
	Users.findOne(
		{username: data.username, password: data.password},
		function (err, user) {
			if (err) {
				res.send(JSON.stringify({
					code: 101,
					message: "Falló la consulta a la base de datos"
				}));
				return;
			}
			
			if (!user) {
				res.send(JSON.stringify({
					code: 1, 
					message: "Datos de acceso incorrectos"
				}));
				return;
			}
			
			res.send(JSON.stringify({code: 0, token: "ABC123"}));
		}
	);
});

http.createServer(app).listen(8080, function () {
	console.log('El servidor se ha iniciado en http://localhost:8080');
});