angular.module('mainApp', ['appRoutes', 'userControllers', 'userService', 'mainControllers', 'userManagementController', 'stockManagementController', 'setupController'])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    })