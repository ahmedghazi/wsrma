<<<<<<< HEAD
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
=======

/**
 * This is an Express app instance, extended by express rapido
 * @type ExpressRapido
 */
var app = require('./config/expressRapido.js')();

//boot the app
app.boot();

//register some models
app.registerModel('User', 'user');
app.registerModel('Option', 'option');
app.registerModel('Ass', 'ass');

//register some controllers
app.registerController('request');
app.registerController('security');
app.registerController('home');
app.registerController('error404');
app.registerController('error');
app.registerController('api');

//register some route
app.registerRouteConfig('*', app.getController('request'));
app.registerRouteConfig('/security', app.getController('security')(app).router);
app.registerRouteConfig('/', app.getController('home')(app).router);
app.registerRouteConfig('/api', app.getController('api')(app).router);
app.registerRouteConfig('', app.getController('error404')(app).router);
app.registerRouteConfig('', app.getController('error'));


>>>>>>> c0f633ae3b1d829573057bf4d626742dc3f2b3a4


module.exports = app;
