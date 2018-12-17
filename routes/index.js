var express = require('express');
var router = express.Router();
var sequelize = require('../config/config-database').sequelize;

router.get('/', function(req, res, next) {


	res.render('dashboard');

});

router.post('/raw', function(req, res, next) {

	res.send('yes');

});



module.exports = router;
