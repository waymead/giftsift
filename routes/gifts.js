const logger = require('../lib/logging.js');
const service = require('../lib/giftsiftService.js');

const express = require('express');
const router = express.Router();

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/add/:listId', ensureLoggedIn, function (req, res, next) {
	service.getListsByMember(req.user.email)
		.then(function (lists) {
			res.render('gifts/edit', { lists: lists, listId: req.params.listId, owner: req.user.email });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/edit/:id/:listId', ensureLoggedIn, function (req, res, next) {
	var theGift;
	service.getGiftByIdAndOwner(req.params.id, req.user.email)
		.then(function (gift) {
			if (gift == null) {
				var err = new Error();
				err.status = 404;
				throw err;
			}
			theGift = gift;
			return service.getListsByMember(req.user.email);
		})
		.then(function (lists) {
			res.render('gifts/edit', { gift: theGift, lists: lists, listId: req.params.listId, owner: req.user.email });
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
		list: req.body.list,
		owner: req.user.email,
		ownerName: req.user.name
	};
	if (req.body.id) {
		gift.id = req.body.id;
		service.saveGift(gift)
			.then(function (gift) {
				res.redirect('/lists/' + req.params.listId + '#' + gift.name);
			})
			.catch(function (err) {
				return next(err);
			});
	} else {
		service.createGift(gift)
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
	service.deleteGift(req.params.id, req.user.email)
		.then(function (gift) {
			res.redirect('/lists/' + req.params.listId + '#' + gift.name);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/undelete/:id/:listId', ensureLoggedIn, function (req, res, next) {
	service.undeleteGift(req.params.id, req.user.email)
		.then(function (gift) {
			res.redirect('/lists/' + req.params.listId + '#' + gift.name);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/buy/:id/:listId', ensureLoggedIn, function (req, res, next) {
	service.buyGift(req.params.id, req.user.email)
		.then(function () {
			res.redirect('/lists/' + req.params.listId);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/replace/:id/:listId', ensureLoggedIn, function (req, res, next) {
	service.replaceGift(req.params.id, req.user.email)
		.then(function () {
			res.redirect('/lists/' + req.params.listId);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

module.exports = router;