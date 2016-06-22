var app = angular.module('exingcai_captain_web');


app.register.controller('addTransferBatchCtrl', function ($rootScope, $scope, $uibModal, $log, $http, $stateParams, listService, $state, domainConfig,formService) {
    var self = this;
    $scope.ownerName = '';
    $scope.isHideNewCompany = false;

    $scope.transferBatch = {};
    $scope.transferBatch.cargoRecieveBatchArr = [];
    $scope.transferBatch.cargoRecieveBatchArr.productDtlList = [];

    $scope.init = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/ownerList';
        listService.events(url).then(function (response) {
            var data = response.data;
            if (data.success) {
                $scope.fromOwnerList = data.ownerList;
            } else {
                toastr['error']('出让货主信息读取失败！', '提示');
            }
        }, function (response) {
            toastr['error']('出让货主信息读取失败！', '提示');
        });
    };
    
    self.onSelectCallback = function(item,model){
        $scope.transferBatch.ownerId = model;
    }
    
    $scope.saveTransferBatch = function (valid) {
        if (valid) { 
            var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/addCargoTransferBatch';
            formService.put(url,$scope.transferBatch).success(function (data, status, headers) {
                $state.go('transferBatchList');
            }).error(function (data) {
                toastr['error']('提交货权转让批次失败！' + data.msg, '提示');
            });
        } else {
            angular.forEach($scope.myForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                    errorField.$setDirty();
                })
            });
            toastr['error']('请填写完表单', '提示');
        }
    }
});
