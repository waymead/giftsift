const logger = require('../lib/logging.js');
//const service = require('../lib/giftsiftService.js');
const List = require('../model').List;
const Gift = require('../model').Gift;

const express = require('express');
const router = express.Router();

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/add/:listId', ensureLoggedIn, function (req, res, next) {
	List.findByMember(req.user)
		.then(function (lists) {
			res.render('gifts/edit', { lists: lists, listId: req.params.listId, owner: req.user });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/edit/:id/:listId', ensureLoggedIn, function (req, res, next) {
	var theGift;
	Gift.findByIdAndOwner(req.params.id, req.user)
		.then(function (gift) {
			if (gift == null) {
				var err = new Error();
				err.status = 404;
				throw err;
			}
			theGift = gift;
			return List.findByMember(req.user);
		})
		.then(function (lists) {
			res.render('gifts/edit', { gift: theGift, lists: lists, listId: req.params.listId, owner: req.user });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.post('/save/:listId', ensureLoggedIn, function (req, res, next) {
	var gift = {
		name: req.body.name,
		url: req.body.url,
		image: req.body.image,
		type: req.body.type,
		lists: req.body.lists,
		owner: req.user
	};
	if (req.body.id) {
		gift.id = req.body.id;
		Gift.findOneAndUpdate({ _id: gift.id}, gift, { new: true })
			.then(function (gift) {
				res.redirect('/lists/' + req.params.listId + '#' + gift.name);
			})
			.catch(function (err) {
				return next(err);
			});
	} else {
		newGift = new Gift(gift);
		newGift.id = new mongoose.Types.ObjectId;
		newGift.save()
			.then(function (gift) {
				res.redirect('/lists/' + req.params.listId + '#' + gift.name);
			})
			.catch(function (err) {
				logger.error(err);
				return next(err);
			});
	}
});

router.get('/delete/:id/:listId', ensureLoggedIn, function (req, res, next) {
	Gift.delete(req.params.id, req.user)
		.then(function (gift) {
			res.redirect('/lists/' + req.params.listId + '#' + gift.name);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/undelete/:id/:listId', ensureLoggedIn, function (req, res, next) {
	Gift.undelete(req.params.id, req.user)
		.then(function (gift) {
			res.redirect('/lists/' + req.params.listId + '#' + gift.name);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/buy/:id/:listId', ensureLoggedIn, function (req, res, next) {
	Gift.buy(req.params.id, req.user)
		.then(function () {
			res.redirect('/lists/' + req.params.listId);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/replace/:id/:listId', ensureLoggedIn, function (req, res, next) {
	Gift.replace(req.params.id, req.user)
		.then(function () {
			res.redirect('/lists/' + req.params.listId);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

module.exports = router;