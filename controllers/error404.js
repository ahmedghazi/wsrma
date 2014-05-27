var Error404Controller = function(app) {
    var express = require('express');
    var passport = require('passport');
    var router = express.Router();

    //404 handler
    router.use(function(req, res, next) {
        var err = new Error("Page not Found");
        err.status = 404;
        next(err);
    });

    return {
        router: router
    };
};

module.exports = Error404Controller;