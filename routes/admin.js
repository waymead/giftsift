var logger = require('../lib/logging.js');
var List = require('../model').List;
var Gift = require('../model').Gift;

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.use(function (req, res, next) {
	if (req.user && req.user.roles && req.user.roles.indexOf('admin') >= 0) {
		next();
	} else {
		res.sendStatus(403);
	}

});

router.get('/', ensureLoggedIn, function (req, res) {
	var allLists;
	List.find({}, {}, { sort: 'name' })
		.then(function (lists) {
			allLists = lists;
			return Gift.find({}, {}, { sort: 'name' });
		})
		.then(function (gifts) {
			res.render('admin/index', { lists: allLists, gifts: gifts });
		})
		.catch(function (err) {
			logger.error(err);
		});
});

router.get('/lists', ensureLoggedIn, function (req, res) {
	List.find({}, {}, { sort: 'name' })
		.then(function (lists) {
			res.render('admin/lists', { lists: lists });
		})
		.catch(function (err) {
			logger.error(err);
		});
});

module.exports = router;