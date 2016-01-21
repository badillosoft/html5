# Proyecto Login

Alan Badillo Salas | badillo.soft@hotmail.com |
[@badillosoft](http://twitter.com/badillosoft)

## Descripción

Este proyecto crea una aplicación _HTML 5_ que consume un servicio hecho en
_Express JS_ el cual tiene como objetivo solicitarle al usuario un nombre de
usuario y una contraseña, el servidor se encarga de validar los datos y
devolver un _JSON_ que indique si el usuario pudo o no registrarse.

## Protocolo de comunicación

El servicio recibe mediante un _JSON_ con el nombre del usuario y la contraseña
como el que sigue:

> __json__: Entrada

~~~json
{
	"username": "john",
	"password": "doe"
}
~~~

> __json__: Salida exitosa

~~~json
{
	"code": 0,
	"token": "ABC123"
}
~~~

> __json__: Salida con error

~~~json
{
	"code": 1,
	"message": "Los datos de acceso son incorrectos"
}
~~~

La siguiente tabla mustra algunos posibles códigos de error con su mensaje de
respuesta:

<table>
	<tr>
		<th>Código</th>
		<th>Mensaje</th>
	</tr>
	<tr>
		<td>0</td>
		<td>null</td>
	</tr>
	<tr>
		<td>1</td>
		<td>Datos de acceso incorrectos</td>
	</tr>
	<tr>
		<td>2</td>
		<td>No se recibió ningún nombre de usuario</td>
	</tr>
	<tr>
		<td>3</td>
		<td>No se recibió ninguna contraseña</td>
	</tr>
	<tr>
		<td>100</td>
		<td>No se puede conectar a la base de datos</td>
	</tr>
	<tr>
		<td>101</td>
		<td>Falló la consulta a la base de datos</td>
	</tr>
	<tr>
		<td>102</td>
		<td>Tiempo de espera con la base de datos agotado</td>
	</tr>
</table>

## Ejemplo para consumir el servicio

El siguiente ejemplo muestra cómo consumir el servicio de acceso a usuarios
desde la url.

> __javascript__: Consumir el servicio

~~~js
$.ajax({
	url: "http://localhost:8080/login",
	type: "post",
	contentType: 'application/json', // Tipo de datos que enviamos
	data: JSON.stringify({ username: "john", password: "doe" }),
	dataType: "json", // Tipo de datos que recibimos
	success: function (json) {
		if (json.code != 0) {
			// TODO: Avisar que el acceso falló
			alert(json.message);
			sessionStorage.removeItem("token");
			return;
		}
		
		// TODO: Informar que el 
		alert("Bienvenido");
		sessionStorage.setItem("token", json.token);
	},
	error: function (err) {
		// TODO: Algo salio mal
		console.error(err);
	}
});
~~~

# Tutorial para construir la aplicación paso a paso

<center>
## PARTE I - BACKEND
</center>

### 1. Montar el servidor en express

> __shell__: Instalar express

~~~bash
npm install -g express
npm link express
~~~

> __javascript__: server/server.js

~~~js
var http = require('http');
var express = require('express');

var app = express();

app.post('/login', function(req, res) {
	res.send(JSON.stringify({ hello: "world" }));
});

http.createServer(app).listen(8080, function () {
	console.log('El servidor se ha iniciado en http://localhost:8080');
});
~~~

### 2. Hacer que el servidor reciba un json como entrada

> __shell__: Instalar body-parser para express

~~~bash
npm install -g body-parser
npm link body-parser
~~~

> __javascript__: server/server.js

~~~js
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/login', function(req, res) {
	var data = req.body;
	
	console.log('El usuario envió: ' + JSON.stringify(data));
	
	res.send(JSON.stringify({ input: data }));
});

http.createServer(app).listen(8080, function () {
	console.log('El servidor se ha iniciado en http://localhost:8080');
});
~~~

### 3. Inicializar el servicio y probar que responda adecuadamente

> __shell__: Iniciar el servidor

~~~bash
cd path_to_project/server

node server.js
El servidor se ha iniciado en http://localhost:8080
~~~

> __html__: client/index.html

~~~html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Login</title>
		
		<script src="jquery.js"></script>
		<script src="app.js"></script>
	</head>
	<body>
		Abra la consola para ver el resultado (pulse la tecla F12)
	</body>
</html>
~~~

> __javascript__: client/app.js

