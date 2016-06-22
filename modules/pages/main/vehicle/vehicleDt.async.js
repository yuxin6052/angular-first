var app = angular.module('exingcai_captain_web');


app.register.controller('vehicleDt', function($scope, $uibModal, $log, $http, $stateParams, listService, pagerConfig, domainConfig) {

    $scope.deliveryTool = {};
    $scope.driver = {};
    $scope.gpsDevice = {};
    $scope.imgUrl=[];
    $scope.imgBaseurl = domainConfig.imgDomain;
    $scope.init = function() {
        var url = domainConfig.dispatchDomain + "captain/deliveryTool/deliveryToolDtlInfo/" + $stateParams.vehicleId;
        listService.events(url).success(function(data, status, headers) { 
            console.log(data);
            $scope.deliveryTool = data.secondDeliveryToolVo;
            $scope.gpsDevice = data.gpsDevice;
            $scope.imgUrl = data.secondDeliveryToolVo.vehicleLicenceFile.split(',');
        });
    };

    $scope.unBindDriver = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            controller: 'MessageCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return { msg: '是否确认解绑？' };
                }
            }
        });
        modalInstance.result.then(function() {
            /*$http({
                method  : 'put',
                url     : domainConfig.dispatchDomain+'captain/deliveryTool/unbindGps/'+$scope.gpsInfo.id,
                headers : { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                if (!data.success) {
                } else {
                    
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });*/
        }, function() {

        });
    };

    $scope.unBindGPS = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            controller: 'MessageCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return { msg: '是否确认解绑？' };
                }
            }
        });
        modalInstance.result.then(function() {
               var unBindGPSData ={
                    gpsid:$scope.gpsDevice.id,
                    toolId:$scope.deliveryTool.id
                };
            $http({
                method: 'put',
                url: domainConfig.dispatchDomain + 'captain/deliveryTool/unbindGps/',
                data: unBindGPSData, 
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                if (!data.success) {
                    toastr['error']('解绑失败！', '提示');
                } else {
                    $scope.gpsDevice = {};
                    // $scope.gpsDevice.id = '0';                
                    toastr['success']('解绑成功！', '提示');
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
                toastr['error']('解绑失败！', '提示');
            });
        }, function() {

        });
    };

});
