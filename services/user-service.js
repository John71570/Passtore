//------------------------ List all fields of the table -----------------------------
let fields = ['user_login', 'user_password', 'user_public_key', 'user_email'];


//------------------------ Define all methods that can check and format each field -----------------------------
module.exports.checkAndFormat_user_login = function(value){
	return value;
};

module.exports.checkAndFormat_user_password = function(value){
	return value;
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

	for (var key in req.body) {
		console.log(key);
		if (req.body.hasOwnProperty(key) && fields.includes(key)) {
			result[key] = checkAndFormatCallable[key](req.body[key]);
		}
	}

	return result;
}
