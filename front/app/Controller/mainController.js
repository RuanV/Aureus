angular.module('mainControllers', ['authServices', 'stockServices','mainAppService'])

    .controller('mainCtrl', function(Auth, $scope, $timeout, $location, $rootScope, User, Stock, $compile, $http,MainService) {
       // Web.App();



       console.log(MainService.FetchEntity("FunctionHeaders"));
        var app = this;
        $scope.LoginUser = {};
        $scope.Functions = [{
            Name: "Users",
            Controller:"UserController",
            ControllerPath:"",
            Icon: "fas fa-users",
            FunctionHeader: "App Management"
        },
        {
            Name: "User Groups",
            Controller:"GroupController",
            ControllerPath:"",
            Icon: "fas fa-universal-access",
            FunctionHeader: "App Management"
        }];
        
        $scope.userisAdmin = false;
        var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
        if (isMobile) {
            $scope.IsMobile = true;
        } else {
            $scope.IsMobile = false;
        }
        $scope.isUserAdmin = function() {
            if (Auth.isLoggedIn()) {
                User.getPermission().then(function(data) {
                    if (data.data.permission == "admin" || data.data.permission == "moderator") {
                        $scope.userisAdmin = true;
                    } else {
                        $scope.userisAdmin = false;
                    }
                });
            }
        };

        $scope.LoadingSWAL = function() {
            Swal.fire({
                title: 'Loading',
                html: $scope.LoadingHTMl,
                icon: 'info',
                showCancelButton: false, // There won't be any cancel button
                showConfirmButton: false,
                allowOutsideClick: false
            })
        }

        $scope.isUserAdmin();
        $scope.DataReady = false;
        $scope.HomepageData = [];

        $scope.HomePageFilter = {};
        $scope.HomePageFilter.sold = false;


        $scope.Loadme = false;
        $rootScope.$on('$routeChangeStart', function() {
            if (Auth.isLoggedIn()) {
                $scope.UserLoggedIn = true;
                console.log("User is Logged In");
                $scope.isUserAdmin();
                Auth.getUser().then(function(data) {
                    console.log(data.data.username);
                    $scope.LoginUser.username = data.data.username;
                    $scope.LoginUser.email = data.data.email;
                    $scope.Loadme = true;
                });
            } else {
                console.log("Failed: User Not Logged In");
                $scope.Userlogged = false;
                $scope.LoginUser.username = "";
                $scope.LoginUser.email = "";
                $scope.Loadme = true;
            }
        });

        if (Auth.isLoggedIn()) {
            $location.path('/navigation');
        }else{
            $location.path('/login');
        }



        $scope.doLogin = function(data) {
            if (data !== null) {
                $scope.LoadingSWAL();
                Auth.login(data).then(function(data) {
                    if (data.data.succces) {
                        $scope.MessagValidate = true;
                        $scope.MessagValidateMessage = data.data.message;
                        Swal.close();
                        $timeout(function() { $location.path('/') }, 1200);
                        $scope.isUserAdmin();
                    } else {
                        $scope.MessagValidate = false;
                        $scope.MessagValidateMessage = data.data.message;
                        Swal.close();
                    }
                });
            }

        }

        $scope.getDetails = function() {
            $http.get('/api/getcontacts').then(function(data) {
                if (data.data.success) {
                    $scope.Setup = data.data.contact;
                } else {
                    Swal.fire({
                        title: data.data.message,
                        icon: 'error',
                        allowOutsideClick: false,
                        timer: 1000
                    });
                }

            });
        }



        $scope.getStockItemandDisplay = function(item) {
            var itemFound = $scope.ViewingData.filter(i => i._id === item._id)[0];
            $scope.ItemDisplayData = itemFound;
            $location.path('/displayItem');

        }

        $scope.BackHome = function() {
            $location.path('/home');
        }

        $scope.Logout = function() {
            Auth.logout();
            $scope.UserLoggedIn = false;
            $location.path('/logout');
            $timeout(function() {
                $location.path('/login');
            }, 2000);
        }

        $scope.LogCheckSpan = "glyphicon glyphicon-log-in";

        $scope.CheckLogin = function() {
            if (Auth.isLoggedIn()) {
                $scope.LogCheckSpan = "glyphicon glyphicon-log-out";
                return "Logout " + $scope.LoginUser.username;
            } else {
                $scope.LogCheckSpan = "glyphicon glyphicon-log-in";
                return "Login";
            }
        }

        $scope.LogFunction = function() {
            if (Auth.isLoggedIn()) {
                $scope.Logout();
            } else {
                $location.path('/login');
            }
        }

        $scope.openNav = function() {
            document.getElementById("mySidebar").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
        }

        $scope.closeNav = function() {
            document.getElementById("mySidebar").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
        }
        $scope.ChnagePNG = 0;
        $scope.ChangeFotoRight = function(item) {
            if (item.length > 0) {
                $scope.ChnagePNG++;
                if ($scope.ChnagePNG >= item.length) {
                    $scope.ChnagePNG = item.length - 1;
                }
            } else {
                $scope.ChnagePNG = 0;
            }
        }

        $scope.ChangeFotoleft = function(item) {
            if (item.length > 0) {
                $scope.ChnagePNG--;
                if ($scope.ChnagePNG <= 0) {
                    $scope.ChnagePNG = 0;
                }
            } else {
                $scope.ChnagePNG = 0;
            }
        }

        $scope.queryHTML = '<div id="AngularApply">' +
            '<form>' +
            '<label>Type in Query:</label>' +
            '<br>' +
            '<textarea name="message" rows="10" cols="30" ng-model="QueryInfo.query">The cat was playing in the garden.</textarea>' +
            '<br>' +
            '<label>Add Cell Number:</label>' +
            '<br>' +
            '<label>Add Email:</label>' +
            '<input class="form-control" type="email" name="email" placeholder="Please Provide Email" ng-model="QueryInfo.queryemail">' +
            '<br>' +
            '<input class="form-control" type="tel" name="altenativecellphone" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" ng-model="QueryInfo.cellnumber" placeholder="082-595-6666" required>' +
            '<br>' +
            '<br>' +
            '<label style="color:red" ng-if="NoInfo">Please Make sure all fields are Filled in</label' +
            '<br>' +
            '</form>' +
            '</div>';

        $scope.SendQuery = function(item) {
            Swal.fire({
                title: 'Send Query',
                html: $scope.queryHTML,
                showCancelButton: true,
                confirmButtonText: "Send Query",
                onBeforeOpen: () => {},
                onOpen: function() {
                    setTimeout(function() {
                        $scope.$apply();
                        $compile($('#AngularApply').contents())($scope);
                    }, 500);
                },
                preConfirm: function() {
                    $scope.QueryInfo.user = $scope.LoginUser;
                    $scope.QueryInfo.item = item.name;
                    $scope.QueryInfo.email = $scope.Setup.email;
                    if ($scope.QueryInfo == "") {
                        console.log(1);
                        $scope.NoInfo = true;
                        return false;
                    } else if ($scope.QueryInfo == {}) {
                        console.log(2);
                        $scope.NoInfo = true;
                        return false;
                    } else {
                        $scope.NoInfo = false;
                        return true;
                    }
                }
            }).then((result) => {
                if (result.value) {
                    console.log($scope.QueryInfo);
                    $scope.LoadingSWAL();
                    $http.post('/api/query', $scope.QueryInfo).then(function(data) {
                        console.log(data.data.success);
                        Swal.close();
                        if (data.data.success) {
                            Swal.fire({
                                title: data.data.message,
                                icon: 'success',
                                allowOutsideClick: false,
                                timer: 1000
                            });
                        } else {
                            Swal.fire({
                                title: data.data.message,
                                icon: 'error',
                                allowOutsideClick: false,
                                timer: 1000
                            });
                        }
                    })
                }
            })
        }
        var toggle = false;
        $scope.ToggleSideNav =function(){
           if(!toggle){
                $( "#PageLogo" ).css( "width", "0px" );
                $( "#MainSideNave" ).css( "width", "0px" );
                toggle = true;
            }else{
                $( "#PageLogo" ).css( "width", "240px" );
                $( "#MainSideNave" ).css( "width", "240px" );
                toggle = false;
            }
        }

        $scope.GoToproducts = function(item) {
            console.log("Test");
            $scope.HomePageFilter.category = item;
            $location.path('/home');
        }

        $scope.SubNavigation = function(url){
            $location.path(url);
            console.log(url);

        }
    })