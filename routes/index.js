var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var checkAuth = require('../middleware/check-auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Notezy' });
});

/* GET college page. */
router.get('/colleges', function (req, res, next) {
  res.render('list-colleges');
});

/* GET login/register page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

// /* GET profile page. */
// router.get('/profile', checkAuth, function(req, res, next) {
//   res.render('profile');
// })

module.exports = router;