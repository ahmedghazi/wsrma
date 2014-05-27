var InstagramController = function(app) {
    var express = require('express');
    var router = express.Router();
    var instagram = require('../lib/instagram')();
    var $me = this;
    var log = require('debug')('app');

    this.insertMedias = function(data, hashtag) {
        return data.every(function(media) {
            var params = {email: media.user.username + media.user.id + '@nomail.fake'};
            return app.getModel('User').findOne(params, function(err, user) {
                if (err) {
                    throw new Error('Can\'t query database');
                }
                if (!user) {
                    log('Media not found, Inserting in database from instagram : %s %s', media.id, media.user.username);


                    if (app.get('banInstagramUsers').indexOf(media.user.id) === -1) {

                        var user = new app.getModel('User')({
                            'instagramId': media.user.id,
                            'instagramMediaId': media.id,
                            'facebookId': undefined,
                            'images': media.images,
                            'email': params.email,
                            'username': media.user.username,
                            'tag': hashtag
                        });
                        user.save(function(err, user) {
                            if (err) {
                                if (err.code === 11000) {
                                    log('User %s already exist in database... skip it.', media.user.email);
                                } else {
                                    console.error(err);
                                }
                            }
                            var graphUrl = 'https://graph.facebook.com?id=https://wearefreemerci.com/players/' + user._id + '&scrape=true&locale=en_US,fr_FR';
                            //Everything was good, now, ping facebook linter to force fetch each lang meta
                            request.post(graphUrl, function(err, res, body) {
                            });
                            return true;
                        });
                    } else {
                        log('User exist : %s %s', user.instagramId, user.instagramMediaId);
                    }
                }else{
                    log('Media not found, but user is banned: %s %s', user.instagramId, user.instagramMediaId);
                }
            });
        });
    };

    this.fetchMedias = function(hashtag) {
        app.getModel('Option').findOne({name: hashtag + '_max_id'}, function(err, option) {
            if (err) {
                throw err;
            }
            var nextMaxTagId = null;
            if (option) {
                nextMaxTagId = option.value;
            }
            instagram.loadRecentMedias(hashtag, {min_tag_id: nextMaxTagId}, function(data, pagination) {
                //data are loaded, parse them
                log('Parsing medias data from Instagram Api | medias count : %s', data.length.toString());
                this.insertMedias(data, hashtag);
                app.setOption(hashtag + '_maxId', pagination.next_max_tag_id);
            });
        });
    };

    router.get('/subscribe', function(req, res) {
        log('Subscription verification...');
        if (!req.query['hub.challenge']) {
            log('Subscription verification : %s', 'Fail');
            res.status = 500;
            return res.send('Instagram API:'.blue, 'subscription verification Fail');
        }
        var verifyToken = typeof req.query['hub.verify_token'] !== undefined ? req.query['hub.verify_token'] : null;
        if (verifyToken !== app.get('instagramSecurityToken')) {
            log('Subscription verification : %s', 'Fail => BAD TOKEN');
            res.status = 500;
            return res.send('Instagram API realtime subscription verification Fail');
        }
        var challenge = req.query['hub.challenge'];
        if (req.query['hub.mode'] === 'subscribe') {
            log('Subscription OK, challenge : %s', challenge);
            return res.send(challenge);
        }
    });


    router.post('/subscribe', function(req, res) {
        if (req.body.length === 0) {
            next(new Error('Post data are empty'));
        }
        if (req.body.tag) {
            log('Receive Instagram notification from ping');
            $me.fetchMedias(req.body.tag);
            return res.send({'success': 1});
        }

        log('Receive Instagram notification');
        var tags = req.body;
        tags.forEach(function(tag) {
            if (tag.object === 'tag') {
                var tag = tag.object_id;
                $me.fetchMedias(tag);
            }
        });

        return res.send({'success': 1});
    });

    return {
        router: router,
        ctrl: this
    };
};

module.exports = InstagramController;