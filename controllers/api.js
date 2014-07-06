var ApiController = function(app) {
    var express = require('express');
    this.router = express.Router();
    this.Ass = express.Ass;
    

    this.router.get('/', function(req, res) {
      console.log("api : "+Ass);
      /*Ass.find({}, function(err, data) {
        if(err) return next(err);
        //res.render('api', { title: 'Api', });
        return res.render('index', {
            title: 'Default'
        });
      });*/
        return res.render('api', {
            title: 'Api'
        });
    });

    this.router.get('/list', function(req, res, next) {
      console.log("get Ass");
      Ass.find({}, function(err, data) {
        if(err) return next(err);
        res.json(data);
      });
    });

    this.router.get('/:id', function(req, res, next) {
      console.log("get Ass : " + req.params.id);
      Ass.findById({ _id : ObjectId(req.params.id)}, function(err, data) {
        if(err) return next(err);
        res.json(data);
      });
    });

    this.router.post('/', function(req, res, next) {
      console.log("post api : " + req.body.content);
      var ass = new Ass();
      ass.content = req.body.content;
      ass.save(function(err) {
        if(err) return next(err);
        res.json({ message : 'Success!'});
      });
    });

    this.router.put('/:id', function(req, res, next) {
      console.log("put api : " + req.params.id);
      Ass.update(
        { _id : ObjectId(req.params.id) }
        , { content : req.body.content, date : new Date() }
        , { upsert : false, multi : false }
        , function(err) {
          if(err) return next(err);
          res.json({ message : 'Success!'});
      });
    });

    /*this.router.del('/api/:id', function(req, res, next) {
      console.log("delete api : " + req.params.id);
      Ass.findById({ _id : ObjectId(req.params.id)}, function(err, data) {
        if(err) return next(err);
        data.remove(function(err) {
          console.log("api remove!");
          res.json({ message : 'Success!'});
        });
      });
    });
    */
    return this;
};

module.exports = ApiController;

/*
app.get(‘/products/:PName’, products.findByName);
app.post(‘/products/:PName/:Type/:Description’,products.addProduct);
app.put(‘/products/:PName/:Type/:Description’, products.updateProduct);
app.delete(‘/products/:PName’, products.deleteProduct);
*/