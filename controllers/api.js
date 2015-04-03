var ApiController = function(app) {
    var express = require('express');
    this.router = express.Router();
    var fs = require('fs');
    var formidable = require('formidable');
    var path = require('path');
    var Ass = app.getModel('Ass');
    var postsPerPage = 2;

    // GET LAST ASSES
    this.router.get('/', function(req, res){
        console.log("api")
        return Ass
                .find()
                .sort({date_created: 'desc'})
                .limit(postsPerPage)
                .exec(function(err, asses) {
            if (err) {
                console.log(err);
                return next(err);
            }
            
            return res.json(asses);
        });
    });

    // PAGINATION
    this.router.get('/', function(req, res){
        return Ass
                .find()
                .sort({date_created: 'desc'})
                .limit(postsPerPage)
                .skip(req.params.page)
                .exec(function(err, asses) {
            if (err) {
                console.log(err);
                return next(err);
            }
            
            return res.json(asses);
        });
    });




    /***

    ***/
    // GET FORM UPLOAD
    this.router.get('/upload', function(req, res){
        return res.render('upload', {
            title: "UPLOAD"
        });
    });

    // MIDDLEWARE IMAGE PARSER
    var filesParser = function(req, res, next) {
        var formF = new formidable.IncomingForm({ uploadDir: path.dirname(__dirname) + '/tmp' });
        formF.parse(req, function(err, fields, files) {
            //console.log(files);
            req.uploadFiles = files;
            //req.body = {};
            
            return next();
        });
    };

    
    // UPLOAD ASS
    this.router.post('/upload', filesParser, function(req, res){
        //return res.json(req.uploadFiles);
        fs.readFile(req.uploadFiles.image.path, function (err, data) {
            var imageName = req.uploadFiles.image.name

            /// If there's an error
            if(!imageName){
                console.log("There was an error")
                res.redirect("/");
                res.end();

            } else {                
                var newPath = path.dirname(__dirname) + "/uploads/" + imageName;
                 /// write file to uploads/fullsize folder
                fs.writeFile(newPath, data, function (err) {
                    console.log("imageName : "+imageName);
                    return res.json(imageName);
                });
            }
        });

    });
    


    // CREATE ASS
    this.router.post('/c', filesParser, function(req, res){

        fs.readFile(req.uploadFiles.image.path, function (err, data) {
            var imageName = req.uploadFiles.image.name

            /// If there's an error
            if(!imageName){
                console.log("There was an error")
                res.redirect("/");
                res.end();

            } else {                
                var newPath = path.dirname(__dirname) + "/uploads/" + imageName;
                 /// write file to uploads/fullsize folder
                fs.writeFile(newPath, data, function (err) {
                    console.log("imageName : "+imageName);

                    var ass = new Ass({
                        img: imageName,
                        ratings:req.body.rate
                    });

                    console.log(req.files);

                    ass.save(function (err) {
                        if (!err) {
                            return console.log("ass created");
                        } else {
                            return console.log(err);
                        }
                    });

                    return res.json(ass);
                });
            }
        });
        
    });

    // GET ASS
    this.router.get('/a/:id', function(req, res){
        return Ass.findById(req.params.id, function (err, ass) {
            if (err) {
                return next(err);
            }

            res.json(ass);
        });
    });

    // UPDATE ASS
    this.router.post('/u', function(req, res, next){
        //console.log("params : ",req.body);
        return Ass.findById(req.body.id, function (err, ass) {
            if (err) {
                return next(err);
            }
            ass.ratings.push(req.body.rate);
            ass.average = 5;
           
            ass.save(function (err) {
                if (!err) {
                    return console.log("updated");
                } else {
                    return console.log(err);
                }
            });

            res.json(ass);
        });
    });

    
    // DELETE ASS
    this.router.get('/d/:id', function(req, res, next){
        return Ass.findById(req.params.id, function (err, ass) {
            if (err) {
                return next(err);
            }
            //console.log(story);
            ass.remove(function (err) {
                if (!err) {
                    return console.log("deleted");
                } else {
                    return console.log(err);
                }
            });

            res.json({'success':true, id:req.params.id});
        });
    });


    return this;
};


module.exports = ApiController;