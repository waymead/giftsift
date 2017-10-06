require('dotenv').load({
	silent: true
});
//require('newrelic');
//require('./model');

//const logger = require('./lib/logging.js');

//const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const helmet = require('koa-helmet');
const favicon = require('koa-favicon');
//const morgan = require('morgan');
//const cookieParser = require('cookie-parser');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const views = require('koa-views');
const redisStore = require('koa-redis');

//const prismic = require('./lib/prismic');

const app = new Koa();
app.use(static('public', {}));

app.use(helmet());
// app.use(
// 	helmet.referrerPolicy({
// 		policy: 'unsafe-url'
// 	})
// );

//app.use(cookieParser());
//app.use(morgan('combined'));
app.use(bodyParser());
app.use(favicon(__dirname + '/public/images/logo.png'));

app.keys = ['your-session-secret'];
app.use(session({
	store: redisStore()
}, app));

require('./lib/auth0-strategy');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

//app.use(prismic);

app.use(views(__dirname + '/views', { extension: 'pug' }));

const router = require('./routes');

app.use(router.routes());
app.use(router.allowedMethods());

//app.use(require('./lib/middleware.js'));

// app.use('/', require('./routes'));
// app.use('/lists', require('./routes/lists'));
// app.use('/gifts', require('./routes/gifts'));
// app.use('/admin', require('./routes/admin'));
// app.use('/auth', require('./routes/auth'));

app.use(favicon(__dirname + '/public/favicon.ico'));

// app.use(function (req, res, next) {
// 	res.status(404);
// 	res.render('notfound');
// 	next();
// });

// app.use(function (err, req, res, next) {
// 	//logger.error(err.stack);
// 	if (err.status == 404) {
// 		res.status(404);
// 		res.render('notfound', {});
// 		next();
// 	} else {
// 		res.status(err.status || 500);
// 		res.render('error', {
// 			message: err.message,
// 			error: {}
// 		});
// 		next();
// 	}
// });

app.listen(process.env.PORT);
