angular.module('userService', [])

    .factory('User', function($http) {
        userFactory = {};

        userFactory.create = function(data) {
            return $http.post('/api/users', data)
        };
        //User.checkusername();
        userFactory.checkusername = function(data) {
            return $http.post('/api/checkusername', data)
        };
        //User.checkemail();
        userFactory.checkemail = function(data) {
            return $http.post('/api/checkemail', data)
        };
        userFactory.getPermission = function() {
            return $http.get('/api/permission');
        };

        userFactory.getUser = function(){
        	return $http.get('/api/usersmanagement');
        };

        userFactory.EditUsers = function(data){
        	console.log("Inside Data");
        	console.log(data);
        	return $http.put('/api/edit',data);
        };

        userFactory.deleteUser =function(username){
        	return $http.delete('/api/management/'+ username);
        };

        return userFactory;
    })