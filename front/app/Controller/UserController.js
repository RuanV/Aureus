angular.module('userControllers', ['userService'])

    .controller('registrationController', function($scope, $http, $location, $timeout, User) {
        $scope.RegData = {};
        $scope.regUser = function(data) {
            console.log(data);
            console.log($scope.passConfirmed);
            if ($scope.passConfirmed) {
                User.create(data).then(function(data) {
                    console.log(data.data.success);
                    console.log(data.data.message);

                    if (data.data.success) {
                        $scope.MessagValidate = true;
                        $scope.MessagValidateMessage = data.data.message;
                        $timeout(function() { $location.path('/') }, 1200);
                    } else {
                        $scope.MessagValidate = false;
                        $scope.MessagValidateMessage = data.data.message;
                    }

                });
            }
        }

        $scope.CheckUsername = function(regData) {

            $scope.usernameInvalid = false;
            User.checkusername(regData).then(function(data) {
                if (data.data.success) {
                    $scope.usernameInvalid = false;
                    $scope.usernameMSg = data.data.message;
                } else {
                    $scope.usernameInvalid = true;
                    $scope.usernameMSg = data.data.message;
                }
            });

        }
        $scope.CheckEmail = function(regData) {
            $scope.emailInvalid = false;
            User.checkemail(regData).then(function(data) {
                if (data.data.success) {
                    $scope.emailInvalid = false;
                    $scope.emailMSg = data.data.message;
                } else {
                    $scope.emailInvalid = true;
                    $scope.emailMSg = data.data.message;

                }
            });

        }



    })

    .directive('match', function() {
        return {
            restrict: 'A',
            controller: function($scope) {
                $scope.passConfirmed = false;
                $scope.doConfirm = function(values) {
                    values.forEach(function(let) {
                        if ($scope.confirm == let) {
                            $scope.passConfirmed = true;
                        } else {
                            $scope.passConfirmed = false;
                        }
                    })
                }
            },
            link: function(scope, element, attrs) {
                attrs.$observe('match', function() {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                })

                scope.$watch('confirm', function() {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                })
            }
        }
    })