var app = angular.module('appRoutes', ['ngRoute'])

    .config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
                templateUrl: 'app/views/pages/home.html'
            })

            .when('/contact', {
                templateUrl: 'app/views/pages/contact.html'
            })
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'registrationController',
                controllerAS: 'register',
                authenticated: false
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })
            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })
            .when('/displayItem', {
                templateUrl: 'app/views/pages/display/display.html'
            })
            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                authenticated: true
            })
            .when('/usermanagement', {
                templateUrl: 'app/views/pages/management/usermanagement.html',
                controller: 'userManagement',
                controllerAS: 'userManagement',
                authenticated: true,
                permission: ['admin', 'moderator']
            })
            .when('/setup', {
                templateUrl: 'app/views/pages/management/setup.html',
                controller: 'setup',
                controllerAS: 'setup',
                authenticated: true,
                permission: ['admin', 'moderator']
            })
            .when('/stockmanagement', {
                templateUrl: 'app/views/pages/management/stock.html',
                controller: 'stockManagement',
                controllerAS: 'stockManagement',
                authenticated: true,
                permission: ['admin', 'moderator']
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })



app.run(['$rootScope', 'Auth', 'User', function($rootScope, Auth, User) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        //console.log(Auth.isLoggedIn());

        if (next.$$route.authenticated === true) {
            if (Auth.isLoggedIn()) {
                //event.preventDefault();
                //console.log("Inside Permission")
                if (next.$$route.permission) {
                    User.getPermission().then(function(data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route[1] !== data.data.permission) {
                                event.preventDefault();
                            }
                        }
                    })
                }
            }
        } else if (next.$$route.authenticated === false) {
            console.log("No Authentication");
        } else {
            console.log("No Authentication Needed");
        }
    })
}])