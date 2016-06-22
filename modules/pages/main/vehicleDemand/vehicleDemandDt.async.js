var app = angular.module('exingcai_captain_web');


app.register.controller('vehicleDemandDt', function ($scope, $rootScope, $uibModal, $log, $http, $stateParams, listService, pagerConfig, domainConfig) {

    $scope.vehicleDemand = {

    };
    $scope.productList = [];
    $rootScope.demandId = $stateParams.DemandId;
    $scope.showCommit = false;
    $scope.standardizedDemand = true;

    $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/" + $rootScope.demandId;


    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.queryDemandDt = function () {
        listService.events($scope.url).success(function (data, status, headers) {
            $scope.vehicleDemand = data.vehicleDemand;
            if (!$scope.vehicleDemand.fromWarehouseId) {
                $scope.standardizedDemand = false;
            }
            if ($scope.vehicleDemand.status == 100) {
                $scope.showCommit = true;
            }

        });
        listService.events($scope.url + "/products").success(function (data, status, headers) {
            $scope.productList = data.vehicleDemandProductList.dataList;
            $scope.totalItems = $scope.productList.length;

        });
        listService.events($scope.url + "/vehicleDispatchs").success(function (data, status, headers) {
            $scope.dispatchList = data.vehicleDispatchList;

        });

    };
    $scope.queryDemandDt();

    $scope.animationsEnabled = true;

    $scope.open = function (dispatch, title) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'vehicleDispatchDtlController.html',
            controller: 'vehicleDispatchDtlController',
            size: null,
            resolve: {
                title: function () {
                    return title;
                },
                standardizedDemand: function () {
                    return $scope.standardizedDemand;
                }
            }
        });
        $rootScope.dispatch = dispatch;
        $rootScope.queryDemandDt = $scope.queryDemandDt;
        $rootScope.dispatch = dispatch;

        modalInstance.result.then(function (selectedItem) {
            alert(JSON.stringify(selectedItem));
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log("pageChanged");
        $scope.queryProdoct();

    };

    $scope.commitDispatchList = [];
    $scope.commitDispatch = function () {
        if ($scope.commitDispatchList.length <= 0) {
            alert("您没有选择");
            return;
        }
        var commitData = {
            "dispatchIds": $scope.commitDispatchList
        }
        $http({
            method: 'put',
            url: domainConfig.dispatchDomain + 'captain/vehicleDemand/dispatchCommit/',
            data: JSON.stringify(commitData),  // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            console.log(data);
            if (!data.success) {
                toastr['error']('提交失败', data.msg);
            } else {
                $scope.showCommit = false;
                $scope.queryDemandDt();
                toastr['success']('提交成功！', '提示');
            }
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
    };
    $scope.toggleDispatchSelection = function (dispatchId) {
        var idx = $scope.commitDispatchList.indexOf(dispatchId);
        // is currently selected
        if (idx > -1) {
            $scope.commitDispatchList.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.commitDispatchList.push(dispatchId);
        }
    };




});
app.register.controller('vehicleDispatchDtlController', function ($rootScope, $scope, $http, $uibModalInstance, title, standardizedDemand, listService, pagerConfig, domainConfig) {
    $scope.productList = [],
        $scope.driverList = [],
        $scope.checkedDriverList = [],
        $scope.product4Dispatch = [];
    $scope.title = title;
    $scope.standardizedDemand = standardizedDemand;

    $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/" + $rootScope.demandId + "/allProduct";
    listService.events($scope.url).success(function (data, status, headers) {
        $scope.productList = data.vehicleDemandProductList.dataList;

    });

    $scope.updateDispatchId = "";
    $scope.checkedDriverList = [];
    $scope.product4Dispatch = [];
    if ($rootScope.dispatch != undefined && $rootScope.dispatch != null) {
        $scope.checkedDriverList = $rootScope.dispatch.vehicleDispatchDriverList;
        $scope.product4Dispatch = $rootScope.dispatch.vehicleDispatchProducts;
        $scope.updateDispatchId = $rootScope.dispatch.id;
    } else {
        $scope.updateDispatchId = "";
    }
    $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/" + $rootScope.demandId + "/allProduct";

    listService.events($scope.url).success(function (data, status, headers) {
        $scope.productList = data.vehicleDemandProductList.dataList;
        console.log($scope.productList[0].productId)
        $scope.productSelectObj = $scope.productList[0].productId;
    });


    $scope.updateDispatchId = "";
    $scope.checkedDriverList = [];
    $scope.product4Dispatch = [];
    if ($rootScope.dispatch != undefined && $rootScope.dispatch != null) {
        $scope.checkedDriverList = $rootScope.dispatch.vehicleDispatchDriverList;
        $scope.product4Dispatch = $rootScope.dispatch.vehicleDispatchProducts;
        console.log($scope.product4Dispatch[0]);
        $scope.updateDispatchId = $rootScope.dispatch.id;
    } else {
        $scope.updateDispatchId = "";
    }
    var driverUrl = domainConfig.dispatchDomain + "captain/vehicleDriver/vehicleDriverList";
    $scope.getDriver = function () {
        listService.events(driverUrl).success(function (data, status, headers) {
            $scope.driverList = data.vehicleDrivers.dataList;
            if ($scope.firstInit) {
                $scope.totalItems = data.vehicleDrivers.total;
                $scope.firstInit = false;
            }
        });
    };

    $scope.getDriver();
    $scope.addProduct4Dispatch = function () {
        angular.forEach($scope.productList, function (obj, k) {
            if ($scope.productSelectObj == obj.productId) {
                if ($scope.ifExistsProduct(obj.productId)) {
                    $scope.errorMsg = "已经添加" + obj.productName + "/" + obj.productBrand + "的货物信息";
                } else {
                    $scope.errorMsg = "";
                    $scope.product4Dispatch.push(obj);
                }
            }
        })
    };
    $scope.ifExistsProduct = function (productId) {
        var exist = false;
        angular.forEach($scope.product4Dispatch, function (obj, k) {
            if (productId == obj.productId) {
                exist = true;
            }
        });
        return exist;
    }

    $scope.getChecked = function (driver) {
        var checked = false;
        for (var i = 0; i < $scope.checkedDriverList.length; i++) {
            if (driver.deliveryToolId == $scope.checkedDriverList[i].deliveryToolId) {
                checked = true;
            }
        }
        return checked;
    }

    $scope.toggleDriverSelection = function (driver) {
        var find = false;
        var idx = -1;
        for (var i = 0; i < $scope.checkedDriverList.length; i++) {
            if (driver.deliveryToolId == $scope.checkedDriverList[i].deliveryToolId) {
                find = true;
                idx = i;
                break;
            }
        }
        // is currently selected
        if (find) {
            $scope.checkedDriverList.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.checkedDriverList.push(driver);
        }
    };
    
    $scope.toggleDriverSelectionRadio = function(driver){
        $scope.checkedDriverList = []; //clear firstInit
        $scope.checkedDriverList.push(driver);
    }

    $scope.change = function (x) {
        console.log(x);
        alert("ok");
    };

    $scope.ok = function () {
        var driverIds = [];
        angular.forEach($scope.checkedDriverList, function (data) {
            driverIds.push(data.driverId);
        });
        var updateProducts = [];
        angular.forEach($scope.product4Dispatch, function (data) {
            var updateProduct = {
                "countUnit": data.countUnit,
                "productId": data.productId,
                "productSpecify": data.productSpecify,
                "productTotalCount": data.productTotalCount,
                "productTotalWei": data.productTotalWei,
                "id": data.id,
                "weiUnit": data.weiUnit
            };
            updateProducts.push(updateProduct);
        });

        var formData = {
            "endDate": "",
            "remark": "",
            "startDate": "2016-04-23",
            "vehicleDemandId": $rootScope.demandId,
            "vehicleDispatchDriverList": driverIds,
            "vehicleDispatchId": $scope.updateDispatchId,
            "vehicleDispatchProducts": updateProducts
        };
        $http({

            method: 'put',
            url: domainConfig.dispatchDomain + 'captain/cargo/vehicleDispatch/',
            data: JSON.stringify(formData),  // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function (data) {
            console.log(data);
            if (!data.success) {
                toastr['error']('保存失败', data.msg);
            } else {
                toastr['success']('保存成功', '提示');
                $rootScope.queryDemandDt();
                $uibModalInstance.dismiss('cancel');
            }
        }).error(function (data, status, headers, config) {
            console.log(data);
            $uibModalInstance.dismiss('cancel');
        });

    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});