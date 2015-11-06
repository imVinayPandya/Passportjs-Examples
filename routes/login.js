var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var error = req.flash('error')[0];
    if(error){
        res.render('login', { title: 'wrong username and password' });

    }else{

        res.render('login', { title: 'Welcome to Login' });
    }
});

module.exports = router;
