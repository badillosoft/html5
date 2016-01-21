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
	data: JSON.stringify({username: "john", password: "doe"}),
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