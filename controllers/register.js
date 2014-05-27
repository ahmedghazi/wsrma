var RegisterController = function(app) {
    var express = require('express');
    var router = express.Router();
    var request = require('request');

    var $me = this;

    /**
     * Login Path
     * reutrn the login form as view
     */
    router.get('/register', function(req, res) {
        var form = require('../forms/modelform')(app.getModel('User'), 'new', null, req.locale);
        var forms = require('forms');
        return res.render('register', {
            title: 'Register',
            form: form.toHTML()
        });
    });

    router.get('/success', function(req, res, next) {
        if (!req.session.userId) {
            var err = new Error('Access Denied');
            err.status = 403;
            return next(err);
        }
        var newUser = new app.getModel('User').findById(req.session.userId, function(err, user) {
            if (err) {
                return next(err);
            }
            return res.render('register_success', {
                title: 'We Are Free | Welcome',
                user: user
            });
        });

    });

    var filesParser = function(req, res, next) {
        var formidable = require('formidable');
        var formF = new formidable.IncomingForm();
        formF.parse(req, function(err, fields, files) {
            req.uploadFiles = files;
            req.body = {};
            req.body.user = {};
            req.body.userForm = JSON.parse(fields.form);
            var userProps = JSON.parse(fields.user);
            for (var key in userProps) {
                var userProp = userProps[key];
                req.body[key] = userProp;
                req.body.user[key] = userProp;
            }
            return next();
        });
    };

    router.post('/register', filesParser, function(req, res, next) {
        var form = require('../forms/modelform')(app.getModel('User'), 'customRegisterform', null, req.locale);
        var forms = require('forms');
        var path = require('path');
        var fs = require('fs');
        var im = require('imagemagick');

        var renderFormErrors = function(form, res, errors) {
            if (!errors) {
                errors = [];
            }
            for (var key in form.fields) {
                var field = form.fields[key];
                if (field.error)
                    errors.push(res.__(field.error));
            }
            return errors;
        };

        var errors = [];
        if (req.body.title === '' || req.body.title === null) {
            errors.push(res.__('form.errors.no_title'));
        }

        if (!req.body.tos) {
            errors.push(res.__('form.errors.no_tos'));
        }

        //check image
        if (!req.uploadFiles.file) {
            errors.push(res.__('form.errors.no_file'));
        }

        //check image
        if (!req.body.facebookId) {
            errors.push(res.__('form.errors.fb_connect_required'));
        }else if (app.get('banFbUsers').indexOf(req.body.facebookId) >= 0){
            //the users semmes to be banned.
            errors.push(res.__('form.errors.fb_connect_ban'));
        }
        


        form.handle(req, {
            success: function(form) {
                var user = req.body.user;
                if (errors.length) {
                    return res.send({
                        success: 0,
                        errors: errors
                    });
                }

                var tmpPath = req.uploadFiles.file.path;
                if (fs.existsSync(tmpPath)) {
                    im.identify(tmpPath, function(err, features) {
                        if (err) {
                            errors.push(err);
                            return res.send({
                                success: 0,
                                errors: errors
                            });
                        }

                        if (features.width < 450 || features.height < 450) {
                            errors.push(res.__('form.errors.picture_to_small'));
                        }

                        if (features.filesize.replace('KB') > 2000) {
                            errors.push(res.__('form.errors.picture_to_big'));
                        }
                        
                        var hashFilter = 'hash_' + res.getLocale();
                        var hashes = app.get(hashFilter);

                        //save the user
                        var newUser = new app.getModel('User')(user);
                        newUser.instagramMediaId = undefined;
                        newUser.instagramId = undefined;
                        newUser.username = newUser.firstname;
                        newUser.tag = hashes[0];
                        var imgsPath = '/uploads/' + newUser.email.toLowerCase();
                        var thumbPath = imgsPath + '/thumbnail.jpg';
                        var stdPath = imgsPath + '/standard.jpg';
                        newUser.images = {
                            standard_resolution: {
                                url: stdPath,
                                width: 450,
                                height: 450
                            },
                            thumbnail: {
                                url: thumbPath,
                                width: 150,
                                height: 150
                            }
                        };
                        newUser.save(function(err, user) {
                            if (err) {
                                console.log(err);
                                if (err.code === 11000) {
                                    errors.push(res.__('form.errors.user_already_exists'));
                                    return res.send({
                                        success: 0,
                                        errors: errors
                                    });
                                }
                            }
                            //login the user in session ? using passport ?
                            req.session.userId = user._id;

                            //resize images to 2 formats 150x and 450px
                            var absPAth = path.dirname(__dirname) + '/public';
                            if (!fs.existsSync(absPAth)) {
                                fs.mkdirSync(absPAth);
                            }
                            if (!fs.existsSync(absPAth + imgsPath)) {
                                fs.mkdirSync(absPAth + imgsPath);
                            }

                            im.resize({
                                srcPath: tmpPath,
                                dstPath: absPAth + stdPath,
                                width: 450,
                                height: 450,
                                format: 'jpg'
                            }, function() {
                                im.resize({
                                    srcPath: tmpPath,
                                    dstPath: absPAth + thumbPath,
                                    width: 150,
                                    height: 150,
                                    format: 'jpg'
                                }, function() {
                                    im.crop({
                                        srcPath: absPAth + thumbPath,
                                        dstPath: absPAth + thumbPath,
                                        width: 150,
                                        height: 150,
                                        quality: 1,
                                        gravity: "North"
                                    });
                                    im.crop({
                                        srcPath: absPAth + stdPath,
                                        dstPath: absPAth + stdPath,
                                        width: 450,
                                        height: 450,
                                        quality: 1,
                                        gravity: "North"
                                    }, function(err, stdout, stderr) {
                                        var graphUrl = 'https://graph.facebook.com?id=https://wearefreemerci.com/players/' + user._id + '&scrape=true&locale=en_US,fr_FR';
                                        //Everything was good, now, ping facebook linter to force fetch each lang meta
                                        request.post(graphUrl, function(err, res, body) {});
                                        return res.send({success: 1, url: '/account/success'});
                                    });
                                });
                            });
                        });
                    });
                }

            },
            error: function(form) {
                return res.send({
                    success: 0,
                    errors: renderFormErrors(form, res)
                });
            },
            empty: function(form) {
                return res.send({
                    success: 0,
                    errors: [res.__('form.errors.empty')]
                });
            }
        });
    });

    return {
        router: router
    };
};

module.exports = RegisterController;