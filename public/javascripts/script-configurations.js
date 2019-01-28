$( document ).ready(function() {

	$(function(){
		$('.submit').on('submit', function(event){
			event.preventDefault();
			var formData = $('form').serializeArray();

			var ladata = {};
			console.log(formData);

			if(formData[0].value != '' && formData[1].value != ''){
				if(formData[0].value != formData[1].value){
					$('.errorMessage').removeClass('d-none');
					$('.errorMessage').text('The passwords are not similar');
				}else{
					$('.errorMessage').addClass('d-none');
					ladata = {
						user_password: formData[0].value,
						user_passwordB: formData[1].value,
						user_email: formData[2].value
					};
				}
			}else{
				ladata = {
					user_email: formData[0].value
				};
			}

			$.ajax({
				type: "POST",
				url: "/settings",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(ladata),
				complete: function(xhr, status, errorThrown){
					console.log("Status : "+xhr.status);
					console.log("Response : "+xhr.responseText);
					if(xhr.status == 200){
						$('.errorMessage').addClass('d-none');
						$('#exampleModalCenter').modal({
							show: true
						});
						setTimeout(function(){
							window.location = "/dashboard";
						}, 3000);
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

		$('.showdecrypt').click(function(){
			$.ajax({
				type: "GET",
				url: "/publickey",
				dataType: "json",
				contentType: "application/json",
				complete: function(xhr, status, errorThrown){
					console.log("Status : "+xhr.status);
					console.log("Response : "+xhr.responseText);
					if(xhr.status == 200){
						$('.errorMessage').addClass('d-none');
						$('#publickeyvalue').text(JSON.parse(xhr.responseText).public_key);
						$('#modalkey').modal({
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