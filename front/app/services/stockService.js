angular.module('stockServices', [])

    .factory('Stock', function($http, $window, $q) {
        var stockFactory = {};


        stockFactory.create = function(data) {

            console.log(data);
            //data = {name:"ruan"};
            return $http.post('/api/stock', data);
        };

        stockFactory.getStock = function() {

            return $http.get('/api/stockmanagement');
        };
        stockFactory.getHomepage = function() {

            return $http.get('/api/homepagedata');
        };
        stockFactory.editStockItem = function(item) {

            console.log(item);
            return $http.put('/api/editstock', item);
        };
        stockFactory.deleteStockItem = function(id) {
            return $http.delete('/api/managestock/' + id);
        };

        stockFactory.getStockByID = function(id) {
            return $http.get('/api/getstockmanagement/' + id);
        };

        return stockFactory;
    })