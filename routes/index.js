//const logger = require('../lib/logging.js');
const Router = require('koa-router');
const router = new Router();
const authRouter = require('./auth');
const listsRouter = require('./lists');

router.use(authRouter.routes(), authRouter.allowedMethods());
router.use(listsRouter.routes(), listsRouter.allowedMethods());

router.get('/', async (ctx) => {
	//ctx.isAuthenticated()
	return ctx.render('index', { message: 'root' });
});

// router.get('/', function (req, res, next) {
// 	if (req.user) {
// 		res.redirect('/lists');
// 	} else {
// 		req.prismic.api.getSingle('home-page')
// 		.then(function (document) {
// 			res.render('index', {
// 				document: document,
// 				error: req.flash('error')
// 			});
// 		}, function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// 	}
// });

module.exports = router;
