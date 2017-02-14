'use strict';
var _ = require('underscore');

var logger = require('../lib/logging.js');
var List = require('../model/aiwf.js').List;
var Gift = require('../model/aiwf.js').Gift;

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/', ensureLoggedIn, function (req, res, next) {
	List.find({ members: req.user.email }, {}, { sort: 'name' })
		.then(function (lists) {
			res.render('lists/index', { lists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/manage', ensureLoggedIn, function (req, res, next) {
	var ownedLists;
	List.find({ owner: req.user.email }, {}, { sort: 'name' })
		.then(function (lists) {
			ownedLists = lists;
			return List.find({ members: req.user.email }, {}, { sort: 'name' });
		})
		.then(function (lists) {
			res.render('lists', { ownedLists: ownedLists, memberOfLists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/add', ensureLoggedIn, function (req, res) {
	res.render('lists/edit', { owner: req.user.email });
});

router.get('/edit/:id', ensureLoggedIn, function (req, res, next) {
	List.findOne({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function (list) {
			res.render('lists/edit', { list: list, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.post('/save', ensureLoggedIn, function (req, res, next) {
	var list = new List(req.body);
	list.owner = req.user.email;
	list.ownerName = req.user.name;
	list.members = [req.user.email];
	if (!req.body.id) {
		list.save()
			.then(function (list) {
				logger.info('List created', { list: list.name });
				res.redirect('/lists?new=true');
			})
			.catch(function (err) {
				return next(err);
			});
	} else {
		List.findOneAndUpdate({ _id: req.body.id }, req.body, { new: false })
			.then(function () {
				res.redirect('/lists');
			})
			.catch(function (err) {
				return next(err);
			});
	}
});

router.get('/delete/:id', ensureLoggedIn, function (req, res, next) {
	List.findOneAndRemove({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function (list) {
			return Gift.find({ list: list.id }).remove();
		})
		.then(function () {
			res.redirect('/lists');
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/share/:id/:name?', ensureLoggedIn, function (req, res, next) {
	List.findOne({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function (list) {
			res.render('lists/share', { list: list, owner: req.user.email, listLink: process.env.LISTLINK_DOMAIN });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/join/:id', ensureLoggedIn, function (req, res, next) {
	List.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { members: req.user.email } }, { new: false })
		.then(function (list) {
			res.render('lists/join', { list: list });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.post('/join', ensureLoggedIn, function (req, res, next) {
	List.findOneAndUpdate({ _id: req.body.id }, { $addToSet: { members: req.user.email } }, { new: false })
		.then(function () {
			res.redirect('/lists/' + req.body.id);
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/leave/:id', ensureLoggedIn, function (req, res, next) {
	List.findOneAndUpdate({ _id: req.params.id }, { $pull: { members: req.user.email } }, { new: false })
		.then(function () {
			res.redirect('/lists');
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/:id', ensureLoggedIn, function (req, res, next) {
	var groupedGifts;
	var numGifts;
	Gift.find({ list: req.params.id })
		.sort('owner')
		.exec()
		.then(function (gifts) {
			if (gifts.length == 0) {
				var err = new Error();
				err.status = 404;
				throw err;
			}
			groupedGifts = _.groupBy(gifts, 'ownerName');
			numGifts = gifts.length;
			return List.findOne({ _id: req.params.id });
		})
		.then(function (list) {
			res.render('lists/list', { list: list, gifts: groupedGifts, user: req.user, numGifts: numGifts });
		})
		.catch(function (err) {
			return next(err);
		});
});

module.exports = router;