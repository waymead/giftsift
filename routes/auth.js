const passport = require('koa-passport');
const Router = require('koa-router');
const router = new Router(
	{
		prefix: '/auth'
	}
);

router.get('/login', async (ctx) => {
	ctx.state.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
	ctx.state.AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
	ctx.state.AUTH0_CALLBACK_URL = ctx.origin + '/auth/callback';
	return ctx.render('login', { message: 'auth' });
});

router.get('/logout', async (ctx) => {
	ctx.logout();
	ctx.redirect('/');
});

router.get(
	'/callback',
	passport.authenticate('auth0', {
		successRedirect: '/',
		failureRedirect: '/login'.anchor,
		callbackURL: '/auth/callback'
	})
);
module.exports = router;
