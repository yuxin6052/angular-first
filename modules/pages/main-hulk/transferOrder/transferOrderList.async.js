var app = angular.module('exingcai_captain_web');


app.register.controller('transferOrderList', function ($rootScope,$scope, $uibModal, $log, $http, listService, domainConfig,formService) {
    $scope.totalSum = 0;
    $scope.unhandledSum = 0;
    $scope.handlingSum = 0;
    $scope.completeSum = 0;
    $scope.queryParameters = {
        cargoNo: '',
        fromOwnerName: '',
        toOwnerName: ''
    };

    $scope.pagination = {
        totalItems: 0,
        maxSize: 5,
        currentPage: 1,
        pageSize: 10
    }

    $scope.init = function () {
        $scope.initTotalItems();
        $scope.queryData();
    }

    $scope.queryData = function () {
        var params = {
            cargoNo: $scope.queryParameters.cargoNo,
            fromOwnerName: $scope.queryParameters.fromOwnerName,
            toOwnerName: $scope.queryParameters.toOwnerName,
            status: $scope.queryStatus,
            page: $scope.pagination.currentPage,
            pageSize: $scope.pagination.pageSize
        };
        var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/manage';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.dataList = data.cargoTransferManageListVos;
            $scope.pagination.totalItems = data.total;
        }).error(function (data) {

        });
    }

    $scope.initTotalItems = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/countByStatus';
        listService.events(url).success(function (data, status, headers) {
            $scope.totalSum = data.countOfStart+data.countOfDoing+data.countOfComplete;
            $scope.unhandledSum = data.countOfStart;
            $scope.handlingSum = data.countOfDoing;
            $scope.completeSum = data.countOfComplete;
        }).error(function (data) {

        });
    }

    $scope.changeTab = function (queryStatus) {
        $scope.queryStatus = queryStatus;
        $scope.pagination.currentPage = 1;
        $scope.queryParameters = {
            cargoNo: '',
            fromOwnerName: '',
            toOwnerName: ''
        };
        $scope.queryData();
    }

    $scope.pageChanged = function () {
        $log.log('Page changed to: ' + $scope.pagination.currentPage);
        //reloaddata
        $scope.queryData();
    }

    $scope.setPage = function (pageNo) {
        $scope.pagination.currentPage = pageNo;
        //reload data
    }
    //$scope.queryData();
    $scope.getDetail = function (obj) {
        obj.expand = !obj.expand;
        if (obj.expand) {
            var id = obj.cargoTransferId;
            var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/manage/' + obj.cargoTransferId;
            listService.events(url).success(function (data, status, headers) {
                obj.cargoTransferNoticeDtlVos = data.cargoTransferNoticeDtlVos;
                obj.opPerson = data.opPerson;
                obj.approvePerson = data.approvePerson;
                obj.remark = data.remark;
            }).error(function (data) {

            });
        }
    }

    $scope.makeSure = function (obj) {

        var storageIdList = [];
        angular.forEach(obj.cargoTransferDtlVos, function (value, key) {
            if (value.isSelected == 1) {
                storageIdList.push(value.storageId);
            }
        });
        var params = {
            "cargoTransferNoticeId": obj.cargoTransferNoticeId,
            "storageIds": storageIdList
        }
        var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/confirm';
        formService.put(url,params).success(function (data, status, headers) {
            if(data.success){
                obj.status = $rootScope.TRANSFER__NOTICE_STATUS.CONFIRMED;
                $scope.initTotalItems();
            }else{
                toastr['error'](data.msg,'提示');
            }
        }).error(function (data) {
            toastr['error'](data.msg,'提示');
        });

    }

    $scope.cancelConfirm = function (obj) {

        /*var storageIdList = [];
        angular.forEach(obj.CargoTransferDtlVo, function (value, key) {
            if (value.isSelected == 1) {
                storageIdList.push(value.storageId);
            }
        });*/
        var params = {
            // "cargoTransferNoticeId":obj.cargoTransferNoticeId,
            cargoTransferNoticeId: obj.cargoTransferNoticeId
            // "storageId": storageIdList
        }
        var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/confirm';
        formService.put(url,params).success(function (data, status, headers) {
            if(data.success){
                obj.status = $rootScope.TRANSFER__NOTICE_STATUS.NOT_CONFIRMED;
                $scope.initTotalItems();
            }else{
                toastr['error'](data.msg,'提示');
            }
        }).error(function (data) {
            toastr['error'](data.msg,'提示');
        });
    }
    $scope.transfer = function (obj) {
        /*var storageIdList = [];
        angular.forEach(obj.cargoTransferNoticeDtlVos, function (e1, key) {
            angular.forEach(e1.cargoTransferDtlVos, function (e2, key) {
                if (e2.isSelected == 1) {
                    storageIdList.push(e2.storageId);
                }
            });
        });*/
        var params = {
            "cargoTransferId": obj.cargoTransferId,
            // "storageIds": storageIdList
        }
        var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/transfer';
        formService.put(url,params).success(function (data, status, headers) {
            if(data.success){
                toastr['success']('全部过户成功','提示');
                obj.status = $rootScope.TRANSFER_STATUS.TRANSFER_SUCCESS;
                $scope.initTotalItems();
            }else{
                toastr['error'](data.msg,'提示');
            }
        }).error(function (data) {
            toastr['error'](data.msg,'提示');
        });
    }
    $scope.changeChecked = function (positon) {
        if (positon.isSelected == 1) {
            positon.isSelected = 2;
        } else {
            positon.isSelected = 1;
        }
    }


});







