'use strict';

var app = angular.module('app', [
    'ngRoute',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers'
]);

app.config(['$routeProvider',
    function($routeProvider) {
    }
]);

var appControllers = angular.module('app.controllers', []);

appControllers.controller('appCtrl', [
    '$scope',
    function($scope) {
        //do something with scope
    }
]);
var appDirectives = angular.module('app.directives', []);
var appFilters = angular.module('app.filters', []);
var appServices = angular.module('app.services', []);