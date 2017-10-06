var logger = require('../lib/logging.js');
var List = require('../model').List;
var Gift = require('../model').Gift;

const Router = require('koa-router');
const router = new Router({
	prefix: '/admin'
});

router.use(async (ctx, next) => {
	if (ctx.isUnauthenticated()) {
		return ctx.redirect('/auth/login');
	}
	return next();
});

// router.use(function (req, res, next) {
// 	if (req.user && req.user.roles && req.user.roles.indexOf('admin') >= 0) {
// 		next();
// 	} else {
// 		res.sendStatus(403);
// 	}

// });

router.get('/', async (ctx, next) => {
	try {
		var lists = await List.find({}, {}, { sort: 'name' });
		var gifts = await Gift.find({}, {}, { sort: 'name' });
		return ctx.render('admin/index', { lists: lists, gifts: gifts });
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// var allLists;
	// List.find({}, {}, { sort: 'name' })
	// 	.then(function (lists) {
	// 		allLists = lists;
	// 		return Gift.find({}, {}, { sort: 'name' });
	// 	})
	// 	.then(function (gifts) {
	// 		res.render('admin/index', { lists: allLists, gifts: gifts });
	// 	})
	// 	.catch(function (err) {
	// 		logger.error(err);
	// 	});
});

router.get('/lists', async (ctx, next) => {
	try {
		var lists = await List.find({}, {}, { sort: 'name' });
		return ctx.render('admin/lists', { lists: lists });
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// List.find({}, {}, { sort: 'name' })
	// 	.then(function (lists) {
	// 		res.render('admin/lists', { lists: lists });
	// 	})
	// 	.catch(function (err) {
	// 		logger.error(err);
	// 	});
});

module.exports = router;