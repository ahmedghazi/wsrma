var app = require('./app.js')();

app.boot();

app.registerModel('User', 'user');
 app.registerModel('Option', 'option');

app.registerController('request');
app.registerController('security');
app.registerController('home');
app.registerController('error404');
app.registerController('error');

app.registerRouteConfig('*', app.getController('request'));
app.registerRouteConfig('/security', app.getController('security')(app).router);
app.registerRouteConfig('/instagram', app.getController('instagram')(app).router);
app.registerRouteConfig('/', app.getController('home')(app).router);
app.registerRouteConfig('', app.getController('error404')(app).router);
app.registerRouteConfig('', app.getController('error'));

app.initRouteconfig();

module.exports = app;
