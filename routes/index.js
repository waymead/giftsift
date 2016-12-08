'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { error: req.flash('error') });
});

router.get('/login', function(req, res) {
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