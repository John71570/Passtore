$( document ).ready(function() {

	$(function(){
		$('.submit').on('submit', function(event){
			event.preventDefault();
			var formData = $('form').serializeArray();

			if(formData[1].value != formData[2].value){
				$('.errorMessage').removeClass('d-none');
				$('.errorMessage').text('The passwords are not similar');
			}else{
				$('.errorMessage').addClass('d-none');
			}
			if(formData[3].value != formData[4].value){
				$('.errorMessage').removeClass('d-none');
				$('.errorMessage').text('The decrypt key are not similar');
			}else{
				$('.errorMessage').addClass('d-none');
			}

			var ladata = {
				user_login: formData[0].value,
				user_password: formData[1].value,
				user_passwordB: formData[2].value,
				user_public_key: formData[3].value,
				user_public_keyB: formData[4].value,
				user_email: formData[5].value
			};

			$.ajax({
				type: "POST",
				url: "/user",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(ladata),
				complete: function(xhr, status, errorThrown){
					console.log("Status : "+xhr.status);
					console.log("Response : "+xhr.responseText);
					if(xhr.status == 201){
						$('.errorMessage').addClass('d-none');
						$('#exampleModalCenter').modal({
							show: true
						});
						setTimeout(function(){
							window.location = "/login";
						}, 4000);
					}else if(xhr.status == 400 || xhr.status == 409){
						$('.errorMessage').removeClass('d-none');
						$('.errorMessage').text(JSON.parse(xhr.responseText).message);
					}else{
						$('.errorMessage').removeClass('d-none');
						console.log(JSON.parse(xhr.responseText).message);
					}
				}
			});

		});
	});

});