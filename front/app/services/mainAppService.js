angular.module('mainAppService', [])

    .factory('MainService', function($http) {
        mainFactory = {};

        mainFactory.FetchEntity = function(entity) {
            return $http.get('/api/entity/' + entity);
        };

        return mainFactory;
    })