~~~js
window.onload = function () {
	$.ajax({
		url: "http://localhost:8080/login",
		type: "post",
		contentType: 'application/json',
		data: JSON.stringify({
			message: "Probando el servicio"
		}),
		dataType: "json",
		success: function (data) {
			console.log(data);
		},
		error: function (err) {
			console.log(err);
		}
	});
};
~~~

### 4. Crear un servicio falso que simule validar al usuario john/doe

> __javascript__: server/server.js

~~~js
app.post('/login', function(req, res) {
	var data = req.body;
	
	if (data.username === "john" && data.password === "doe") {
		res.send(JSON.stringify({ code: 0, token: "ABC123" }));
		return;
	}
	
	res.send(JSON.stringify({ code: 1, message: "Datos de acceso incorrectos" }));
});
~~~

### 5. Probar que el servicio falso funcione

> __javascript__: client/app.js

~~~js
window.onload = function () {
	var password = prompt("Ingresa la contraseña de john");
	
	$.ajax({
		url: "http://localhost:8080/login",
		type: "post",
		contentType: 'application/json',
		data: JSON.stringify({
			username: "john",
			password: password
		}),
		dataType: "json",
		success: function (data) {
			console.log(data);
		},
		error: function (err) {
			console.log(err);
		}
	});
};
~~~

### 6. Conectar el servidor a la base de datos usando mongoose

> __Nota__: Es necesario tener MongoDB instalado

> __shell__: Instalar mongoose

~~~bash
npm install -g mongoose
npm link mongoose
~~~

> __javascript__: server/server.js

~~~js
// requieres
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
}); 

// rest of code
~~~

Observaciones

* Mongoose se carga como cualquier módulo en node
* Conectamos al servidor de la base de datos
* Establecemos un enlace a la base de datos definida en la conexión
mediante __db__
* Creamos una variable para saber si estamos conectados a la base de datos
* Agregámos un método que nos informe si ocurre un error en la conexión
* Creamos el esquema para los usuarios que constará de __username__ y __password__
* Creamos un enlace a la colección __Users__ mediante el esquema
* Cuando nos conectamos cambiamos el valor de __connected__

Con estos pasos ya podemos usar la colección __Users__ en el resto del código

### 7. Insertamos algunos usuarios en MongoDB

> __shell__: Iniciar _mongodb_

~~~bash
mongod
~~~

> __shell__: Iniciar _mongo_ shell

~~~bash
mongo
~~~

> __mongo shell__: Insertar algunos usuarios de prueba

~~~bash
use LoginProject

db.users.insert([
	{username: "john", password: "doe"},
	{username: "mary", password: "me"},
	{username: "paul", password: "laup"}
])
~~~

### 8. Hacer que el servicio funcione con la base de datos

> __javascript__: server/server.js

~~~js
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
~~~

Observaciones

* El servicio valida si hay conexión a la base de datos y manda
el código correspondiente en caso que no.
* El servicio valida que se ingrese el __username__ y el __password__
en el _json_ de entrada.
* Buscamos al primer usuario que concuerde con los parámetros correspondientes
* En la función _callback_ verificamos si hubo error y mostramos el código y
mensaje definido para dicho caso.
* Verificamos si encontró un usuario con tales datos, de no ser así
se envía el código y mensaje correspondiente.
* Enviamos el token correspondiente y código 0 si todo sale bien.

> __Nota__: Hasta aquí puedes probar si el servicio funciona correctamente
mediante el paso 5. Recuerda inciar los servicios y apagarlos para ver
las distintas respuestas del servidor.

# Donaciones

Si te sirvió este proyecto y deseas apoyarme para seguir creando más proyectos
como este bien documentados y con tutorial paso a paso de como construirlo
puedes depositar a la siguiente cuenta desde cualquier tienda __Oxxo__ o en
cualquier banco __Banamex__. Por cada aportación recibida regalaré minutos de 
consultoría vía __Skype__ (badillo.soft@hotmail.com) para resolver dudas
sobre este u otros proyectos. 

Tipo de cuenta: __Transfer Banamex__

Número de cuenta: __4766-8400-5755-0498__

Si tienes cuenta _Transfer Banamx_ o _Tarjeta Saldazo_ asociada a tu número
de teléfono también puedes enviar un mensaje de texto:

SMS al 4040: __5513964635 *XX*__

Donde _XX_ es la cantidad que deseas donar.

Parte de los fondos donados servirán para crear conferencias vía streaming
cada primer sábado de cada mes donde mostraré cómo integrar nuevas tecnologías 
a tu desarrollo web como Angular, Express, WebSockets, WebGL, SCSS y SASS, 
MongoDB, entre otros.