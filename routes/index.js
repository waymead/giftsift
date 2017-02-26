const logger = require('../lib/logging.js');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	if (req.user) {
		res.redirect('/lists');
	} else {
		req.prismic.api.getSingle('home-page')
		.then(function (document) {
			res.render('index', {
				document: document,
				error: req.flash('error')
			});
		}, function (err) {
			logger.error(err);
			return next(err);
		});
	}
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