'use strict';

angular.module('oto', ['ngCookies', 'ngRoute'])
.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

   //Templates are preloaded with an id in index.jade
    $routeProvider.when('/',
        {
            templateUrl:    'home',
            controller:     'HomeCtrl',
            access:         access.user
        });
    $routeProvider.when('/login',
        {
            templateUrl:    'login',
            controller:     'LoginCtrl',
            access:         access.anon
        });
    $routeProvider.when('/household',
        {
            templateUrl:    'household',
            controller:     'HouseholdCtrl',
            access:         access.user
        });
    $routeProvider.when('/admin',
        {
            templateUrl:    'admin',
            access:         access.admin
        });
    $routeProvider.when('/401', 
        {
            templateUrl:    '401.html',
            access:         access.public
        });
    $routeProvider.when('/404',
        {
            templateUrl:    '404',
            access:         access.public
        });
    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        };
    });

}])

    .run(['$rootScope', '$location', '$http', 'Auth', 
       function ($rootScope, $location, $http, Auth) {
        //init rootscope objects. I want to have separete objects for my modules
        $rootScope.core = {};
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            //Reset subnav
            $rootScope.core.subnavurl = '';
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
               if(Auth.isLoggedIn()) {
                  $location.path('/401').replace(); //tell user that he is not allowed
               } else {
                  $rootScope.core.savedLocation = $location.url();
                  $location.path('/login');
               }
            }
        });

    }]);