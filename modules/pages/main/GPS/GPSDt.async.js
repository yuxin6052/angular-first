var app = angular.module('exingcai_captain_web');


app.register.controller('GPSDt', function($scope, $uibModal, $log, $http, $stateParams, listService, pagerConfig, domainConfig) {
    $scope.gpsCar = {};
    $scope.gpsInfo = {};
    $scope.gpsEditInfo = {};
    $scope.editing = $stateParams.editing;

    $scope.init = function() {
        var url = domainConfig.dispatchDomain + "captain/gps/gpsDeviceInfo/" + $stateParams.GPSId;
        listService.events(url).success(function(data, status, headers) { 
            // angular.copy(data.gpsDeviceInfo, $scope.gpsEditInfo);
            $scope.gpsInfo = data.gpsDeviceInfo;
            $scope.gpsCar = data.bindDeliveryTool;
        });
    }

    $scope.toggleEditing = function() {
        $scope.editing = !$scope.editing;
    }

    $scope.saveGpsInfo = function() {
        $http({
            method: 'put',
            url: domainConfig.dispatchDomain + 'captain/gps/gpsDeviceInfo/',
            data: JSON.stringify($scope.gpsInfo), // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            console.log(data);
            if (!data.success) {} else {
                $scope.toggleEditing();
            }
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    }

    $scope.unBindTool = function() {
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
            $http({
                method: 'put',
                url: domainConfig.dispatchDomain + 'captain/deliveryTool/unbindGps/' + $scope.gpsInfo.id,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                if (!data.success) {} else {
                    $scope.gpsCar = null;
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }, function() {

        });
    }

});
