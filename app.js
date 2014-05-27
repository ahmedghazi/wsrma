var AppBoot = function() {
    require('colors');

    var bootLog = require('debug')('boot');
    var log = require('debug')('app');

    bootLog('Booting Application');
    var express = require('express');
    var app = express();
    var boot = this;

    app.boot = function() {
        boot.init();
    };

    app.initAppSettings = function()
    {
        app.controllers = {};
        app.models = {};
        app.routesConfig = [];
        var i18n = require("i18n");


        app.registerController = function(key, controller)
        {
            bootLog('Registering controller : %s', key);
            app.controllers[key] = require('./controllers/' + key);
            return app;
        };
        app.getController = function(key)
        {
            return app.controllers[key];
        };
        app.registerModel = function(key, model)
        {
            bootLog('Registering model : %s', key);
            app.models[key] = require('./models/' + model);
            return app;
        };
        app.getModel = function(key)
        {
            return app.models[key];
        };
        app.registerRouteConfig = function(path, controller)
        {
            bootLog('Registering route : %s', path);
            app.routesConfig.push({
                path: path,
                controller: controller
            });
            return app;
        };
        app.getRouteConfig = function(key)
        {
            return app.routesConfig[key];
        };

        app.initRouteconfig = function()
        {
            for (var key in app.routesConfig) {
                var route = app.getRouteConfig(key);
                bootLog('Listen for Route : %s', route.path);
                app.use(route.path, route.controller);
            }
        };

        app.setOption = function(name, value) {
            var done = function(err, option) {
                if (err) {
                    log('Cannot save option in database cause: %s', err.message);
                    return false;
                }
                log('Option saved in database: %s', option.name);
            };
            return app.getModel('Option').findOneAndUpdate({name: name}, {name: name, value: value}, {upsert: true}, done);
        };

        var sessionDbName = process.env.npm_package_config_session_db_name || 'session';
        app.set('sessionDbName', sessionDbName);

        var sessionSecret = process.env.npm_package_config_session_secret_key || 'session_secret_key';
        app.set('sessionSecret', sessionSecret);

        var appDbName = process.env.npm_package_config_app_db_name || 'application';
        app.set('appDbName', appDbName);

        var instagramSecurityToken = process.env.npm_package_config_instagram_security || null;
        app.set('instagramSecurityToken', instagramSecurityToken);

        var port = process.env.PORT || process.env.npm_package_config_port || null;
        app.set('port', port);

        var host = process.env.npm_package_config_host || null;
        app.set('host', host);

        /**
         * Lang Support
         */
        bootLog('Setup i18n : %s', 'Ok');
        i18n.configure({
            defaultLocale: 'fr',
            locales: ['fr'],
            directory: __dirname + '/locales',
            updateFiles: false
        });
        app.use(i18n.init);
    };

    this.init = function()
    {
        bootLog('Init');
        var favicon = require('static-favicon');
        var logger = require('morgan');
        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var flash = require('connect-flash');
        var limits = require('limits');
        app.use(favicon());
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(cookieParser());
        app.use(flash());
        app.use(limits('2Mo'));
        app.enable('trust proxy');
        app.initAppSettings();
        this.initDb();
        this.initSession();
        this.initSecurity();
        this.initViews();
        return this;
    };



    this.initDb = function()
    {
        var mongoose = require('mongoose');
        var mongoUrl = 'mongodb://localhost/' + app.get('appDbName');
        bootLog('Init Database connection to :', mongoUrl);
        mongoose.connect(mongoUrl);
        return this;
    };
    this.initViews = function()
    {
        bootLog('Init views');
        var path = require('path');
        app.use(express.static(path.join(__dirname, 'public')));
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        return this;
    };
    this.initSession = function()
    {
        bootLog('Init Session');
        var session = require('./config/security/session')();
        var MongoStore = require('connect-mongo')({
            session: session
        });
        app.use(session({
            cookie: {maxAge: 60000 * 60 * 24}, //1 day
            secret: app.get('sessionSecret'),
            store: new MongoStore({
                db: app.get('sessionDbName')
            })
        }));
        return this;
    };
    this.initSecurity = function()
    {
        bootLog('Init Security');
        var passportLocal = require('./config/security/local')(app);
        app.use(passportLocal.initialize());
        app.use(passportLocal.session());
    };
    return app;
};
module.exports = AppBoot;
