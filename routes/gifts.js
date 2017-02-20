'use strict';
const service = require('../lib/giftsiftService.js');

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.get('/add', ensureLoggedIn, function (req, res, next) {
	service.getListsByMember(req.user.email)
		.then(function (lists) {
			res.render('gifts/edit', { lists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/edit/:id', ensureLoggedIn, function (req, res, next) {
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
			res.render('gifts/edit', { gift: theGift, lists: lists, owner: req.user.email });
		})
		.catch(function (err) {
			return next(err);
		});
});

router.post('/save', ensureLoggedIn, function (req, res, next) {
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
		/*gift.owner = req.user.email;
		gift.ownerName = req.user.name;
		gift.save()*/
			// .then(function (gift) {
			// 	logger.info('Gift created', { gift: gift.name });
			// 	return List.update({ _id: { $in: gift.list } }, { $addToSet: { gifts: gift.id } }, { multi: true, new: false });
			// })
			.then(function (gift) {
				res.redirect('/lists/' + gift.list[0]);
			})
			.catch(function (err) {
				return next(err);
			});
	} else {
		service.createGift(gift)
		//Gift.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
			// .then(function (gift) {
			// 	theGift = gift;
			// 	return List.update({ _id: { $in: gift.list } }, { $addToSet: { gifts: gift.id } }, { multi: true, new: false });
			// })
			.then(function (gift) {
				res.redirect('/lists/' + gift.list[0]);
			})
			.catch(function (err) {
				return next(err);
			});
	}
});

router.get('/delete/:id', ensureLoggedIn, function (req, res, next) {
	//var listId;
	service.deleteGift(req.params.id, req.user.email)
		/*.exec()
		.then(function (gift) {
			listId = gift.list[0];
			return List.update({ _id: { $in: gift.list } }, { $pull: { gifts: gift.id } }, { multi: true, new: false });
		})*/
		.then(function (gift) {
			res.redirect('/lists/' + gift.list[0]);
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/undelete/:id', ensureLoggedIn, function (req, res, next) {
	//var listId;
	service.undeleteGift(req.params.id, req.user.email)
		/*.exec()
		.then(function (gift) {
			listId = gift.list[0];
			return List.update({ _id: { $in: gift.list } }, { $pull: { gifts: gift.id } }, { multi: true, new: false });
		})*/
		.then(function (gift) {
			res.redirect('/lists/' + gift.list[0]);
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/buy/:id/:list', ensureLoggedIn, function (req, res, next) {
	service.buyGift(req.params.id, req.user.email)
		.then(function () {
			res.redirect('/lists/' + req.params.list);
		})
		.catch(function (err) {
			return next(err);
		});
});

router.get('/replace/:id/:list', ensureLoggedIn, function (req, res, next) {
	service.replaceGift(req.params.id, req.user.email)
		.then(function () {
			res.redirect('/lists/' + req.params.list);
		})
		.catch(function (err) {
			return next(err);
		});
});

module.exports = router;