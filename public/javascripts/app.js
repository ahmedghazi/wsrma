'use strict';

/*angular.module('app', [
    'ngRoute',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
    'angularFileUpload'
]).config(['$routeProvider', function($routeProvider) {
    }
]);

var appControllers = angular.module('app.controllers', []);

appControllers.controller('UserCtrl', [
    '$scope',
    '$upload',
    '$location',
    '$http',
    function($scope, $upload, $location, $http) {
        $scope.user = {};
        $scope.image = false;
        $scope.errors = [];

        $scope.onFileSelect = function($files) {
            var allowedImages = [];
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                if (file.type.indexOf('image') !== -1) {
                    allowedImages.push(file);
                }
            }
            if (allowedImages.length > 0) {
                $scope.image = allowedImages[0];
            }
        };

        $scope.uploadAndSave = function() {
            $scope.errors = [];

            if (!$scope.image) {
                if ($('body').hasClass('fr')) {
                    $scope.errors.push('* L\'image est obligatoire');
                } else {
                    $scope.errors.push('* Image is required');
                }
            }

            if ($scope.errors.length === 0) {
                $scope.upload = $upload.upload({
                    url: '/account/register',
                    method: 'POST',
                    data: {user: $scope.user, form: $('form').serializeArray()},
                    file: $scope.image
                }).progress(function(evt) {
                    var percent = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.uploadPercent = percent;
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    if (!data.success) {
                        $scope.errors = data.errors;
                        $('.errors').addClass('animated pulse');
                    } else {
                        window.location.href = data.url;
                    }
                });
            }
        };
    }
]);

appControllers.controller('PlayerCtrl', [
    '$scope',
    '$upload',
    '$location',
    '$http',
    function($scope, $upload, $location, $http) {
        //$scope.voteCount = 0;
        $scope.vote = function(playerId, voterFbId, token, cb) {
            $http.post('/players/' + playerId + '/vote', {
                voterFbId: voterFbId,
                _csrf: token
            }).success(function(data, status, headers, config) {
                cb(data);
            });
        };
    }
]);


var appDirectives = angular.module('app.directives', []);


appDirectives.directive('imgdynloader', [
    function() {
        return function($scope, $element, attrs) {

            $scope.$watch('ngSrc', function() {
                $element.css({opacity: '0'});
                $element.parent().css({background: '#fff url(/images/ajax-loader.gif) center center no-repeat'});
                //set source to the image
                var img = new Image();
                img.src = attrs.src;
                img.onload = function() {
                    var $img = $(this);
                    $img.width($element.width());
                    $img.height($element.height());
                    //if image load is successful
                    //create an jQuery object out of this image
                    $element.replaceWith($img);
                };
            });
        };
    }
]);
appDirectives.directive('datepicker', [
    function() {
        return function($scope, $element, attrs) {
            $element.datepicker({
                dateFormat: attrs.datepicker,
                yearRange: '-100:-18',
                changeYear: true
            });
        };
    }
]);

appDirectives.directive('fbinvite', [
    function() {
        return function($scope, $element, attrs) {
            $element.click('click', function(e) {
                e.preventDefault();
                var url = attrs.href;
                var hostUrl = location.protocol + '//' + location.host + url;
                //FB.api('?id=' + hostUrl, {}, function(response) {
                // console.log(response);
                // });
                FB.ui({
                    method: 'apprequests',
                    //object_id: hostUrl,
                    //action_type: 'askfor',
                    data: {
                        redirectUrl: hostUrl
                    },
                    message: 'Invite friends to get more votes'
                }, function(response) {
                    if (response) {
                        console.log(response);
                    }
                });
            });
        };
    }
]);

appDirectives.directive('votebutton', [
    '$timeout',
    function($timeout) {
        return function($scope, $element, attrs) {
            $element.on('click.all', function(e) {
                e.preventDefault();
            });
            var vote = function(votebutton, uid, token) {
                $scope.vote(votebutton, uid, token, function(data) {
                    if (data.success) {
                        $scope.voteCount++;
                        $scope.errorVote = '';
                        $scope.successVote = data.message;
                    } else {
                        $scope.errorVote = data.error;
                        $scope.successVote = '';
                    }
                    $timeout(function() {
                        $element.on('click.vote', click);
                    }, 1000);
                });
            };

            var click = function(e) {
                $element.unbind('click.vote');
                var token = attrs.token;
                e.preventDefault();
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        var uid = response.authResponse.userID;
                        vote(attrs.votebutton, uid, token);
                    } else {
                        //if (response.status === 'not_authorized') {
                        // the user is logged in to Facebook, 
                        // but has not authenticated your app
                        FB.login(function(response) {
                            if (response.authResponse) {
                                var uid = response.authResponse.userID;
                                vote(attrs.votebutton, uid, token);
                            }
                        });
                    }
                });
            };
            $element.on('click.vote', click);
        };
    }
]);
appDirectives.directive('fbshare', [
    function() {
        return function($scope, $element, attrs) {
            $element.click('click', function(e) {
                e.preventDefault();
                var url = attrs.href;
                var targetingL = null;
                var hostUrl = 'https://' + location.host + url;
                if ($('body').hasClass('fr')) {
                    targetingL = {
                        'locales': ['1003']
                    };
                    hostUrl += '?fb_locale=fr_FR';
                } else {
                    targetingL = {
                        'locales': ['1001']
                    };
                    hostUrl += '?fb_locale=en_US';
                }
                FB.ui({
                    method: 'feed',
                    link: hostUrl,
                    title: attrs.title
                });
            });
        };
    }
]);

appDirectives.directive('fbconnectFull', [
    function() {
        function pad(num) {
            num = num.toString();
            var s = "";
            if (num.length <= 1) {
                s = "0" + num.toString();
            }
            return s;
        }
        return function($scope, $element, attrs) {
            $element.click(function(e) {
                e.preventDefault();
                FB.login(function(response) {
                    if (response.authResponse) {
                        FB.api('/me', function(response) {
                            $scope.user.firstname = response.first_name;
                            $scope.user.lastname = response.last_name;
                            $scope.user.username = response.username;
                            $scope.user.email = response.email;
                            $scope.user.facebookId = response.id;
                            $scope.user.facebookEmail = response.email;
                            var date = new Date(response.birthday);
                            $scope.user.dateOfBirth = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
                            response.gender === 'male' ? $scope.user.title = 0 : $scope.user.title = 1;
                            $scope.$apply();
                        });
                        //fetch if user like the page or not
                        //FB.api('/me/likes/371751712872681', function(response) {
                        // console.log('likes:', response);
                        // });
                    }
                }, {scope: 'email,user_birthday,user_likes'});
            });
        };
    }
]);

angular.module('app.filters', []).filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }
]);


angular.module('app.services', []).value('version', '0.1');*/
