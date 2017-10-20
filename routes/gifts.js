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
});

router.post('/save/:listId', async (ctx, next) => {
	try {
		var newGift = {
			name: ctx.request.body.name,
			url: ctx.request.body.url,
			image: ctx.request.body.image,
			type: ctx.request.body.type,
			lists: ctx.request.body.lists,
			notes: ctx.request.body.notes,
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
});

router.get('/undelete/:id/:listId', async (ctx, next) => {
	try {
		const gift = await Gift.undelete(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId + '#' + gift.name);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
});

router.get('/buy/:id/:listId', async (ctx, next) => {
	try {
		await Gift.buy(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
});

router.get('/replace/:id/:listId', async (ctx, next) => {
	try {
		await Gift.replace(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.params.listId);
	} catch (error) {
		logger.error(error);
		return next(error);
	}
});

module.exports = router;