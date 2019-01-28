var sha256 = require('sha256');
var cryptoJS = require("crypto-js");

//------------------------ List all fields of the table -----------------------------
let fields = ['user_login', 'user_email'];


//------------------------ Define all methods that can check and format each field -----------------------------
module.exports.checkAndFormat_user_login = function(value){
	return value;
};

module.exports.checkAndFormat_user_password = function(value){
	return sha256.x2(value);
};

module.exports.checkAndFormat_user_public_key = function(value){
	return value;
};

module.exports.checkAndFormat_user_email = function(value){
	return value;
};


//------------------------ Make all previous methods callable -----------------------------
var checkAndFormatCallable = {
	user_login : this.checkAndFormat_user_login,
	user_password : this.checkAndFormat_user_password,
	user_public_key : this.checkAndFormat_user_public_key,
	user_email: this.checkAndFormat_user_email
};


//------------------------ The most important function that map request to an object well formed for the database -----------------------------
module.exports.mapUser = function(req) {

	let result = {};

	var salt = Date.now().toString();

	for (var key in req.body) {
		if (req.body.hasOwnProperty(key) && fields.includes(key)) {
			result[key] = checkAndFormatCallable[key](req.body[key]);
		}
		result['user_password'] = checkAndFormatCallable['user_password'](req.body['user_password']+salt);
		result['user_salt'] = salt;
		result['user_public_key'] = cryptoJS.AES.encrypt(req.body.user_public_key, 'randomKEY2019minusculeMAJUSCULE'+salt+'randomgeneratedMESSAGEagain2019');
	}

	return result;
}
