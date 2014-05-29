var HomeController = function(app) {
    var express = require('express');
    this.router = express.Router();

    //Listen for route /
    this.router.get('/', function(req, res) {

        //session storage exemple
        var session = req.session;
        var count = session.count || 0;
        count++;
        session.count = count;

        //render the index.html.jade
        return res.render('index', {
            title: 'Default',
            count: count
        });
    });

    return this;
};

module.exports = HomeController;