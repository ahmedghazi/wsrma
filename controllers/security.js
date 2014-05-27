var SecurityController = function(app) {
    var express = require('express');
    var passport = require('passport');
    var router = express.Router();

    /*
     * Login Check Path
     * reutrn the login form as view
     */
    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                req.flash('errors', err);
                return res.redirect('/security/login');
            }
            if (!user) {
                req.flash('errors', info);
                return res.redirect('/security/login');
            }

            //login the user
            req.logIn(user, function(err) {
                if (err)
                    return next(err);
                res.redirect('/');
            });

        })(req, res, next);
    });

    /*
     * Login Path
     * reutrn the login form as view
     */
    router.get('/login', function(req, res) {
        var errors = req.flash('errors');
        return res.render('login', {
            title: 'Login',
            errors: errors
        });
    });

    /*
     * Logout Path
     */
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/security/login');
    });

    return {
        router: router
    };
};

module.exports = SecurityController;