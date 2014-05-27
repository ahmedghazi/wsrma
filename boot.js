var app = require('./app.js')();

app.boot();

/*app.registerModel('User', 'user');
 app.registerModel('Vote', 'vote');
 app.registerModel('Option', 'option');*/

app.registerController('request');
//app.registerController('security');
app.registerController('home');
//app.registerController('gallery');
//app.registerController('player');
//app.registerController('register');
app.registerController('instagram');
app.registerController('stats');
app.registerController('error404');
app.registerController('error');

app.registerRouteConfig('*', app.getController('request'));
//app.registerRouteConfig('/security', app.getController('security')(app).router);
//app.registerRouteConfig('/account', app.getController('register')(app).router);
app.registerRouteConfig('/instagram', app.getController('instagram')(app).router);
//app.registerRouteConfig('/gallery', app.getController('gallery')(app).router);
//app.registerRouteConfig('/players', app.getController('player')(app).router);
app.registerRouteConfig('/stats', app.getController('stats')(app).router);
app.registerRouteConfig('/', app.getController('home')(app).router);
app.registerRouteConfig('', app.getController('error404')(app).router);
app.registerRouteConfig('', app.getController('error'));

//local options
app.set('banInstagramUsers', []);
app.set('banFbUsers', []);


app.initRouteconfig();

module.exports = app;
