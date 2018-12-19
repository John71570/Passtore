var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var Password = sequelize.import('../models/password');
var validator =  require('../services/raw-service');
var uuidv4 = require('uuid/v4');


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

router.post('/raw', function(req, res, next) {

	if(req.is('application/json')){

		var newPasswordPromise = Password.build(validator.mapPassword(req, "john"));

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

					result.update(validator.mapPassword(req)).then( result2 => {
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
