var StatsController = function(app) {
    var express = require('express');
    var router = express.Router();

    var auth = require('http-auth');
    var basic = auth.basic({
        realm: "WeareFree Stats",
        file: __dirname + "/../config/security/users.htpasswd"
    });

    router.get('/', auth.connect(basic), function(req, res) {

        var User = app.getModel('User');

        User.find({}, function(err, users) {
            if (err) {
                return next(err);
            }

            var instaCount = 0;
            var fbCount = 0;
            var nativeCount = 0;
            var frCount = 0;
            var enCount = 0;
            var votesCount = 0;
            var optinCount = 0;
            users.forEach(function(user) {
                if (user.facebookId) {
                    fbCount++;
                } else if (user.instagramId) {
                    instaCount++;
                }
                if (user.tag === 'wearefreemerci') {
                    frCount++;
                }
                if (user.tag === 'youarewelcomeparis') {
                    enCount++;
                }
                if (user.optin === true) {
                    optinCount++;
                }
                votesCount += user.votes.length;
            });

            var pieFrEnData = [
                ['Name', 'Count'],
                ['FR', frCount],
                ['EN', enCount]
            ];

            var pieRegisterData = [
                ['Name', 'Count'],
                ['Instagram', instaCount],
                ['Facebook', fbCount]
            ];

            var pieOptinData = [
                ['Name', 'Count'],
                ['Yes', optinCount],
                ['No', (users.length - optinCount)]
            ];

            return res.render('stats', {
                title: 'We Are Free | Stats',
                users: users,
                instaCount: instaCount,
                fbCount: fbCount,
                frCount: frCount,
                enCount: enCount,
                votesCount: votesCount,
                pieRegisterData: pieRegisterData,
                pieFrEnData: pieFrEnData,
                optinCount: optinCount,
                pieOptinData: pieOptinData
            });
        });
    });

    return {
        router: router
    };
};

module.exports = StatsController;