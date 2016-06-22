var app = angular.module('exingcai_captain_web');


app.register.controller('GPSList', function($rootScope, $scope, $uibModal, $log, $http, $injector, listService, pagerConfig, domainConfig) {

    $scope.GPSList = [];
    $scope.tabpane = 0;
    $scope.url = domainConfig.dispatchDomain + "captain/gps/gpsDeviceInfos";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.maxSize = pagerConfig.maxSize;

    $rootScope.queryGPS = function(status) {

        listService.events($scope.url).success(function(data, status, headers) { 
            console.log(data);
            console.log( data.gpsDeviceInfos.dataList);
            $scope.GPSList = data.gpsDeviceInfos.dataList;  
            $scope.totalItems = $scope.GPSList.length;        
        });


    };
    $rootScope.queryGPS();

    // $scope.queryProdoct=function(){
    //  $http.get('http://localhost:9000/exingcai/captain/product/findAll').success(function (data, status, headers, config) {
    //        $scope.productList = data.data;
    //        $scope.totalItems=data.data.length;

    //  $scope.currentPage = 1;
    //  $scope.maxSize = 5;
    //    }).error(function (data, status, headers, config) {
    //        $scope.errorMessage = "Can't retrieve cualuser list!";
    //    });

    // };


    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.queryProdoct();
    };

    $scope.openAddGPSModal = function(size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addGPSModal.html',
            controller: 'AddGPSModalCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(newGPS) {
            console.log(newGPS);
            $http({
                method: 'put',
                url: domainConfig.dispatchDomain + 'captain/gps/gpsDeviceInfo/',
                data: JSON.stringify(newGPS), // pass in data as strings
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                if (!data.success) {} else {
                    $scope.queryGPS();
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.changeStatus = function(gps) {
        var msg = '';
        var originStatus = gps.status;
        var newStatus;
        switch (gps.status) {

            case 100:
                msg = '是否确认激活设备  ' + gps.gpsDeviceCode + "  ?";
                newStatus = 200;
                break;
            case 200:
                msg = '是否确认冻结设备  ' + gps.gpsDeviceCode + "  ?";
                newStatus = 100;
                break;
            default:
                msg = 'status error？';
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            controller: 'MessageCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return {
                        msg: msg
                    };
                }
            }
        });
        modalInstance.result.then(function() {
            gps.status = newStatus;
            $http({
                method: 'put',
                url: domainConfig.dispatchDomain + 'captain/gps/gpsDeviceInfo/',
                data: JSON.stringify(gps), // pass in data as strings
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);

                if (!data.success) {
                    gps.status = originStatus;
                    toastr['error']('失败！', '提示');
                } else {
                    toastr['success']('成功！', '提示');
                }
            }).error(function(data, status, headers, config) {
                gps.status = originStatus;
                toastr['error']('失败！', '提示');
            });
        }, function() {

        });
    };

    $scope.delete = function(gps) {
        var msg = '';
        switch (gps.status) {

            case 100:
                msg = '是否确认删除设备  ' + gps.gpsDeviceCode + "  ?";
                break;

        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            controller: 'MessageCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return {
                        msg: msg
                    };
                }
            }
        });
        modalInstance.result.then(function() {
            $http({
                method: 'put',
                url: domainConfig.dispatchDomain + 'captain/gps/gpsDeviceInfo/delete/' + gps.id,
                // pass in data as strings
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                $rootScope.queryGPS();

                if (!data.success) {} else {}
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }, function() {
            // var modalInstance = $uibModal.open({
            //     animation: true,
            //     templateUrl: 'messageModal.html',
            //     controller: 'MessageCtrl',
            //     size: 'sm',
            //     resolve: {
            //         items: function() {
            //             return {
            //                 msg:msg
            //             };
            //         }
            //     }
            // });
        });
    };

});
//bindDeliveryToolId
app.register.controller('AddGPSModalCtrl', function($http, $scope, $uibModalInstance, domainConfig, pagerConfig, listService, items) {
    $scope.newGPS = {
        status: '200'
    };
    $scope.bindVehicle = 0;
    $scope.isBind = true;
    $scope.vehicleList = [];
    $scope.url = domainConfig.dispatchDomain + "captain/deliveryTool/deliverToolFullInfos?pageStatus.page=1&pageStatus.pageSize=5";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.queryVehicle = function(status) {

        listService.events($scope.url).success(function(data, status, headers) { 
            $scope.vehicleList = data.deliveryToolFull.dataList; 

             
            if ($scope.firstInit) {
                $scope.totalItems = data.deliveryToolFull.total;
                $scope.firstInit = false;
            }        
        });

    };
    $scope.queryVehicle();
    $scope.selectVehicle = function(vehicleID) {
        $scope.bindVehicle = vehicleID;
        $scope.isBind = false;
        $scope.newGPS.bindDeliveryToolId = vehicleID;
        console.log(vehicleID);
    }
    $scope.unbindVehicle = function(vehicleId) {
        $scope.bindVehicle = 0;
        $scope.isBind = true;
        $scope.newGPS.bindDeliveryToolId = "";

    }

    $scope.ok = function() {
        $uibModalInstance.close($scope.newGPS);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
