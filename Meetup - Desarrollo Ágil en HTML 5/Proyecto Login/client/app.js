/* global Mustache */
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
			var target = document.getElementById('target');
			
			btn.disabled = false;
			
			if (data.code != 0) {
				// TODO: Avisar que el acceso falló
				target.innerHTML = data.message;
				sessionStorage.removeItem("token");
				return;
			}
			
			// TODO: Informar que el 
			var template = document.getElementById('template');
			
			var html = Mustache.render(
				template.innerHTML, 
				{ 
					username: txt_user.value,
					token: data.token 
				}
			);
			
			console.log(html);
			
			target.innerHTML = html;
			
			sessionStorage.setItem("token", data.token);
		},
		error: function (err) {
			// TODO: Algo salio mal
			console.error(err);
			btn.disabled = false;
		}
	});
}