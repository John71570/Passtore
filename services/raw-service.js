var uuidv4 = require('uuid/v4');

//------------------------ List all fields of the table -----------------------------
let fields = ['login', 'password', 'website', 'comment'];


//------------------------ Define all methods that can check and format each field -----------------------------
module.exports.checkAndFormat_login = function(value){
	return value;
};

module.exports.checkAndFormat_password = function(value){
	return value;
};

module.exports.checkAndFormat_website = function(value){
	return value;
};

module.exports.checkAndFormat_comment = function(value){
	return value;
};


//------------------------ Make all previous methods callable -----------------------------
var checkAndFormatCallable = {
	login : this.checkAndFormat_login,
	password : this.checkAndFormat_password,
	website : this.checkAndFormat_website,
	comment: this.checkAndFormat_comment
};


//------------------------ The most important function that map request to an object well formed for the database -----------------------------
module.exports.mapPassword = function(req, user) {

	let result = {
		uuid: uuidv4(),
		user: user
	};

	for (var key in req.body) {
		if (req.body.hasOwnProperty(key) && fields.includes(key)) {
			result[key] = checkAndFormatCallable[key](req.body[key]);
		}
	}

	return result;

}
