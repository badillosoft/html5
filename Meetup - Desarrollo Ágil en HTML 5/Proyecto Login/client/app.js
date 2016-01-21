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
			var target = document.getElementById('target'),
				template = null,
				html = null;
			
			btn.disabled = false;
			
			if (data.code != 0) {
				// TODO: Avisar que el acceso falló
				template = document.getElementById('tpl-msgbox-danger');
			
				html = Mustache.render(
					template.innerHTML, 
					{ message: data.message }
				);
				
				target.innerHTML = html;
			
				sessionStorage.removeItem("token");
				return;
			}
			
			// TODO: Informar que el 
			template = document.getElementById('tpl-msgbox-success');
			
			html = Mustache.render(
				template.innerHTML, 
				{ 
					username: txt_user.value,
					token: data.token 
				}
			);
			
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