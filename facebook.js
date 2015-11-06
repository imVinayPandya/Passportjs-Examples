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
var facebook = require('./routes/facebook');


var app = express();

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', routes);
app.use('/users', users);
app.use('/facebook', facebook);


/**
 * passport js:     Facebook
 */

app.use( passport.initialize());


app.use( session({
    saveUninitialized : true,
    secret : 'Some Secret' ,
    resave : true,
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


passport.use(new FacebookStrategy({
        clientID: '449178965265596',
        clientSecret: '25bca6827ebf0659e7faf463ae6d1f84',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {

        //do your database operation

        //User.findOrCreate(..., function(err, user) {
        //    if (err) { return done(err); }
        //    done(null, user);
        //});
        console.log("\n\nAuth done: \nAccess token:"+accessToken
        +'\nrefresh token: '+refreshToken+
        '\nprofile: '+JSON.stringify(profile)+'\n\n');

        done(null, profile);
    }
));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/facebook',
        failureRedirect: '/' }));


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
