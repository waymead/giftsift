'use strict';
const _ = require('underscore');

const logger = require('../lib/logging.js');
const service = require('../lib/giftsiftService.js');

var List = require('../model').List;
var Gift = require('../model').Gift;

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/', ensureLoggedIn, function (req, res, next) {
	service.getListsByMember(req.user.email)
		.then(function (lists) {
			res.render('lists/index', { lists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

/*router.get('/manage', ensureLoggedIn, function (req, res, next) {
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
});*/

router.get('/add', ensureLoggedIn, function (req, res) {
	res.render('lists/edit', { owner: req.user.email });
});

router.get('/edit/:id', ensureLoggedIn, function (req, res, next) {
	service.getListByIdAndOwner(req.params.id, req.user.email)
		.then(function (list) {
			if (list == null) {
				var err = new Error();
				err.status = 404;
				throw err;
			}
			res.render('lists/edit', { list: list, owner: req.user.email });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.post('/save', ensureLoggedIn, function (req, res, next) {
	var list = {
		name: req.body.name,
		type: req.body.type,
		description: req.body.description,
		notes: req.body.notes,
		owner: req.user.email,
		ownerName: req.user.name
	};
	if (req.body.id) {
		list.id = req.body.id;
		service.saveList(list)
			.then(function () {
				res.redirect('/lists');
			})
			.catch(function (err) {
				logger.error(err);
				return next(err);
			});
	} else {
		list.members = [req.user.email];
		service.createList(list)
			.then(function () {
				res.redirect('/lists');
			})
			.catch(function (err) {
				logger.error(err);
				return next(err);
			});
	}
});

router.get('/delete/:id', ensureLoggedIn, function (req, res, next) {
	service.deleteList(req.params.id, req.user.email)
//	List.findOneAndUpdate({ _id: req.params.id, owner: req.user.email }, { $set: {deleted: true }})
//		.exec()
		/*.then(function (list) {
			return Gift.find({ list: list.id }).remove();
		})*/
		.then(function () {
			res.redirect('/lists');
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/share/:id/:name?', ensureLoggedIn, function (req, res, next) {
	service.getListByIdAndOwner(req.params.id, req.user.email)
		.then(function (list) {
			res.render('lists/share', { list: list, owner: req.user.email, listLink: process.env.LISTLINK_DOMAIN });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/join/:id', ensureLoggedIn, function (req, res, next) {
	service.findById(req.params.id)
		.then(function (list) {
			res.render('lists/join', { list: list });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.post('/join', ensureLoggedIn, function (req, res, next) {
	service.joinList(req.body.id, req.user.email)
		.then(function () {
			res.redirect('/lists/' + req.body.id);
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/leave/:id', ensureLoggedIn, function (req, res, next) {
	service.leaveList(req.params.id, req.user.email)
		.then(function () {
			res.redirect('/lists');
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

router.get('/:id', ensureLoggedIn, function (req, res, next) {
	var theList;
	var groupedGifts;
	var numGifts;
	service.getListByIdAndOwner(req.params.id, req.user.email)
		.then(function (list) {
			theList = list;
			return Gift.find({ list: list._id });
		})
		.then(function (gifts) {
			groupedGifts = _.groupBy(gifts, 'ownerName');
			numGifts = gifts.length;
			res.render('lists/list', { list: theList, gifts: groupedGifts, user: req.user, numGifts: numGifts });
		})
		.catch(function (err) {
			logger.error(err);
			return next(err);
		});
});

module.exports = router;