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
				console.log('AUTH: '+user.user_login+user.user_password);
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (user.user_password != password) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
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