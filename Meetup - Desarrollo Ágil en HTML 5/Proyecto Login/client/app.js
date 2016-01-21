/* global $ */

function login(btn) {
	btn.disabled = true;
	
	var txt_user = document.getElementById('txt_user');
	var txt_password = document.getElementById('txt_password');
	
	$.ajax({
		url: "http://localhost:8080/login",
		type: "post",
		contentType: 'application/json',
		data: JSON.stringify({
			username: txt_user.value,
			password: txt_password.value
		}),
		dataType: "json",
		success: function (data) {
			btn.disabled = false;
			
			if (data.code != 0) {
				// TODO: Avisar que el acceso falló
				alert(data.message);
				sessionStorage.removeItem("token");
				return;
			}
			
			// TODO: Informar que el 
			alert("Bienvenido");
			sessionStorage.setItem("token", data.token);
		},
		error: function (err) {
			// TODO: Algo salio mal
			console.error(err);
			btn.disabled = false;
		}
	});
}