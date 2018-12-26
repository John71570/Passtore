var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');

var https = require('https');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

https.createServer({
    key: fs.readFileSync('./config/key.pem'),
	cert: fs.readFileSync('./config/cert.pem')
}, app).listen(3001);

//------------------------------ All required modules from Planizi repository -----------------------------------
var authenticationConfig = require('./config/config-authentication');
authenticationConfig.localAuthenticationConfiguration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: "key"
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('vendor',express.static(path.join(__dirname,'public/vendor')));
app.use('css',express.static(path.join(__dirname,'public/css')));
app.use('js',express.static(path.join(__dirname,'public/js')));
app.use('scss',express.static(path.join(__dirname,'public/scss')));
app.use('lib',express.static(path.join(__dirname,'public/lib')));
app.use('javascripts',express.static(path.join(__dirname,'public/javascripts')));

app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err+" --- "+err.message);
});

module.exports = app;