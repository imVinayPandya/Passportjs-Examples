var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
// You need session to use connect flash
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var google = require('./routes/google');

var app = express();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', routes);
app.use('/users', users);
app.use('/google', google);



/**
 * passport js
 */
app.use( session({
    saveUninitialized : true,
    secret : 'Some Secret' ,
    resave : true
}));
app.use( passport.initialize());
app.use( passport.session());
app.use(flash())

passport.serializeUser( function(user, done) {
    return done(null, user);
});

passport.deserializeUser( function(user, done) {
    return done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: '1050682049330-10sihnhod713qtvspunr2epf8chgddkq.apps.googleusercontent.com',
        clientSecret: 'R_0csj7BBqpyeP_RVXb9UKHe',
        callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    },
    function(token, tokenSecret, profile, done) {
       // do your database stuff here

       /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });*/
        console.log("token seceret: "+tokenSecret);
        console.log("token: "+token);
        console.log("profile: "+profile);
        done(null, profile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }),
    function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    });

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/google');
    });




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
