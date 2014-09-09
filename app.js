
/**
 * This is an Express app instance, extended by express rapido
 * @type ExpressRapido
 */
var app = require('./config/expressRapido.js')();

//boot the app
app.boot();

//register some models
app.registerModel('User', 'user');
app.registerModel('Option', 'option');
app.registerModel('Ass', 'ass');

//register some controllers
app.registerController('request');
app.registerController('security');
app.registerController('home');
app.registerController('error404');
app.registerController('error');
app.registerController('api');

//register some route
app.registerRouteConfig('*', app.getController('request'));
app.registerRouteConfig('/security', app.getController('security')(app).router);
app.registerRouteConfig('/', app.getController('home')(app).router);
app.registerRouteConfig('/api', app.getController('api')(app).router);
app.registerRouteConfig('', app.getController('error404')(app).router);
app.registerRouteConfig('', app.getController('error'));


module.exports = app;
