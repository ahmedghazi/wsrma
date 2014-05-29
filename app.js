
/**
 * This is an Express eRApp instance, extended by express rapido
 * @type ExpressRapido
 */
var eRApp = require('./config/expressRapido.js')();

eRApp.boot();

eRApp.registerModel('User', 'user');
eRApp.registerModel('Option', 'option');

eRApp.registerController('request');
eRApp.registerController('security');
eRApp.registerController('home');
eRApp.registerController('error404');
eRApp.registerController('error');

eRApp.registerRouteConfig('*', eRApp.getController('request'));
eRApp.registerRouteConfig('/security', eRApp.getController('security')(eRApp).router);
eRApp.registerRouteConfig('/', eRApp.getController('home')(eRApp).router);
eRApp.registerRouteConfig('', eRApp.getController('error404')(eRApp).router);
eRApp.registerRouteConfig('', eRApp.getController('error'));

module.exports = eRApp;
