var HomeController = function(app) {
    var express = require('express');
    var router = express.Router();

    router.all('/', function(req, res) {
        return res.render('index', {
            title: 'We Are Free'
        });
    });

    router.get('/noliked', function(req, res) {
        return res.render('index_no_like', {
            title: 'We Are Free'
        });
    });

    router.get('/about', function(req, res) {
        return res.render('about', {
            title: 'We Are Free | About'
        });
    });

    return {
        router: router
    };
};

module.exports = HomeController;