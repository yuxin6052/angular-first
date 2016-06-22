var app = angular.module('exingcai_captain_web');


app.register.controller('feeCaculateDtl', function ($rootScope, $scope, $uibModal, $log, $http, $stateParams, listService, domainConfig, formService) {

    $scope.orderFeeDtlList = [];

    $scope.basicInfo = {
        orderId:$stateParams.orderId,
        ownerName:$stateParams.ownerName,
        totalFee:$stateParams.totalFee,
        orderTypeName:$stateParams.orderTypeName
    };

    $scope.init = function () {
        $scope.queryOrderFeeDtlList();
    };

    $scope.queryOrderFeeDtlList = function () {
        var url = domainConfig.jarvisDomain + 'jarvis/orderFee/queryOrderFeeDtlList/' + $stateParams.orderFeeId;
        listService.events(url).success(function (data, status, headers) {
            $scope.orderFeeDtlList = data.orderFeeDtlVos;
        }).error(function (data) {
            console.log(data);
        });
    }

    });
    