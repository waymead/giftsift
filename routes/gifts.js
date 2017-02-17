'use strict';
var logger = require('../lib/logging.js');
var List = require('../model/aiwf.js').List;
var Gift = require('../model/aiwf.js').Gift;

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/manage', ensureLoggedIn, function (req, res, next) {
	Gift.find({ owner: req.user.email }, {}, { sort: 'name' })
		.populate('list')
		.then(function (gifts) {
			res.render('gifts/manage', { gifts: gifts });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/add', ensureLoggedIn, function (req, res, next) {
	List.find({ members: req.user.email }, {}, { sort: 'name' })
		.then(function (lists) {
			res.render('gifts/edit', { lists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/edit/:id', ensureLoggedIn, function (req, res, next) {
	var theGift;
	Gift.findOne({ _id: req.params.id, owner: req.user.email })
		.populate('list', 'name', null, { sort: 'name' })
		.exec()
		.then(function (gift) {
			if (gift == null) {
				var err = new Error();
				err.status = 404;
				throw err;
			}
			theGift = gift;
			return List.find({ members: req.user.email });
		})
		.then(function (lists) {
			res.render('gifts/edit', { gift: theGift, lists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.post('/save', ensureLoggedIn, function (req, res, next) {
	var gift = new Gift(req.body);
	if (!req.body.id) {
		gift.owner = req.user.email;
		gift.ownerName = req.user.name;
		gift.save()
			.then(function (gift) {
				logger.info('Gift created', { gift: gift.name });
				return List.update({ _id: { $in: gift.list } }, { $addToSet: { gifts: gift.id } }, { multi: true, new: false });
			})
			.then(function () {
				res.redirect('/lists/' + gift.list[0]);
			})
			.catch(function (err) {
				return next(err);
			});
	} else {
		var theGift;
		Gift.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
			.then(function (gift) {
				theGift = gift;
				return List.update({ _id: { $in: gift.list } }, { $addToSet: { gifts: gift.id } }, { multi: true, new: false });
			})
			.then(function () {
				res.redirect('/lists/' + theGift.list[0]);
			})
			.catch(function (err) {
				return next(err);
			});
	}
});

router.get('/delete/:id', ensureLoggedIn, function (req, res, next) {
	var listId;
	Gift.findOneAndRemove({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function (gift) {
			listId = gift.list[0];
			return List.update({ _id: { $in: gift.list } }, { $pull: { gifts: gift.id } }, { multi: true, new: false });
		})
		.then(function () {
			res.redirect('/lists/' + listId);
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/buy/:id/:list', ensureLoggedIn, function (req, res, next) {
	Gift.findOneAndUpdate({ _id: req.params.id }, { $set: { boughtBy: req.user.email } })
		.populate('list')
		.exec()
		.then(function () {
			res.redirect('/lists/' + req.params.list);
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/replace/:id/:list', ensureLoggedIn, function (req, res, next) {
	Gift.findOneAndUpdate({ _id: req.params.id }, { $unset: { boughtBy: 1 } })
		.populate('list')
		.exec()
		.then(function () {
			res.redirect('/lists/' + req.params.list);
		})
		.catch(function (err) {
			return next(err);
		});
});

module.exports = router;