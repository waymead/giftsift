require('dotenv').load({
	silent: true
});

const Koa = require('koa');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const favicon = require('koa-favicon');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const views = require('koa-views');
const redisStore = require('koa-redis');

const app = new Koa();
app.use(serve('public', {}));

app.use(helmet());
// app.use(
// 	helmet.referrerPolicy({
// 		policy: 'unsafe-url'
// 	})
// );

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

app.use(views(__dirname + '/views', { extension: 'pug' }));

// Error handling
app.use(require('./lib/middleware').errorHandler);

const router = require('./routes');
app.use(router.routes());
app.use(router.allowedMethods());

//app.use(require('./lib/middleware.js'));

app.listen(process.env.PORT);

module.exports = app;
