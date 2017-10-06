const logger = require('../lib/logging.js');
const mongoose = require('../model').mongoose;
const List = require('../model').List;
const Gift = require('../model').Gift;
const _ = require('underscore');
const Router = require('koa-router');

const router = new Router({
	prefix: '/lists'
});

//const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/', async (ctx, next) => {
	//return ctx.render('lists/index', { message: 'root' });
	await List.findByMember(ctx.state.user)
		.then(function(lists) {
			return ctx.render('lists/index', { lists: lists });
		})
		.catch(function(err) {
			return next(err);
		});
});

// router.get('/add', ensureLoggedIn, function (req, res) {
// 	res.render('lists/edit', { owner: req.user });
// });

// router.get('/edit/:id', ensureLoggedIn, function (req, res, next) {
// 	List.findByIdAndOwner(req.params.id, req.user)
// 		.then(function (list) {
// 			if (list == null) {
// 				var err = new Error();
// 				err.status = 404;
// 				throw err;
// 			}
// 			res.render('lists/edit', { list: list, owner: req.user });
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

// router.post('/save', ensureLoggedIn, function (req, res, next) {
// 	var list = {
// 		name: req.body.name,
// 		type: req.body.type,
// 		description: req.body.description,
// 		notes: req.body.notes,
// 		list: req.body.list,
// 		owner: req.user
// 	};
// 	if (req.body.id) {
// 		list.id = req.body.id;
// 		List.findOneAndUpdate({ _id: list.id }, list, { new: true })
// 			.then(function () {
// 				res.redirect('/lists');
// 			})
// 			.catch(function (err) {
// 				logger.error(err);
// 				return next(err);
// 			});
// 	} else {
// 		list.members = [req.user];
// 		let newList = new List(list);
// 		newList.id = new mongoose.Types.ObjectId;
// 		newList.save()
// 			.then(function () {
// 				res.redirect('/lists');
// 			})
// 			.catch(function (err) {
// 				logger.error(err);
// 				return next(err);
// 			});
// 	}
// });

// router.get('/delete/:id', ensureLoggedIn, function (req, res, next) {
// 	List.delete(req.params.id, req.user)
// 		.then(function () {
// 			res.redirect('/lists');
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

// router.get('/share/:id/:name?', ensureLoggedIn, function (req, res, next) {
// 	List.findByIdAndOwner(req.params.id, req.user)
// 		.then(function (list) {
// 			res.render('lists/share', { list: list, owner: req.user, listLink: process.env.LISTLINK_DOMAIN });
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

// router.get('/join/:id', ensureLoggedIn, function (req, res, next) {
// 	List.findById(req.params.id)
// 		.then(function (list) {
// 			res.render('lists/join', { list: list });
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

// router.post('/join', ensureLoggedIn, function (req, res, next) {
// 	List.join(req.body.id, req.user)
// 		.then(function () {
// 			res.redirect('/lists/' + req.body.id);
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

// router.get('/leave/:id', ensureLoggedIn, function (req, res, next) {
// 	List.leave(req.params.id, req.user)
// 		.then(function () {
// 			res.redirect('/lists');
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

// router.get('/:id', ensureLoggedIn, function (req, res, next) {
// 	var theList;
// 	var numGifts;
// 	List.findByIdAndMember(req.params.id, req.user)
// 		.then(function (list) {
// 			theList = list;
// 			return Gift.findByListId(list.id);
// 		})
// 		.then(function (gifts) {
// 			let sortedGifts = _.sortBy(gifts, function (gift) { return gift.owner.displayName; });
// 			let groupedGifts = _.groupBy(sortedGifts, function (gift) { return gift.owner.displayName; });
// 			numGifts = gifts.length;
// 			res.render('lists/list', { list: theList, gifts: groupedGifts, user: req.user, numGifts: numGifts });
// 		})
// 		.catch(function (err) {
// 			logger.error(err);
// 			return next(err);
// 		});
// });

module.exports = router;
