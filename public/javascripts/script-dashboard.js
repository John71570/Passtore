$( document ).ready(function() {

	var newColHtml = '<div class="btn-group pull-right">' +
		'<button id="bEdit" type="button" class="btn btn-sm btn-default"  onclick="rowEdit(this);">' +
		'<i class="fas fa-pencil-alt"></i>' +
		'</button>' +
		'<button id="bElim" type="button" class="btn btn-sm btn-default"  onclick="rowElim(this);">' +
		'<i class="fas fa-trash" aria-hidden="true"></i>' +
		'</button>' +
		'<button id="bAcep" type="button" class="btn btn-sm btn-default"  style="display:none;" onclick="rowAcep(this);">' +
		'<i class="fas fa-check"></i>' +
		'</button>' +
		'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;"  onclick="rowCancel(this);">' +
		'<i class="fas fa-times" aria-hidden="true"></i>' +
		'</button>' +
		'</div>';

	var saveColHtml = '<div class="btn-group pull-right">' +
		'<button id="bEdit" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowEdit(this);">' +
		'<i class="fas fa-pencil-alt"></i>' +
		'</button>' +
		'<button id="bElim" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowElim(this);">' +
		'<i class="fas fa-trash" aria-hidden="true"></i>' +
		'</button>' +
		'<button id="bAcep" type="button" class="btn btn-sm btn-default"   onclick="rowAcep(this);">' +
		'<i class="fas fa-check"></i>' +
		'</button>' +
		'<button id="bCanc" type="button" class="btn btn-sm btn-default"  onclick="rowCancel(this);">' +
		'<i class="fas fa-times" aria-hidden="true"></i>' +
		'</button>' +
		'</div>';

	var colEdicHtml = '<tr><td class="idRaw d-none"></td>' +
		'<td class="websiteRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
		'<td class="loginRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
		'<td class="passwordRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
		'<td class="commentRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
		'<td class="buttonRaw" name="buttons">' + saveColHtml + '</td>';

	$('tbody tr').each(function(index){
		$(this).find('.buttonRaw').append(newColHtml);
	});

	$('#but_add').click(function () {
		$('#bodyTable').append(colEdicHtml);
	});

	var cont1, cont2, cont3, cont4;

	rowEdit = function (but) {
		$(but).parent().find('#bAcep').show();
		$(but).parent().find('#bCanc').show();
		$(but).parent().find('#bEdit').hide();
		$(but).parent().find('#bElim').hide();
		var $row = $(but).parents('tr');
		$row.attr('id', 'editing');

		cont1 = $row.find('.websiteRaw').html();
		$row.find('.websiteRaw').html(
			'<div style="display: none;">' + cont1 + '</div>' +
			'<input class="form-control input-sm"  value="' + cont1 + '">'
		);
		cont2 = $row.find('.loginRaw').html();
		$row.find('.loginRaw').html(
			'<div style="display: none;">' + cont2 + '</div>' +
			'<input class="form-control input-sm"  value="' + cont2 + '">'
		);
		cont3 = $row.find('.passwordRaw').html();
		$row.find('.passwordRaw').html(
			'<div style="display: none;">' + cont3 + '</div>' +
			'<input class="form-control input-sm"  value="' + cont3 + '">'
		);
		cont4 = $row.find('.commentRaw').html();
		$row.find('.commentRaw').html(
			'<div style="display: none;">' + cont4 + '</div>' +
			'<input class="form-control input-sm"  value="' + cont4 + '">'
		);
	}

	rowElim = function (but) {
		var $row = $(but).parents('tr');
		$row.attr('id', 'editing');
		var uuid = $row.find('.idRaw').html();

		$('#modalConfirmDelete').modal({
			show: true
		});

		$('#btnNO').click(function(){

		});

		$('#btnYES').click(function(){
			$row.remove();
			$.ajax({
				type: "DELETE",
				url: "/raw/"+ uuid,
				complete: function (xhr, status, errorThrown) {
					//console.log("Status : " + xhr.status);
					//console.log("Response : " + xhr.responseText);
					if (xhr.status == 204) {

					} else if (xhr.status == 400 || xhr.status == 409) {
					} else {
					}
				}
			});
		});

	}

	rowAcep = function (but) {
		$(but).parent().find('#bAcep').hide();
		$(but).parent().find('#bCanc').hide();
		$(but).parent().find('#bEdit').show();
		$(but).parent().find('#bElim').show();
		var $row = $(but).parents('tr');
		$row.attr('id', '');

		var uuid = $row.find('.idRaw').html();

		var cont11 = $row.find('.websiteRaw').find('input').val();
		$row.find('.websiteRaw').html(cont11);
		var cont22 = $row.find('.loginRaw').find('input').val();
		$row.find('.loginRaw').html(cont22);
		var cont33 = $row.find('.passwordRaw').find('input').val();
		$row.find('.passwordRaw').html(cont33);
		var cont44 = $row.find('.commentRaw').find('input').val();
		$row.find('.commentRaw').html(cont44);

		$.ajax({
			type: "GET",
			url: "/user",
			complete: function (xhr, status, errorThrown) {
				console.log("Status : " + xhr.status);
				console.log("Response : " + xhr.responseText);
				if (xhr.status == 200) {
					var key = JSON.parse(xhr.responseText).user_public_key;
					var ladata = {
						login: cont22,
						password: CryptoJS.AES.encrypt(cont33, key).toString(),
						website: cont11,
						comment: cont44,
					};

					if(uuid==''){
						$.ajax({
							type: "POST",
							url: "/raw",
							dataType: "json",
							contentType: "application/json",
							data: JSON.stringify(ladata),
							complete: function (xhr, status, errorThrown) {
								console.log("Status : " + xhr.status);
								console.log("Response : " + xhr.responseText);
								if (xhr.status == 201) {
									$row.find('.idRaw').html(JSON.parse(xhr.responseText).uuid);
								} else if (xhr.status == 400 || xhr.status == 409) {

								} else {

								}
							}
						});
					}else{
						$.ajax({
							type: "PUT",
							url: "/raw/"+uuid,
							dataType: "json",
							contentType: "application/json",
							data: JSON.stringify(ladata),
							complete: function (xhr, status, errorThrown) {
								console.log("Status : " + xhr.status);
								console.log("Response : " + xhr.responseText);
								if (xhr.status == 201) {
									$row.find('.idRaw').html(JSON.parse(xhr.responseText).uuid);
								} else if (xhr.status == 400 || xhr.status == 409) {

								} else {

								}
							}
						});
					}

				} else {

				}
			}
		});

	}

	rowCancel = function (but) {
		$(but).parent().find('#bAcep').hide();
		$(but).parent().find('#bCanc').hide();
		$(but).parent().find('#bEdit').show();
		$(but).parent().find('#bElim').show();
		var $row = $(but).parents('tr');
		$row.attr('id', '');

		$row.find('.websiteRaw').html(cont1);
		$row.find('.loginRaw').html(cont2);
		$row.find('.passwordRaw').html(cont3);
		$row.find('.commentRaw').html(cont4);
	}

	rowDecryptCancel = function(){
		$('#inputFrontKey').val('');
	};

	rowDecrypt = function(){
		var decryptKey = $('#inputFrontKey').val();

		$(".passwordRaw").each(function(raw){
			var decrypted = CryptoJS.AES.decrypt($(this).text(), decryptKey);
			res = decrypted.toString(CryptoJS.enc.Utf8);
			if(res != ''){
				$(this).text(res);
			}
		});

		$('#inputFrontKey').val('');
	};

});