var HomeController = function(app) {
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res) {
        return res.render('index', {
            title: 'Default'
        });
    });

    return {
        router: router
    };
};

module.exports = HomeController;