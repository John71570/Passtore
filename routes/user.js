var express = require('express');
var router = express.Router();
var passport = require('passport');
var sequelize = require('../config/config-database').sequelize;
var User = sequelize.import('../models/user');
var validator =  require('../services/user-service');

router.get('/', function(req, res, next) {

	User.findOne({ raw: true, where: { user_login: "john" } })
		.then( user => {
			if (user) {
				res.render('configurations', { user: userInfo });
			} else {
				res.status(404);
				res.render('dashboard');
			}
		})
		.catch( err => {
			res.status(500);
			res.render('error');
		});

});

router.post('/', function(req, res, next) {

	//if(req.is('application/json')){
		var bod = req.body;
		console.log(typeof bod);

		if(req.body.user_password != undefined && req.body.user_passwordB != undefined && req.body.user_email != undefined && req.body.user_public_keyB != undefined && req.body.user_public_key != undefined && req.body.user_login != undefined){
			console.log(2);
			if(req.body.user_password == req.body.user_passwordB){
				console.log(3);
				if(req.body.user_public_key == req.body.user_public_keyB){

					User.findOne({ where: {
							user_login: req.body.user_login,
						}})
						.then( result => {
							console.log(5);
							//If raw does not exist yet
							if(result == null){
								console.log(6);
								//Save the new role
								User.create(validator.mapUser(req))
									.then( result2 => {
										console.log(7);
										res.status(201).end();
									})
									.catch( err =>{
										console.log(8);
										res.status(500);
										res.send({
											"error": "InternalServerError",
											"code": 500,
											"message": ":"+err
										});
									});
								//If role exists yet
							}else{
								console.log(9);
								res.status(409);
								res.send({
									"error": "UserAlreadyExist",
									"code": 409,
									"message": "The user yet exists"
								});
							}
						})
						.catch( err =>{
							console.log(10);
							res.send({
								"error": "InternalServerError",
								"code": 500,
								"message": "Problem to check if the raw is yet existing"+err.message
							});
						});

				}else{
					res.status(400);
					res.send({
						"error": "BodyError",
						"code": 400,
						"message": "The keys are not similar"
					});
				}

			}else{
				res.status(400);
				res.send({
					"error": "BodyError",
					"code": 400,
					"message": "The passwords are not similar"
				});
			}

		}else{
			res.status(400);
			res.send({
				"error": "BodyError",
				"code": 400,
				"message": "One or many fields ares missing"
			})
		}

	/*}else{
		res.status(406);
		res.send({
			"error": "BadContentType",
			"code": 406,
			"message": "Content-type received: "+req.get('Content-Type')+". Content-type required : application/json"
		});
	}*/

});

router.put('/', function(req, res, next) {

	if(req.is('application/json')){

		User.findOne({ where: {
				user_login : "userJ"
			} })
			.then( result =>{

				if (result) {

					req.body.user_login = "userJ";
					result.update(validator.mapUser(req)).then( result2 => {
						res.status(204).end();
					}).catch( err => {
						res.status(500);
						res.send({
							"error": "InternalServerError",
							"code": 500,
							"message": "Problem to update the user : "+err
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

router.delete('/', function(req, res, next) {

	User.destroy({ where: {
			user_login : "john",
		}})
		.then( result => {
			if (result > 0) {
				res.status(204).end();
			} else {
				res.status(404);
				res.send({
					"error": "NotFound",
					"code": 404,
					"message": "The user does not exist"
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
