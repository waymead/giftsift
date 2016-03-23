'use strict';
var _ = require('underscore');

var logger = require('../lib/logging.js');
var List = require('../model/aiwf.js').List;
var Gift = require('../model/aiwf.js').Gift;

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/', function (req, res) {
	res.render('index', { error: req.flash('error') });
});

router.get('/lists', ensureLoggedIn, function(req, res) {
	List.find({ members: req.user.email }, {}, { sort: 'name' })
		.then(function(lists) {
			res.render('lists', { lists: lists });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

// TODO bin
router.get('/:id/edit', ensureLoggedIn, function(req, res) {
	Gift.find({ list: req.params.id })
		.then(function(gifts) {
			res.render('list-edit', { gifts: gifts });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/lists/manage', ensureLoggedIn, function(req, res) {
	var ownedLists;
	List.find({ owner: req.user.email }, {}, { sort: 'name' })
		.then(function(lists) {
			ownedLists = lists;
			return List.find({ members: req.user.email }, {}, { sort: 'name' });
		})
		.then(function(lists) {
			res.render('manage-lists', { ownedLists: ownedLists, memberOfLists: lists, owner: req.user.email });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/lists/add', ensureLoggedIn, function(req, res) {
	res.render('edit-list', { owner: req.user.email });
});

router.get('/lists/edit/:id', ensureLoggedIn, function(req, res) {
	List.findOne({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function(list) {
			res.render('edit-list', { list: list, owner: req.user.email });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.post('/lists/save', ensureLoggedIn, function(req, res) {
	var list = new List(req.body);
	list.owner = req.user.email;
	list.ownerName = req.user.name;
	list.members = [req.user.email];
	if (!req.body.id) {
		list.save()
			.then(function() {
				res.redirect('/lists/manage');
			})
			.catch(function(err) {
				logger.error(err);
			});
	} else {
		List.findOneAndUpdate({ _id: req.body.id }, req.body, { new: false })
			.then(function() {
				res.redirect('/lists/manage');
			})
			.catch(function(err) {
				logger.error(err);
			});
	}
});

router.get('/lists/delete/:id', ensureLoggedIn, function(req, res) {
	List.findOneAndRemove({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function(list) {
			return Gift.find({ list: list.id }).remove();
		})
		.then(function() {
			res.redirect('/lists/manage');
		})
		.catch(function(err) {
			logger.error('Eek');
			logger.error(err);
		});
});

router.get('/lists/share/:id/:name?', ensureLoggedIn, function(req, res) {
	List.findOne({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function(list) {
			res.render('share-list', { list: list, owner: req.user.email, listLink: process.env.LISTLINK_DOMAIN });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/lists/join/:id', ensureLoggedIn, function(req, res) {
	List.findOneAndUpdate({ _id: req.params.id }, {$addToSet: {members: req.user.email}}, { new: false })
		.then(function(list) {
			res.render('join-list', {list: list});
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.post('/lists/join', ensureLoggedIn, function(req, res) {
	List.findOneAndUpdate({ _id: req.body.id }, {$addToSet: {members: req.user.email}}, { new: false })
		.then(function() {
			res.redirect('/lists');
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/lists/leave/:id', ensureLoggedIn, function(req, res) {
	List.findOneAndUpdate({ _id: req.params.id }, {$pull: {members: req.user.email}}, { new: false })
		.then(function() {
			res.redirect('/lists');
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/lists/:id/:name?', ensureLoggedIn, function(req, res) {
	var groupedGifts;
	var numGifts;
	Gift.find({ list: req.params.id, owner: { '$ne': req.user.email } })
		.sort('owner')
		.exec()
		.then(function(gifts) {
			groupedGifts = _.groupBy(gifts, 'ownerName');
			numGifts = gifts.length;
			return List.findOne({ _id: req.params.id });
		})
		.then(function(list) {
			res.render('list', { list: list, gifts: groupedGifts, user: req.user, numGifts: numGifts });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/gifts/manage', ensureLoggedIn, function(req, res) {
	Gift.find({ owner: req.user.email }, {}, { sort: 'name' })
		.populate('list')
		.then(function(gifts) {
			res.render('manage-gifts', { gifts: gifts });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/gifts/add', ensureLoggedIn, function(req, res) {
	List.find({ members: req.user.email }, {}, { sort: 'name' })
		.then(function(lists) {
			res.render('edit-gift', { lists: lists, owner: req.user.email });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.get('/gifts/edit/:id', ensureLoggedIn, function(req, res) {
	var theGift;
	Gift.findOne({ _id: req.params.id, owner: req.user.email })
		.populate('list', 'name', null, { sort: 'name' })
		.exec()
		.then(function(gift) {
			theGift = gift;
			return List.find({ members: req.user.email });
		})
		.then(function(lists) {
			res.render('edit-gift', { gift: theGift, lists: lists, owner: req.user.email });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

router.post('/gifts/save', ensureLoggedIn, function(req, res) {
	var gift = new Gift(req.body);
	if (!req.body.id) {
		gift.owner = req.user.email;
		gift.ownerName = req.user.name;
		gift.save()
			.then(function(gift) {
				return List.findOneAndUpdate({ _id: req.body.list }, {$addToSet: {gifts: gift.id}}, { new: false });
			})
			.then(function() {
				res.redirect('/gifts/manage');
			})
			.catch(function(err) {
				logger.error(err);
			});
	} else {
		Gift.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
			.then(function(gift) {
				return List.findOneAndUpdate({ _id: req.body.list }, {$addToSet: {gifts: gift.id}}, { new: false });
			})
			.then(function() {
				res.redirect('/gifts/manage');
			})
			.catch(function(err) {
				logger.error(err);
			});
	}
});

router.get('/gifts/delete/:id', ensureLoggedIn, function(req, res) {
	Gift.findOneAndRemove({ _id: req.params.id, owner: req.user.email })
		.exec()
		.then(function(gift) {
			return List.findOneAndUpdate({ _id: req.body.list }, {$pull: {gifts: gift.id}}, { new: false });
		})
		.then(function() {
			res.redirect('/gifts/manage');
		})
		.catch(function(err) {
			logger.error('Eek');
			logger.error(err);
		});
});

router.get('/gifts/buy/:id', ensureLoggedIn, function(req, res) {
	Gift.findOneAndUpdate({ _id: req.params.id }, { $set: { boughtBy: req.user.email } })
		.populate('list')
		.exec()
		.then(function(gift) {
			res.redirect('/lists/' + gift.list.id);
		})
		.catch(function(err) {
			logger.error('Eek');
			logger.error(err);
		});
});

router.get('/gifts/replace/:id', ensureLoggedIn, function(req, res) {
	Gift.findOneAndUpdate({ _id: req.params.id }, { $unset: { boughtBy: 1 } })
		.populate('list')
		.exec()
		.then(function(gift) {
			res.redirect('/lists/' + gift.list.id);
		})
		.catch(function(err) {
			logger.error('Eek');
			logger.error(err);
		});
});

router.get('/login', function (req, res) {
	res.render('login', {
		error: req.flash('error'),
		returnTo: req.flash('ret', req.session.returnTo),
		redirectTo: req.session.redirectTo
	});
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;