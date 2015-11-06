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
var login = require('./routes/login');

var app = express();

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

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
app.use('/login', login);



/**
 * passport js
 */
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

passport.use(new LocalStrategy(
    function(username, password, done) {
        if (username != "vinay") {
          return done(null, false, { message: 'Incorrect username.' });
        }else if (password != "123") {
          return done(null, false, { message: 'Incorrect password.' });
        }else{
          return done(null, username);
        }
    }
));

app.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: 'User/Password Invalid!' })
);





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
