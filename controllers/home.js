var HomeController = function(app) {
    var express = require('express');
    var router = express.Router();

    //Listen for route /
    router.get('/', function(req, res) {
        
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

    return {
        router: router
    };
};

module.exports = HomeController;