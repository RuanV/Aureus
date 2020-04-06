angular.module('stockManagementController', ['stockServices'])
    .controller('stockManagement', function($scope, $http, $location, $timeout, $compile, Stock) {

        $scope.StockItem = {};
        $scope.FetchefStock = [];
        $scope.StockbeenFetched = false;

        $scope.LoadingHTMl = '<div class="loader"></div>';

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


        $scope.GetStock = function() {
            Stock.getStock().then(function(data) {
                if (data.data.success) {
                    if ($scope.userisAdmin) {
                        if (data.data.items) {
                            console.log(data.data.items);
                            $scope.FetchefStock = data.data.items;
                            $scope.StockbeenFetched = true;
                        }
                    } else {
                        Swal.fire({
                            title: 'Access Denied',
                            icon: 'warning',
                            allowOutsideClick: false,
                            timer: 2000,
                            onClose: () => {
                                $location.path('/');
                            }
                        })
                    }

                } else {
                    $scope.StockbeenFetched = false;
                }
            })
        }
        $scope.Sold = function(value) {
            var setval = "No";
            if (value) {
                setval = "Yes";
            } else {
                setval = "No";
            }

            return setval;
        }

        $scope.file = "";

        $scope.GetStock();
        $scope.ImageReady = false;
        $scope.getBase64 = [];


        $scope.addstockHTML = '<div id="AngularApply">' +
            '<form>' +
            '<label>Item Name:</label>' +
            '<input class="form-control" type="text" name="name" placeholder="Please Provide Name" ng-model="StockItem.name" required>' +
            '<br>' +
            '<label>Model:</label>' +
            '<input class="form-control" type="text" name="name" placeholder="Please Provide Model" ng-model="StockItem.model">' +
            '<br>' +
            '<label>Price (R):</label>' +
            '<input class="form-control" type="number" name="name" placeholder="Please Provide Price" ng-model="StockItem.price" required>' +
            '<br>' +
            '<label>Description:</label>' +
            '<input class="form-control" type="text" name="name" placeholder="More details" ng-model="StockItem.description" ng-change="">' +
            '<br>' +
            '<label>Cover Photos:</label>' +
            '<input type="file" id="files" multiple>' +
            '<label ng-if="!continue" style="color:red">Please Select a File Before Continue</label>' +
            '<br>' +
            '<label ng-if="!continue" style="color:red">FileType: jpeg,png</label>' +
            '<br>' +
            '<br>' +
            '<label >Category:</label>' +
            '<select class="form-control" ng-model="StockItem.category" required>' +
            '<option value="Boat">Boat</option>' +
            '<option value="Caravan">Caravan</option>' +
            '<option value="Trailer">Trailer</option>' +
            '</select>' +
            '</form>' +
            '</div>';

        $scope.COnvertBlobtoURL = function(blob) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
                console.log(reader.result);
                return reader.result;
            }

        };
        $scope.imageBlobs = [];

        var resizeImage = function(settings) {
            var file = settings.file;
            var maxSize = settings.maxSize;
            var reader = new FileReader();
            var image = new Image();
            var canvas = document.createElement('canvas');
            var dataURItoBlob = function(dataURI) {
                var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                    atob(dataURI.split(',')[1]) : unescape(dataURI.split(',')[1]);
                var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var max = bytes.length;
                var ia = new Uint8Array(max);
                for (var i = 0; i < max; i++)
                    ia[i] = bytes.charCodeAt(i);
                return new Blob([ia], { type: mime });
            };
            var resize = function() {
                var width = image.width;
                var height = image.height;
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg');
                return dataURItoBlob(dataUrl);
            };
            return new Promise(function(ok, no) {
                if (!file.type.match(/image.*/)) {
                    no(new Error("Not an image"));
                    return;
                }
                reader.onload = function(readerEvent) {
                    image.onload = function() { return ok(resize()); };
                    image.src = readerEvent.target.result;
                };
                reader.readAsDataURL(file);

            });
        };

        $scope.AddStockItem = function() {
            $scope.getBase64 = [];
            Swal.fire({
                title: 'Add Stock Item',
                html: $scope.addstockHTML,
                showCancelButton: true,
                allowOutsideClick: false,
                onBeforeOpen: () => {},
                onOpen: function() {

                    setTimeout(function() {
                        $scope.$apply();
                        $compile($('#AngularApply').contents())($scope);

                        function readFile(file) {
                            var reader = new FileReader();
                            return new Promise((resolve, reject) => {
                                reader.onload = event => resolve(reader.result);
                                reader.onerror = error => reject(error);
                                reader.readAsDataURL(file);
                            })

                        }
                        document.getElementById('files').addEventListener('change', function(event) {
                            var input = event.target;
                            if ('files' in input && input.files.length > 0) {

                                var allFiles = input.files;
                                for (var i = 0; i < allFiles.length; i++) {
                                    console.log(allFiles[i].type);
                                    $scope.continue = false;
                                    resizeImage({
                                        file: allFiles[i],
                                        maxSize: 500
                                    }).then(function(resizedImage) {
                                        console.log("upload resized image");
                                        var reader = new FileReader();
                                        reader.readAsDataURL(resizedImage);
                                        reader.onloadend = function() {
                                            var base64data = reader.result;
                                           $scope.getBase64.push(base64data);
                                        }
                                    }).catch(function(err) {
                                        console.error(err);
                                    });
                                }
                            }

                        })
                    }, 500)
                },
                preConfirm: function() {
                    $scope.continue = false;
                    console.log(typeof $scope.StockItem.name);
                    if (($scope.getBase64.length > 0) && (typeof $scope.StockItem.name !== "undefined") && (typeof $scope.StockItem.model !== "undefined") && (typeof $scope.StockItem.price !== "undefined") && (typeof $scope.StockItem.category !== "undefined")) {
                        $scope.continue = true;
                        return $scope.continue;
                    } else {
                        $scope.continue = false;
                        return $scope.continue;
                    }
                }
            }).then((result) => {
                if (result.value) {
                    $scope.StockItem.media = $scope.getBase64;
                    console.log($scope.StockItem);
                    Stock.create($scope.StockItem).then(function(data) {
                        console.log(data);
                        if (data.data.success) {
                            Swal.fire({
                                title: data.data.message,
                                icon: 'success',
                                allowOutsideClick: false,
                                timer: 2000
                            })
                            $scope.StockItem = {};
                            $scope.GetStock();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: data.data.message + " Please Make sure all required fields are filled in",
                            }).then((result) => {
                                if (result.value) {
                                    $scope.AddStockItem();
                                }
                            })


                        }
                    });

                }
            })
        };

        $scope.EditItem = {};
        $scope.editstockHTML = '<div id="AngularApply">' +
            '<form>' +
            '<label>Item Name:</label>' +
            '<input class="form-control" type="text" name="name" placeholder="Please Provide Name" ng-model="EditItem.name" required>' +
            '<br>' +
            '<label>Model:</label>' +
            '<input class="form-control" type="text" name="name" placeholder="Please Provide Model" ng-model="EditItem.model">' +
            '<br>' +
            '<label>Price (R):</label>' +
            '<input class="form-control" type="number" name="name" placeholder="Please Provide Price" ng-model="EditItem.price" required>' +
            '<br>' +
            '<label>Description:</label>' +
            '<input class="form-control" type="text" name="name" placeholder="More details" ng-model="EditItem.description" ng-change="">' +
            '<br>' +
            '<label>Cover Photos:</label>' +
            '<input type="file" id="files" multiple>' +
            '<label ng-if="!continue" style="color:red">Please Select a File Before Continue</label>' +
            '<br>' +
            '<label ng-if="!continue" style="color:red">FileType: jpeg,png</label>' +
            '<br>' +
            '<label>Sold:</label>' +
            '<label class="switch"> <input type="checkbox" ng-model="EditItem.sold"><span class="slider round"></span></label>' +
            '<br>' +
            '<label >Category:</label>' +
            '<select class="form-control" ng-model="EditItem.category" required>' +
            '<option value="Boat">Boat</option>' +
            '<option value="Caravan">Caravan</option>' +
            '<option value="Trailer">Trailer</option>' +
            '</select>' +
            '<br>' +
            '<a href="" ng-if="IsMobile"><button type="button" class="btn btn-danger" ng-click="deleteStockItem(EditItem)" style="background-color: rgba(244, 67, 54,0.6);">&#x2297;</button></a>' +
            '<br>' +
            '</form>' +
            '</div>';

        $scope.EditStockItem = function(item) {
            console.log(item);
            $scope.EditItem = {};
            $scope.EditItem = item;
            $scope.getBase64 = item.media;
            Swal.fire({
                title: 'Add Stock Item',
                html: $scope.editstockHTML,
                showCancelButton: true,
                allowOutsideClick: false,
                onBeforeOpen: () => {},
                onOpen: function() {

                    setTimeout(function() {
                        $scope.$apply();
                        $compile($('#AngularApply').contents())($scope);

                        function readFile(file) {
                            var reader = new FileReader();
                            return new Promise((resolve, reject) => {
                                reader.onload = event => resolve(reader.result);
                                reader.onerror = error => reject(error);
                                reader.readAsDataURL(file);
                            })

                        }
                        document.getElementById('files').addEventListener('change', function(event) {
                            var input = event.target;
                            if ('files' in input && input.files.length > 0) {

                                var allFiles = input.files;
                                for (var i = 0; i < allFiles.length; i++) {
                                    console.log(allFiles[i].type);
                                    if ((allFiles[i].type === "image/png") || (allFiles[i].type === "image/jpeg")) {
                                        readFile(allFiles[i]).then((content) => {
                                            $scope.continue = true;

                                            $scope.getBase64.push(content);
                                        })
                                    }
                                }
                            }

                        })
                    }, 300)
                },
                preConfirm: function() {
                    $scope.continue = false;
                    if (($scope.getBase64.length > 0) && (typeof $scope.EditItem.name !== "undefined") && (typeof $scope.EditItem.model !== "undefined") && (typeof $scope.EditItem.price !== "undefined") && (typeof $scope.EditItem.category !== "undefined")) {
                        $scope.continue = true;
                        return $scope.continue;
                    } else {
                        $scope.continue = false;
                        return $scope.continue;
                    }
                }
            }).then((result) => {
                if (result.value) {
                    $scope.LoadingSWAL();
                    $scope.EditItem.media = $scope.getBase64;
                    Stock.editStockItem($scope.EditItem).then(function(data) {
                        console.log(data)
                        if (data.data.success) {
                            Swal.fire({
                                title: 'Item Added Successfull',
                                icon: 'success',
                                allowOutsideClick: false,
                                timer: 1000
                            })
                            $scope.StockItem = {};
                            $scope.GetStock();
                            $scope.EditItem = {};
                        } else {
                            Swal.fire({
                                icon: 'error',
                                text: data.data.message + " Please Make sure all required fields are filled in",
                            }).then((result) => {
                                if (result.value) {
                                    $scope.AddStockItem();
                                }
                            })
                        }
                    });
                }
            })
        };



        $scope.deleteStockItem = function(item) {
            Swal.fire({
                title: 'Delete ' + item.name,
                text: "Are you Sure you want to Delete This Item",
                showCancelButton: true,
            }).then((result) => {
                if (result.value) {
                    $scope.LoadingSWAL();
                    Stock.deleteStockItem(item._id).then(function(data) {
                        console.log(data.data);
                        if (data.data.success) {
                            Swal.fire({
                                title: 'Item Deleted Successful',
                                icon: 'success',
                                timer: 2000
                            })
                            $scope.GetStock();
                        } else {
                            $scope.ShowMoreError = data.data.message;
                        }
                    })

                }
            })
        }
    })