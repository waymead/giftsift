const logger = require('../lib/logging');
const Router = require('koa-router');
const router = new Router();
const authRouter = require('./auth');
const listsRouter = require('./lists');
const giftsRouter = require('./gifts');
const adminRouter = require('./admin');

router.get('/', async (ctx, next) => {
	try {
		if (ctx.isAuthenticated()) {
			return ctx.redirect('/lists');
		} else {
			return ctx.render('index', { });
		}
	} catch (error) {
		logger.error(error);
		return next(error);
	}
});

router.use(authRouter.routes(), authRouter.allowedMethods());
router.use(listsRouter.routes(), listsRouter.allowedMethods());
router.use(giftsRouter.routes(), giftsRouter.allowedMethods());
router.use(adminRouter.routes(), adminRouter.allowedMethods());

module.exports = router;
