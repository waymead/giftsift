require('dotenv').load({
	silent: true
});

//const logger = require('./lib/logging.js');

const Koa = require('koa');
const static = require('koa-static');
const helmet = require('koa-helmet');
const favicon = require('koa-favicon');
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

app.use(async (ctx, next) => {
	try {
		await next();
		if (ctx.status === 404) {
			return ctx.render('error', {message: '404'});
		}
	} catch (err) {
		ctx.status = 400;
		ctx.app.emit('error', err, ctx);
		return ctx.render('error', { message: err });
	}
});

const router = require('./routes');
app.use(router.routes());
app.use(router.allowedMethods());

//app.use(require('./lib/middleware.js'));

app.listen(process.env.PORT);
