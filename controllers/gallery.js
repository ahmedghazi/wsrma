var GalleryController = function(app) {
    var express = require('express');
    var router = express.Router();
    var csurf = require('csurf');
    var request = require('request');

    router.get('/:page?', csurf(), function(req, res, next) {
        var page = req.param('page') >= 1 ? req.param('page') : 1;
        var perPage = 8;
        var hashFilter = 'hash_' + res.getLocale();
        var User = app.getModel('User');
        var hashTag = app.get(hashFilter);
        var params = {
            tag: hashTag[0]
        };
        User.find({tag: hashTag[0]})
                //.find(params)
                .limit(perPage)
                .skip(perPage * (page - 1))
                .sort({createdAt: 'desc'})
                .exec(function(err, users) {

                    //eachTime clean the database on displays
                    users.forEach(function(user, index) {
                        if (user.instagramId) {
                            request.get(user.images.standard_resolution.url.replace('http', 'https'), function(err, res, body) {
                                if (res) {
                                    if (res.statusCode === 404 || res.statusCode === 403) {
                                        user.remove();
                                        delete users[index];
                                    }
                                }
                            });
                        }
                    });

                    User.count({tag: hashTag[0]}).exec(function(err, count) {

                        var pagination = {
                            totalUsers: count,
                            page: Math.round(page),
                            lastPage: count / perPage > 1 ? Math.ceil(count / perPage) : 1,
                            firstPage: 1,
                            nextPage: Math.round(page) + 2, //paginate 3 by 3
                            next: Math.round(page) + 1,
                            prev: Math.round(page) - 1
                        };

                        if (pagination.next > pagination.lastPage) {
                            pagination.next = null;
                        }
                        if (pagination.prev < 0) {
                            pagination.prev = null;
                        }
                        if (pagination.nextPage > pagination.lastPage) {
                            pagination.nextPage = pagination.lastPage;
                        }


                        //get the gallery opposite users
                        var oppositeHash = res.getLocale() === 'fr' ? 'en' : 'fr';
                        var oppositeHashTag = app.get('hash_' + oppositeHash);
                        User.find({tag: oppositeHashTag[0]}).limit(5).sort({createdAt: 'desc'}).exec(function(err, opusers) {
                            return res.render('gallery', {
                                title: 'We Are Free | Gallery',
                                users: users,
                                opusers: opusers,
                                pagination: pagination,
                                token: req.csrfToken()
                            });
                        });



                    });
                });
    });

    return {
        router: router
    };
};

module.exports = GalleryController;