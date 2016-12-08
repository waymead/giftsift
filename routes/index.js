'use strict';

var env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { error: req.flash('error') });
});

router.get('/login', function(req, res) {
    if (req.user) {
        res.locals.user = req.user;
    }
    res.locals.env = env;
    res.render('login', {
        error: req.flash('error'),
        returnTo: req.flash('ret', req.session.returnTo),
        redirectTo: req.session.redirectTo
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;