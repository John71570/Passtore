$( document ).ready(function() {

	$(function(){
		$('.submit').on('submit', function(event){
			event.preventDefault();
			var formData = $('form').serializeArray();

			if(formData[0].value != formData[1].value){
				$('.errorMessage').removeClass('d-none');
				$('.errorMessage').text('The passwords are not similar');
			}else{
				$('.errorMessage').addClass('d-none');
			}
			if(formData[2].value != formData[3].value){
				$('.errorMessage').removeClass('d-none');
				$('.errorMessage').text('The decrypt key are not similar');
			}else{
				$('.errorMessage').addClass('d-none');
			}

			var ladata = {
				user_password: formData[0].value,
				user_passwordB: formData[1].value,
				user_public_key: formData[2].value,
				user_public_keyB: formData[3].value,
				user_email: formData[4].value
			};

			$.ajax({
				type: "POST",
				url: "/settings",
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