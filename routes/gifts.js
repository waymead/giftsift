const logger = require('../lib/logging.js');
const mongoose = require('../model').mongoose;
const List = require('../model').List;
const Gift = require('../model').Gift;

const Router = require('koa-router');
const router = new Router({
	prefix: '/gifts'
});

router.use(async (ctx, next) => {
	if (ctx.isUnauthenticated()) {
		return ctx.redirect('/auth/login');
	}
	return next();
});

router.get('/add/:listId', async (ctx, next) => {
	try {
		const lists = await List.findByMember(ctx.state.user);
		return ctx.render('gifts/edit', { lists: lists, listId: ctx.params.listId, owner: ctx.state.user });
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// List.findByMember(req.user)
	// 	.then(function (lists) {
	// 		res.render('gifts/edit', { lists: lists, listId: req.params.listId, owner: req.user });
	// 	})
	// 	.catch(function (error) {
	// 		logger.error(error);
	// 		return next(error);
	// 	});
});

router.get('/edit/:id/:listId', async (ctx, next) => {
	try {
		const gift = await Gift.findByIdAndOwner(ctx.params.id, ctx.state.user);
		const lists = await List.findByMember(ctx.state.user);
		return ctx.render('gifts/edit', { gift: gift, lists: lists, listId: ctx.params.listId, owner: ctx.state.user });
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// var theGift;
	// Gift.findByIdAndOwner(ctx.params.id, ctx.state.user)
	// 	.then(function (gift) {
	// 		if (gift == null) {
	// 			var error = new error();
	// 			error.status = 404;
	// 			throw error;
	// 		}
	// 		theGift = gift;
	// 		return List.findByMember(req.user);
	// 	})
	// 	.then(function (lists) {
	// 		res.render('gifts/edit', { gift: theGift, lists: lists, listId: req.params.listId, owner: req.user });
	// 	})
	// 	.catch(function (error) {
	// 		logger.error(error);
	// 		return next(error);
	// 	});
});

router.post('/save/:listId', async (ctx, next) => {
	try {
		var newGift = {
			name: ctx.request.body.name,
			url: ctx.request.body.url,
			image: ctx.request.body.image,
			type: ctx.request.body.type,
			lists: ctx.request.body.lists,
			owner: ctx.state.user
		};
		if (ctx.request.body.id) {
			newGift.id = ctx.request.body.id;
			const gift = await Gift.findOneAndUpdate({ _id: newGift.id }, newGift, { new: true });
			return ctx.redirect('/lists/' + ctx.params.listId + '#' + gift.name);
		} else {
			let giftObj = new Gift(newGift);
			giftObj.id = new mongoose.Types.ObjectId;
			const gift = await giftObj.save();
			return ctx.redirect('/lists/' + ctx.params.listId + '#' + gift.name);
		}
	} catch (error) {
		logger.error(error);
		return next(error);
	}
});

router.get('/delete/:id/:listId', async (ctx, next) => {
	try {
		const gift = await Gift.delete(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId + '#' + gift.name);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// Gift.delete(req.params.id, req.user)
	// 	.then(function (gift) {
	// 		res.redirect('/lists/' + req.params.listId + '#' + gift.name);
	// 	})
	// 	.catch(function (error) {
	// 		logger.error(error);
	// 		return next(error);
	// 	});
});

router.get('/undelete/:id/:listId', async (ctx, next) => {
	try {
		const gift = await Gift.undelete(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId + '#' + gift.name);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// Gift.undelete(req.params.id, req.user)
	// 	.then(function (gift) {
	// 		res.redirect('/lists/' + req.params.listId + '#' + gift.name);
	// 	})
	// 	.catch(function (error) {
	// 		logger.error(error);
	// 		return next(error);
	// 	});
});

router.get('/buy/:id/:listId', async (ctx, next) => {
	try {
		await Gift.buy(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// Gift.buy(req.params.id, req.user)
	// 	.then(function () {
	// 		res.redirect('/lists/' + req.params.listId);
	// 	})
	// 	.catch(function (error) {
	// 		logger.error(error);
	// 		return next(error);
	// 	});
});

router.get('/replace/:id/:listId', async (ctx, next) => {
	try {
		await Gift.replace(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
	// Gift.replace(req.params.id, req.user)
	// 	.then(function () {
	// 		res.redirect('/lists/' + req.params.listId);
	// 	})
	// 	.catch(function (error) {
	// 		logger.error(error);
	// 		return next(error);
	// 	});
});

module.exports = router;