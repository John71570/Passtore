var passport = require('passport');
var LocalStrategy = require('passport-local');
var sequelize = require('../config/config-database').sequelize;
var User = sequelize.import('../models/user');
var validator =  require('../services/raw-service');

let localAuthenticationConfiguration = passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function(login, password, done) {
		User.findOne({ raw: true, where: { user_login: login }})
			.then( user => {
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (user.password != password) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			})
			.catch( err => {
				return done(err);
			});
	}
));

module.exports = {
	localAuthenticationConfiguration: localAuthenticationConfiguration
}