var passport = require('passport');
var LocalStrategy = require('passport-local');
var sequelize = require('../config/config-database').sequelize;
var User = sequelize.import('../models/user');
var validator =  require('../services/raw-service');
var sha256 = require('sha256');

let localAuthenticationConfiguration = passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function(login, password, done) {
		User.findOne({ raw: true, where: { user_login: login }})
			.then( user => {

				setTimeout(function () {

					if (!user) {
						return done(null, false, {message: 'Incorrect username.'});
					}
					if (user.user_password != sha256.x2(password + user.user_salt)) {
						return done(null, false, {message: 'Incorrect password.'});
					}
					return done(null, user);

				}, 3000);

			})
			.catch( err => {
				return done(err);
			});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

module.exports = {
	localAuthenticationConfiguration: localAuthenticationConfiguration
}