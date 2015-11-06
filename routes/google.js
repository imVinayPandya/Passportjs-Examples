var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('google', { title: 'Welcome google user'});
});

module.exports = router;
