const passport = require('koa-passport');
const Router = require('koa-router');
const router = new Router(
	{
		prefix: '/auth'
	}
);

router.get('/login', async (ctx) => {
	//passport.authenticate('auth0'), () => {
	const env = {
		AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
		AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
		AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
	};
	ctx.state.env = env;
	return ctx.render('login', { message: 'auth' });

	//};
});

router.get('/logout', async (ctx) => {
	ctx.logout();
	ctx.redirect('/');
});

router.get(
	'/callback',
	passport.authenticate('auth0', {
		successRedirect: '/',
		failureRedirect: '/login'
	})

	//return ctx.render('index', {});
);

// router.get('/callback',
// 	passport.authenticate('auth0'), (req, res) => {
// 		let returnTo = req.session.returnTo || '/';
// 		delete req.session.returnTo;
// 		res.redirect(returnTo);
// 	});

// router.get('/logout', function (req, res) {
// 	req.logout();
// 	res.redirect('/');
// });

module.exports = router;
