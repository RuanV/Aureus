angular
  .module("advertController", [])
  .controller(
    "advert",
    function ($scope, $http, $location, $timeout, $compile) {
      console.log("this is the Advert Controller");
    }
  );
