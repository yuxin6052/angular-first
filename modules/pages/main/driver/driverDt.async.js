var app = angular.module('exingcai_captain_web');


app.register.controller('driverDt', function($scope, $uibModal, $log, $http, $stateParams, listService, domainConfig) {
    $scope.imgBaseurl = domainConfig.imgDomain;

    $scope.newDriver = {

    };

    $scope.userId = $stateParams.userId;

    $scope.url = domainConfig.witchDomain + "witch/driver/" + $scope.userId;


    $scope.queryDemandDt = function() {
        listService.events($scope.url).success(function(data, status, headers) { 

            $scope.newDriver = data.queryDriverInfo;        
        });

    };
    $scope.queryDemandDt();

    $scope.unBindvehicle = function() {
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
                  method  : 'POST',
                   url: domainConfig.dispatchDomain + 'captain/deliveryTool/unbindDriver/'+$scope.newDriver.deliveryToolId,
                  data    : {},  // pass in data as strings
                  headers : { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
              }).success(function(data) {
                  if (!data.success) {
                       toastr['error']('解绑失败！', '提示');
                  } else {
                    $scope.newDriver.toolNo=null;
                   toastr['success']('解绑成功！', '提示');
                  }
              }).error(function(data, status, headers, config) {
                  toastr['error']('解绑失败！', '提示');
              });
            

        }, function() {

        });
    };

});
