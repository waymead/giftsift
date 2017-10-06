const logger = require('../lib/logging.js');
const mongoose = require('../model').mongoose;
const List = require('../model').List;
const Gift = require('../model').Gift;
const _ = require('underscore');
const Router = require('koa-router');

const router = new Router({
	prefix: '/lists'
});

router.use(async (ctx, next) => {
	if (ctx.isUnauthenticated()) {
		return ctx.redirect('/auth/login');
	}
	return next();
});

router.get('/', async (ctx, next) => {
	try {
		const lists = await List.findByMember(ctx.state.user);
		return ctx.render('lists/index', { lists: lists });
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.get('/add', async (ctx, next) => {
	return ctx.render('lists/edit', { owner: ctx.state.user });
});

router.get('/edit/:id', async (ctx, next) => {
	try {
		const list = await List.findByIdAndOwner(ctx.params.id, ctx.state.user);
		return ctx.render('lists/edit', {
			list: list,
			owner: ctx.state.user
		});
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.post('/save', async (ctx, next) => {
	var list = {
		name: ctx.request.body.name,
		type: ctx.request.body.type,
		description: ctx.request.body.description,
		notes: ctx.request.body.notes,
		list: ctx.request.body.list,
		owner: ctx.state.user
	};
	if (ctx.request.body.id) {
		list.id = ctx.request.body.id;
		try {
			await List.findOneAndUpdate({ _id: list.id }, list, { new: true });
			return ctx.redirect('/lists');
		} catch (err) {
			logger.error(err);
			return next(err);
		}
	} else {
		try {
			list.members = [ctx.state.user];
			let newList = new List(list);
			newList.id = new mongoose.Types.ObjectId();
			await newList.save();
			return ctx.redirect('/lists');
		} catch (err) {
			logger.error(err);
			return next(err);
		}
	}
});

router.get('/delete/:id', async (ctx, next) => {
	try {
		await List.delete(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists');
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.get('/share/:id/:name?', async (ctx, next) => {
	try {
		const list = await List.findByIdAndOwner(ctx.params.id, ctx.state.user);
		return ctx.render('lists/share', {
			list: list,
			owner: ctx.state.user,
			listLink: process.env.LISTLINK_DOMAIN
		});
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.get('/join/:id', async (ctx, next) => {
	try {
		const list = await List.findById(ctx.params.id);
		return ctx.render('lists/join', {
			list: list
		});
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.post('/join', async (ctx, next) => {
	try {
		await List.join(ctx.request.body.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.request.body.id);
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.get('/leave/:id', async (ctx, next) => {
	try {
		await List.leave(ctx.params.id, ctx.state.user);
		return ctx.redirect('/lists/' + ctx.request.body.id);
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

router.get('/:id', async (ctx, next) => {
	try {
		const list = await List.findByIdAndMember(
			ctx.params.id,
			ctx.state.user
		);
		const gifts = await Gift.findByListId(list.id);
		const sortedGifts = _.sortBy(gifts, function(gift) {
			return gift.owner.displayName;
		});
		const groupedGifts = _.groupBy(sortedGifts, function(gift) {
			return gift.owner.displayName;
		});
		const numGifts = gifts.length;
		return ctx.render('lists/list', {
			list: list,
			gifts: groupedGifts,
			user: ctx.state.user,
			numGifts: numGifts
		});
	} catch (err) {
		logger.error(err);
		return next(err);
	}
});

module.exports = router;
