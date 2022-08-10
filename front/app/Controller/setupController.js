angular
  .module("setupController", [])
  .controller("setup", function ($scope, $http, $location, $timeout, $compile) {
    console.log("this is the Setup Controller");

    $scope.getDetails = function () {
      $http.get("/api/getcontacts").then(function (data) {
        if (data.data.contact) {
          $scope.Setup = data.data.contact;
        } else {
          Swal.fire({
            title: data.data.message,
            icon: "error",
            allowOutsideClick: false,
            timer: 1000,
          });
        }
      });
    };
    $scope.getDetails();

    $scope.regContact = function (data) {
      $http.post("/api/contact", data).then(function (data) {
        console.log(data);
        if (data.data.success) {
          Swal.fire({
            title: "Contact Details has been Saved",
            icon: "success",
            allowOutsideClick: false,
            timer: 1000,
          });
        } else {
          Swal.fire({
            title: data.data.message,
            icon: "error",
            allowOutsideClick: false,
            timer: 1000,
          });
        }
      });
    };
  });
