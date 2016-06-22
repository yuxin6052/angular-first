var app = angular.module('exingcai_captain_web');

app.register.controller('driverList', function($scope, $uibModal, $log, $http, listService, pagerConfig, domainConfig) {
    $scope.dataList = [];
    $scope.tabpane = 0;

    $scope.url = domainConfig.witchDomain + "witch/driver/queryDriverInfoListForPage";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;

    var handleDatePickers = function() {

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }

    };
    handleDatePickers();


    $scope.queryDemand = function(status) {

        listService.events($scope.url).success(function(data, status, headers) { 
            console.log(data);
            $scope.dataList = data.pageInfoRespDTOs.datas;  
            angular.forEach($scope.demandList, function(obj, k) {
                var isAvaliable = obj.isAvaliable;
                switch (isAvaliable) {
                    case "0":
                        obj.isAvaliable = 0;
                        break;
                    case "1":
                        obj.status = 1;
                        break;


                }
            });       

            if ($scope.firstInit) {
                $scope.totalItems = data.pageInfoRespDTOs.total;
                $scope.firstInit = false;
            }


                    
        });


    };
    $scope.queryDemand();
    $scope.changeStatus = function(driver) {
        var msg = '';

        switch (driver.isAvaliable) {

            case "0":
                msg = '是否确认激活司机  ' + driver.name + "  ?";
                break;
            case "1":
                msg = '是否确认冻结司机  ' + driver.name + "  ?";
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
            $http({
                method: 'put',
                url: domainConfig.witchDomain + 'witch/companyPerson/operateDriver',
                data: JSON.stringify(driver), // pass in data as strings
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                if (driver.isAvaliable == '0') {
                    driver.isAvaliable = '1';
                } else {
                    driver.isAvaliable = '0';
                }



                if (!data.success) {
                    // gps.status = originStatus;
                    toastr['error']('失败！', '提示');
                } else {
                    toastr['success']('成功！', '提示');
                }
            }).error(function(data, status, headers, config) {
                // gps.status = originStatus;
                toastr['error']('失败！', '提示');
            });
        }, function() {

        });
    };

    $scope.delete = function(driver) {
        var msg = '';
        switch (driver.isAvaliable) {

            case "0":
                msg = '是否确认删除司机  ' + driver.name + "  ?";
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
                url: domainConfig.witchDomain + 'witch/companyPerson/deletePerson',
                data: JSON.stringify(driver),
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {

                $scope.queryDemand();

                if (!data.success) {
                    // gps.status = originStatus;
                    toastr['error']('失败！', '提示');
                } else {
                    toastr['success']('成功！', '提示');
                }
            }).error(function(data, status, headers, config) {

            });
        }, function() {

        });
    };


    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $scope.queryProdoct();

    };

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function(size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addDriver.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(newDriver) {
            $http({
                method: 'put',
                url: domainConfig.witchDomain + 'witch/driver/addDriver',
                data: JSON.stringify(newDriver), // pass in data as strings
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {

                if (!data.success) {} else {
                    $scope.queryDemand();
                }
            }).error(function(data, status, headers, config) {

            });
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});
app.register.controller('ModalInstanceCtrl', function($http, $scope, $uibModalInstance, items, domainConfig, listService, pagerConfig) {
    $scope.newDriver = {
        isAvaliable: 1,
        identityBackFile: '1',
        identityFaceFile: '1',
        driverLicenseFaceFile: '1',
        driverLicenseBackFile: '1',
        professionQulificationFaceFile: '1',
        professionQulificationBackFile: '1'
    };

    $scope.genders = [{
        code: 1,
        label: '男'
    }, {
        code: 2,
        label: '女'
    }];
    
    $scope.bindVehicle = 0;
    $scope.isBind = true;
    $scope.vehicleList = [];
    $scope.currentPage = pagerConfig.currentPage;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.ok = function() {
        $uibModalInstance.close($scope.newDriver);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function() {
        var url = domainConfig.dispatchDomain + "captain/deliveryTool/deliverToolFullInfos?pageStatus.page=1&pageStatus.pageSize=5";
        listService.events(url).success(function(data, status, headers) { 
            $scope.vehicleList = data.deliveryToolFull.dataList; 
            $scope.totalItems = data.deliveryToolFull.total;
        });
    };

    $scope.selectVehicle = function(vehicleID) {
        $scope.bindVehicle = vehicleID;
        $scope.isBind = false;
        $scope.newDriver.deliveryToolId = vehicleID;
    };
    $scope.unbindVehicle = function(vehicleId) {
        $scope.bindVehicle = 0;
        $scope.isBind = true;
        $scope.newDriver.deliveryToolId = "";

    };
});
