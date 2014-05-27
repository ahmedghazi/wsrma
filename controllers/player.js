var PlayerController = function(app) {
    var express = require('express');
    var router = express.Router();
    var csurf = require('csurf');
    var request = require('request');

    router.get('/:userId', csurf(), function(req, res, next) {

        var token = req.csrfToken();
        var User = app.getModel('User');
        var prevUser = null;
        var nextUser = null;
        var requestedUser = null;
        var hashFilter = 'hash_' + res.getLocale();
        var hashTag = app.get(hashFilter);
        //console.log(hashTag, hashFilter);

        User.findById(req.param('userId'), function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                var err = new Error('404 not found');
                err.status = 404;
                return next(err);
            }

            requestedUser = user;

            request.get(user.images.standard_resolution.url.replace('http', 'https'), function(err, res, body) {
                if (res) {
                    if (res.statusCode === 404 || res.statusCode === 403) {
                        user.remove();
                        var err = new Error('404 not found');
                        err.status = 404;
                        return next(err);
                    }
                }
            });

            //get prev/next users
            User.find({_id: {$gt: requestedUser._id}, tag: hashTag[0]}, '_id').sort({createdAt: 'asc'}).limit(1).exec(function(err, users) {
                if (err) { 
                    next(err);
                }
                if (users.length) {
                    prevUser = users[0];
                }
                User.find({
                    _id: { $lt: requestedUser._id},
                    tag: hashTag[0]
                }, '_id').sort({createdAt: 'desc'}).limit(1).exec(function(err, users) {
                    if (err) {
                        next(err);
                    }
                    if (users.length) {
                        nextUser = users[0];
                    }
                    var fullUrl = 'https://' + req.get('host') + '/players/' + requestedUser._id;
                    res.render('player', {
                        user: requestedUser,
                        token: token,
                        prev: prevUser,
                        next: nextUser,
                        currentUrl: fullUrl,
                        imageUrl: user.images.standard_resolution.url.replace('http', 'https')
                    });
                });
            });
        });
    });

    router.post('/:userId/vote', csurf(), function(req, res, next) {

        //check if a vote exist
        var User = app.getModel('User');

        if (!req.body.voterFbId) {
            return next('No Facebook Id');
        }
        var userId = req.param('userId');

        //get the related user
        User.findOne({
            '_id': userId,
            'votes.facebookId': req.body.voterFbId
        }, function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {

                User.findById(userId, function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (user) {
                        //add a new vote on the user data
                        var vote = new app.getModel('Vote')({
                            ip: req.ip,
                            facebookId: req.body.voterFbId
                        });
                        user.votes.addToSet(vote);
                        user.markModified('votes');
                        user.save(function(err, user) {
                            if (err) {
                                return next(err);
                            }
                            return res.send({success: 1, message: res.__('vote.thx')});
                        });
                    } else {
                        var e = new Error('The user does not exists');
                        return next(e);
                    }
                });
            } else {
                return res.send({success: 0, error: res.__('user.already_vote')});
            }

        });

    });

    return {
        router: router
    };
};

module.exports = PlayerController;