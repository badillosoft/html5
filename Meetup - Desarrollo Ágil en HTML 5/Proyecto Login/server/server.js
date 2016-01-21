#! /usr/bin/env node

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/login', function(req, res) {
	var data = req.body;
	
	console.log(data);
	
	if (data.username === 'john' && data.password === 'doe') {
		res.send(JSON.stringify({code: 0, token: "ABC123"}));
		return;
	}
	
	res.send(JSON.stringify({code: 1, message: "Datos de acceso incorrectos"}));
});

http.createServer(app).listen(8080, function () {
	console.log('El servidor se ha iniciado en http://localhost:8080');
});