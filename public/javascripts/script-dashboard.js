var newColHtml = '<div class="btn-group pull-right">'+
	'<button id="bEdit" type="button" class="btn btn-sm btn-default"  onclick="rowEdit(this);">' +
	'<i class="fas fa-pencil-alt"></i>'+
	'</button>'+
	'<button id="bElim" type="button" class="btn btn-sm btn-default"  onclick="rowElim(this);">' +
	'<i class="fas fa-trash" aria-hidden="true"></i>'+
	'</button>'+
	'<button id="bAcep" type="button" class="btn btn-sm btn-default"  style="display:none;" onclick="rowAcep(this);">' +
	'<i class="fas fa-check"></i>'+
	'</button>'+
	'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;"  onclick="rowCancel(this);">' +
	'<i class="fas fa-times" aria-hidden="true"></i>'+
	'</button>'+
	'</div>';

var saveColHtml = '<div class="btn-group pull-right">'+
	'<button id="bEdit" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowEdit(this);">' +
	'<i class="fas fa-pencil-alt"></i>'+
	'</button>'+
	'<button id="bElim" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowElim(this);">' +
	'<i class="fas fa-trash" aria-hidden="true"></i>'+
	'</button>'+
	'<button id="bAcep" type="button" class="btn btn-sm btn-default"   onclick="rowAcep(this);">' +
	'<i class="fas fa-check"></i>'+
	'</button>'+
	'<button id="bCanc" type="button" class="btn btn-sm btn-default"  onclick="rowCancel(this);">' +
	'<i class="fas fa-times" aria-hidden="true"></i>'+
	'</button>'+
	'</div>';

var colEdicHtml = '<tr><td class="idRaw d-none"></td>' +
	'<td class="websiteRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
	'<td class="loginRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
	'<td class="passwordRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>' +
	'<td class="commentRaw"><div style="display: none;"></div><input class="form-control input-sm"  value=""></td>'+
	'<td name="buttons">'+saveColHtml+'</td>';

$('#but_add').click(function(){
	$('#bodyTable').append(colEdicHtml);
});

var cont1, cont2, cont3, cont4;

function rowEdit(but){
	$(but).parent().find('#bAcep').show();
	$(but).parent().find('#bCanc').show();
	$(but).parent().find('#bEdit').hide();
	$(but).parent().find('#bElim').hide();
	var $row = $(but).parents('tr');
	$row.attr('id', 'editing');

	cont1 = $row.find('.websiteRaw').html();
	$row.find('.websiteRaw').html(
		'<div style="display: none;">' + cont1 + '</div>'+
		'<input class="form-control input-sm"  value="' + cont1 + '">'
	);
	cont2 = $row.find('.loginRaw').html();
	$row.find('.loginRaw').html(
		'<div style="display: none;">' + cont2 + '</div>'+
		'<input class="form-control input-sm"  value="' + cont2 + '">'
	);
	cont3 = $row.find('.passwordRaw').html();
	$row.find('.passwordRaw').html(
		'<div style="display: none;">' + cont3 + '</div>'+
		'<input class="form-control input-sm"  value="' + cont3 + '">'
	);
	cont4 = $row.find('.commentRaw').html();
	$row.find('.commentRaw').html(
		'<div style="display: none;">' + cont4 + '</div>'+
		'<input class="form-control input-sm"  value="' + cont4 + '">'
	);
}

function rowElim(but) {
	$(but).parent().find('#bAcep').show();
	$(but).parent().find('#bCanc').show();
	$(but).parent().find('#bEdit').hide();
	$(but).parent().find('#bElim').hide();
	var $row = $(but).parents('tr');
	$row.attr('id', 'editing');
	$row.remove();
}

function rowAcep(but) {
	$(but).parent().find('#bAcep').hide();
	$(but).parent().find('#bCanc').hide();
	$(but).parent().find('#bEdit').show();
	$(but).parent().find('#bElim').show();
	var $row = $(but).parents('tr');
	$row.attr('id', '');

	var cont = $row.find('.websiteRaw').find('input').val();
	$row.find('.websiteRaw').html(cont);
	var cont = $row.find('.loginRaw').find('input').val();
	$row.find('.loginRaw').html(cont);
	var cont = $row.find('.passwordRaw').find('input').val();
	$row.find('.passwordRaw').html(cont);
	var cont = $row.find('.commentRaw').find('input').val();
	$row.find('.commentRaw').html(cont);
}

function rowCancel(but) {
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