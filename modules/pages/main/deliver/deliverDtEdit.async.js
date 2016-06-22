var app = angular.module('exingcai_captain_web');


app.register.controller('DeliverDtEdit', function($scope, $uibModal, $log, $http, $stateParams, listService, pagerConfig, domainConfig, $location) {


    $scope.cargoNo = $stateParams.cargoNo;
    // $scope.delivery={
    //   "cargoDeliverId": 0,
    //   "cargoNo": "string",
    //   "deliveryCargoCode": "string",
    //   "dispatchNo": "string",
    //   "inWarehouseAddr": "string",
    //   "inWarehouseName": "string",
    //   "maxLoadUnit": 0,
    //   "outWarehouseAddr": "string",
    //   "outWarehouseName": "string",
    //   "driverName":"string",
    //   "driverIdentityNo":"123",
    //   "toolId": 0,
    //   "toolNo": "123",
    //   "products": [
    //     {
    //       "productBrand": "string",
    //       "cargoDeliveryId": 0,
    //       "countUnit": "string",
    //       "productId": 0,
    //       "productName": "string",
    //       "productTotleCount": 0,
    //       "shouldProductWei": 0,
    //       "productSpecify": "string",
    //       "weiUnit": "string"
    //     }
    //   ]
    // }
    $scope.saveDeliverDtl = function() {
        var updateProducts = new Array();
        angular.forEach($scope.delivery.cargoDeliverDtls, function(data) {
            var updateProduct = {
                "count": data.productTotleCount,
                "id": data.cargoDeliveryDtlId,
                "wei": data.actualProductWei
            };
            updateProducts.push(updateProduct);
        });
        var commitData = {
            "cargoNo": $scope.cargoNo,
            "updateProducts": updateProducts
        };
        $http({
            method: 'put',
            url: domainConfig.dispatchDomain + 'captain/cargoDeliver/updateProducts',
            data: JSON.stringify(commitData), // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            if (!data.success) {
                toastr['error']('保存失败！', data.msg);
            } else {
                toastr['success']('提交成功！', '提示');
                if ((typeof $location.port()) === 'number') {
                    window.location.href = 'http://' + $location.host() + ':' + $location.port() + '/#/deliverDt/' + $scope.delivery.id;
                } else {
                    window.location.href = 'http://' + $location.host() + '/#/deliverDt/' + $scope.delivery.id;
                }
            }
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    };

    $scope.init = function() {
        $http({
            method: 'POST',
            url: domainConfig.dispatchDomain + 'captain/cargoDeliver/cargorDeliverEdit/' + $scope.cargoNo,
            data: {}, // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            if (!data.success) {
                toastr['error']('保存失败！', 'data.msg');
            } else {
                $scope.delivery = data.delivery;
            }
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    };
});
