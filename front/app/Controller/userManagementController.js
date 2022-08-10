angular
  .module("userManagementController", [])
  .controller(
    "userManagement",
    function ($scope, $http, $location, $timeout, User, $compile) {
      $scope.LoadingUsers = true;
      $scope.AccesDenied = true;
      $scope.errmessag = false;
      $scope.AppUsers = [];
      $scope.EditAccess = false;
      $scope.DeleteAccess = false;
      $scope.ShowUsers = 10;

      function getUsers() {
        User.getUser().then(function (data) {
          if (data.data.success) {
            if (
              data.data.permission === "admin" ||
              data.data.permission === "moderator"
            ) {
              console.log(data.data.users);
              $scope.AppUsers = data.data.users;
              $scope.LoadingUsers = true;
              $scope.AccesDenied = false;

              if (data.data.permission === "admin") {
                $scope.EditAccess = true;
                $scope.DeleteAccess = true;
              } else if (data.data.permission === "moderator") {
                $scope.EditAccess = true;
                $scope.DeleteAccess = false;
              }
            } else {
              $scope.errmessag = "permission Denied";
              $scope.LoadingUsers = false;
            }
          } else {
            $scope.errmessag = data.data.message;
            $scope.LoadingUsers = false;
          }
        });
      }
      getUsers();

      $scope.deleteUser = function (username) {
        Swal.fire({
          title: "Delete " + username,
          text: "Are you Sure you want to Delete This Item",
          showCancelButton: true,
        }).then((result) => {
          if (result.value) {
            User.deleteUser(username).then(function (data) {
              if (data.data.success) {
                getUsers();
              } else {
                $scope.ShowMoreError = data.data.message;
              }
            });
          }
        });
      };
      $scope.EditUserDetails = {};
      $scope.editHTML =
        '<div id="AngularApply">' +
        "<form>" +
        "<label>Email:</label>" +
        '<input class="form-control" type="email" name="email" placeholder="Please Provide Email" ng-model="EditUserDetails.email">' +
        "<br>" +
        "<label>Full Name:</label>" +
        '<input class="form-control" type="text" name="name" placeholder="Please Provide Name" ng-model="EditUserDetails.name">' +
        "<br>" +
        "<label>UserName:</label>" +
        '<input class="form-control" type="text" name="username" placeholder="Please Provide UserName" ng-model="EditUserDetails.username" >' +
        "<br>" +
        '<label ng-if="userisAdmin">Permission:</label>' +
        '<select class="form-control" ng-model="EditUserDetails.permission" ng-if="userisAdmin">' +
        '<option value="admin">Admin</option>' +
        '<option value="user">User</option>' +
        '<option value="moderator">Moderator</option>' +
        "</select>" +
        "<br>" +
        '<a href="" ng-show="DeleteAccess" ng-if="IsMobile"><button type="button" class="btn btn-danger" ng-click="deleteUser(EditUserDetails.username)" style="background-color: rgba(244, 67, 54,0.6);">&#x2297;</button></a>' +
        "<br>" +
        "</form>" +
        "</div>";

      $scope.EditUser = function (user) {
        $scope.EditUserDetails = {};
        $scope.EditUserDetails = user;
        console.log(user);
        Swal.fire({
          title: "Edit User",
          html: $scope.editHTML,
          showCancelButton: true,
          allowOutsideClick: false,
          onBeforeOpen: () => {},
          onOpen: function () {
            //console.log(user);
            setTimeout(function () {
              $scope.$apply();
              $compile($("#AngularApply").contents())($scope);
            }, 200);
          },
        }).then((result) => {
          if (result.value) {
            console.log($scope.EditUserDetails);
            User.EditUsers($scope.EditUserDetails).then(function (data) {
              console.log(data.data.message);
              getUsers();
            });

            $scope.EditUserDetails = {};
          }
        });
      };
    }
  );
