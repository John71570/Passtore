var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var Password = sequelize.import('../models/password');
var User = sequelize.import('../models/user');
var validator =  require('../services/raw-service');
var uuidv4 = require('uuid/v4');
var cryptoJS = require('crypto-js');
var sha256 = require('sha256');

router.get('/home', function(req, res, next){
	res.redirect('/');
});

router.get('/', function (req, res, next) {
	if(req.session.user){
		res.redirect('/dashboard');
	}else{
		res.redirect('login');
	}
});

router.get('/login', function(req, res, next) {
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('login');
	}
});

router.get('/initiate-session', function(req, res, next) {
	if(!req.session.user){
		req.session.user = req.user;
		req.session.user.user_public_key = cryptoJS.AES.decrypt(req.session.user.user_public_key.toString(), 'randomKEY2019minusculeMAJUSCULE'+req.session.user.user_salt+'randomgeneratedMESSAGEagain2019').toString(cryptoJS.enc.Utf8);
		console.log('Authentication succeed');
		res.redirect('/');
	}else{
		res.redirect('/login');
	}
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/initiate-session',
		failureRedirect: '/login'
	})
);

router.get('/register', function(req, res, next) {
	if(req.session.user){
		res.redirect('/');
	}else{
		res.render('register');
	}
});

router.get('/logout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
});

router.get('/dashboard', function(req, res, next) {

	if(req.session.user){
		Password.findAll({ raw: true, where: { user: req.session.user.user_login } })
			.then( passwords => {
				if (passwords) {
					res.render('dashboard', { passwords: passwords, user_login: req.session.user.user_login });
				} else {
					res.status(404);
					res.render('dashboard');
				}
			})
			.catch(err => {
				res.status(500);
				res.render('error');
			});
	}else{
		res.redirect('/login');
	}

});

router.get('/configurations', function (req, res, next) {
	if(req.session.user){

		User.findOne({ raw: true, where: { user_login: req.session.user.user_login } })
			.then( user => {
				if (user) {
					user.user_public_key = cryptoJS.AES.decrypt(user.user_public_key.toString(), 'randomKEY2019minusculeMAJUSCULE'+user.user_salt+'randomgeneratedMESSAGEagain2019').toString(cryptoJS.enc.Utf8);
					res.render('configurations', {user: user});
				} else {
					res.status(404);
					res.render('dashboard');
				}
			})
			.catch( err => {
				res.status(500);
				res.render('error');
			});

	}else{
		res.redirect('login');
	}
});

router.get('/publickey', function (req, res, next) {
	if(req.session.user){

		User.findOne({ raw: true, where: { user_login: req.session.user.user_login } })
			.then( user => {
				if (user) {
					var publickey = cryptoJS.AES.decrypt(user.user_public_key.toString(), 'randomKEY2019minusculeMAJUSCULE'+user.user_salt+'randomgeneratedMESSAGEagain2019').toString(cryptoJS.enc.Utf8);
					res.status(200);
					res.send({
						"public_key": publickey
					});
				} else {
					res.status(404);
					res.send({
						"error": "UserNotExists",
						"code": 404,
						"message": "The user does not exists"
					});
				}
			})
			.catch( err => {
				res.status(500);
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Problem to check if the user exists"
				});
			});

	}else{
		res.status(500);
		res.send({
			"error": "Unauthorized",
			"code": 500,
			"message": "You are not authorized"
		});
	}
});

router.post('/settings', function (req, res, next) {
	if(req.session.user){

		var bod = req.body;
		var updated = {};

		User.findOne({where: { user_login: req.session.user.user_login } })
			.then( user => {
				if (user) {

					if(req.body.user_password != undefined && req.body.user_passwordB != undefined){

						if(req.body.user_password == req.body.user_passwordB){
							updated['user_password'] = sha256.x2(req.body['user_password']+user.user_salt);
						}else {
							res.status(400);
							res.send({
								"error": "BodyError",
								"code": 400,
								"message": "The passwords are not similar"
							});
						}

					}

					if(req.body.user_email != undefined){
						updated['user_email'] = req.body.user_email;
					}

					user.update(updated).then( result => {
						res.status(200).end();
					}).catch( err => {
						res.status(500);
						res.send(errorResponse.InternalServerError("Problem to update informations : "+err));
					});

				} else {
					res.status(400);
					res.send({
						"error": "UserNotExists",
						"code": 400,
						"message": "No user exists"
					});
				}
			})
			.catch( err => {
				res.status(500);
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": err.message
				});
			});

	}else{
		res.status(500);
		res.send({
			"error": "Unauthorized",
			"code": 500,
			"message": "You are not authorized"
		});
	}
});

router.post('/raw', function(req, res, next) {

	if(req.is('application/json')){

		//req.body.password = cryptoJS.AES.encrypt(req.body.password, req.session.user.user_public_key).toString();
		var newPasswordPromise = Password.build(validator.mapPassword(req, req.session.user.user_login));

		Password.findOne({ where: {
				user : req.session.user.user_login,
				login : validator.checkAndFormat_login(req.body.login),
				password : validator.checkAndFormat_password(req.body.password),
				website : validator.checkAndFormat_website(req.body.website)
			}})
			.then( result =>{
				//If raw does not exist yet
				if(result === null){
					//Save the new role
					Promise.all([newPasswordPromise.save()])
						.then( result => {
							res.status(201);
							res.send({
								"uuid": result[0].uuid
							});
						})
						.catch( err =>{
							res.status(500);
							res.send({
								"error": "InternalServerError",
								"code": 500,
								"message": err
							});
						});
					//If role exists yet
				}else{
					res.status(404);
					res.send({
						"error": "NotTerminated",
						"code": 404,
						"message": "The password raw yet exists"
					});
				}
			})
			.catch( err =>{
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Problem to check if the raw is yet existing"+err.message
				});
			});

	}else{
		res.status(406);
		res.send({
			"error": "BadContentType",
			"code": 406,
			"message": "Content-type received: "+req.get('Content-Type')+". Content-type required : application/json"
		});
	}

});

router.put('/raw/:uuid', function(req, res, next) {

	if(req.is('application/json')){

		Password.findOne({ where: {
				user : req.session.user.user_login,
				uuid : req.params.uuid
			} })
			.then( result =>{

				if (result) {

					//req.body.password = cryptoJS.AES.encrypt(req.body.password, req.session.user.user_public_key).toString();
					result.update(validator.mapPassword(req, req.session.user.user_login)).then( result2 => {
						res.status(204).end();
					}).catch( err => {
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Problem to update the raw : "+err
						});
					});

				} else {
					res.status(404);
					res.send({
						"error": "NotFound",
						"code": 404,
						"message": "The role does not exist"
					});
				}
			})
			.catch( err =>{
				res.send({
					"error": "InternalServerError",
					"code": 500,
					"message": "Problem to check if the raw is yet existing"+err
				});
			});

	}else{
		res.status(406);
		res.send({
			"error": "BadContentType",
			"code": 406,
			"message": "Content-type received: "+req.get('Content-Type')+". Content-type required : application/json"
		});
	}

});

router.delete('/raw/:uuid', function(req, res, next) {

	Password.destroy({ where: {
			user : req.session.user.user_login,
			uuid : req.params.uuid
		}})
		.then( result => {
			if (result > 0) {
				res.status(204).end();
			} else {
				res.status(404);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "The password does not exist"
				});
			}
		})
		.catch(err => {
			res.status(500);
			res.send({
				"error": "InternalServerError",
				"code": 500,
				"message": "Problem to delete the raw : "+err.message
			});
		});
});


module.exports = router;
