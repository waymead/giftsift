'use strict';

require('dotenv').load({
	silent: true
});
require('newrelic');
require('./model');

var logger = require('./lib/logging.js');

var path = require('path');
var express = require('express');
var helmet = require('helmet');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var passport = require('passport');
var strategy = require('./lib/auth0');

passport.use(strategy);

var app = express();
app.use(cookieParser());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(favicon(__dirname + '/public/images/logo.png'));
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ['\'self\''],
		styleSrc: ['\'self\'', 'cdnjs.cloudflare.com', 'code.getmdl.io', 'fonts.googleapis.com'],
		scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'ajax.cloudflare.com', 'cdnjs.cloudflare.com', 'code.getmdl.io', 'js-agent.newrelic.com', 'ssl.google-analytics.com'],
		fontSrc: ['\'self\'', 'fonts.gstatic.com']
	}
}));

app.use(session({
	store: new RedisStore({
		url: process.env.REDIS_URL
	}),
	cookie: {
		secure: process.env.NODE_ENV == 'production',
		httpOnly: true
	},
	secret: process.env.REDIS_SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	name: 'session.id'
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('./lib/middleware.js'));

app.use('/', require('./routes'));
app.use('/lists', require('./routes/lists'));
app.use('/gifts', require('./routes/gifts'));
app.use('/admin', require('./routes/admin'));
app.use('/auth', require('./routes/auth'));

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
	res.status(404);
	res.render('notfound');
	next();
});

app.use(function (err, req, res, next) {
	logger.error(err.stack);
	if (err.status == 404) {
		res.status(404);
		res.render('notfound', {});
		next();
	} else {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
		next();
	}
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
	logger.log('info', 'Node app is running at localhost:' + app.get('port'));
});