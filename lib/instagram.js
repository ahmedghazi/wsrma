var Instagram = function() {
    var instagram = require('instagram-node-lib');
    var log = require('debug')('app');

    instagram.set('client_id', 'f35d80e7572a4b1a892273db7c85012d');
    instagram.set('client_secret', '4ba31c5980e143518903e368e8d993e8');
    instagram.set('callback_url', '/instagram');

    instagram.subscribeTag = function(hashtag, token, callbackUrl, next) {

        log('Subscriptions on tag: %s,  with token: %s, to callback: %s', hashtag, token, callbackUrl);

        instagram.tags.subscribe({
            object_id: hashtag,
            callback_url: callbackUrl,
            verify_token: token,
            complete: function() {
                next();
            },
            error: function(errMessage, errObject) {
                errObject.message = errMessage;
                next(errObject);
            }
        });
    };

    instagram.unSubscribeTags = function(next) {
        log('Subscriptions Clean All Tags');
        instagram.tags.unsubscribe_all({
            complete: function() {
                next(null);
            },
            error: function(errMessage, errObject) {
                next(errObject);
            }
        });
    };

    instagram.loadRecentMedias = function(hashtag, options, next) {
        log('Loading recent medias with tag : %s', hashtag);
        var extend = require('util')._extend;
        var params = extend({
            name: hashtag,
            complete: next
        }, options);
        instagram.tags.recent(params);
    };

    return instagram;
};

module.exports = Instagram;