var express = require('express');
var connect = require('connect');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var itemManager = require('./routes/itemManager');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(session({
	secret : settings.cookieSecret,
	store : new MongoStore({
		url : settings.url
	}),
	resave : true,
	saveUninitialized : true,
}));
app.use(cookieParser());
app.use(session({
	secret : settings.cookieSecret,
	store : new MongoStore({
		url : settings.url
	}),
	resave : true,
	saveUninitialized : true,
}));

app.use(function(req, res, next) {
	res.locals.user = req.session.user;

	// var error = req.session.error;
	// var success = req.session.success;
	if(req.session.edit !== undefined){
		console.info('edit ' + req.session.edit.code);
	}
	res.locals.edit = (req.session.edit !== null) ? req.session.edit : null;
	res.locals.category = (req.session.category !== null) ? req.session.category : null;
	res.locals.error = (req.session.error !== null) ? req.session.error : null;
	res.locals.success = (req.session.success !== null) ? req.session.success
			: null;
	console.info('error ' + res.locals.error);
	console.info('success ' + res.locals.success);
	req.session.error = null;
	req.session.success = null;

	next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use('/itemManager',itemManager);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

module.exports = app;