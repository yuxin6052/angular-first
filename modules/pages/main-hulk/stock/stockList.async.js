var app = angular.module('exingcai_captain_web');


app.register.controller('stockList', function ($scope, $uibModal, $log, $http, listService, domainConfig, formService) {
    $scope.totalSum = 0;
    $scope.availableSum = 0;
    $scope.inTransSum = 0;
    $scope.unavailableSum = 0;
    $scope.forms = {};
    $scope.obj = {
        "brandName": "BRAND1",
        "cardX": "H1 ",
        "count": "20",
        "countUnitName": "根",
        "ownerName ": "货主",
        "placeCode": "货位 ",
        "productName": "品名",
        "status": "状态",
        "storageId ": "库存ID ",
        "warehouseName": "所属仓库",
        "weight": " 50"
    };
    $scope.pagination = {
        totalItems: 0,
        maxSize: 5,
        currentPage: 1,
        pageSize: 10
    };
    $scope.queryParameters = {
        warehouserId: '',
        cardId: '',
        ownerName: ''
    };

    $scope.dataList = [];

    $scope.init = function () {
        $scope.initTotalItems();
        $scope.queryDataList();
        $scope.queryCardList();
        $scope.queryWarehouseList();
    }

    $scope.queryWarehouseList = function () {
        var url = domainConfig.hulkDomain + 'hulk/storage/queryOptionForStorageManage';
        listService.events(url).success(function (data, status, headers) {
            $scope.warehouseList = data.warehouseOptionVos;
        }).error(function (data) {
            // $scope.dataList.push($scope.obj);
        });
    }

    $scope.queryCardListByWarehouse = function (warehouseId) {
        var url = domainConfig.hulkDomain + 'hulk/storage/queryOptionForStorageManage';
        var params = {warehouseId:warehouseId};
        listService.events(url,params).success(function (data, status, headers) {
            $scope.cardOptionList = data.cardOptionVos;
        }).error(function (data) {
            // $scope.dataList.push($scope.obj);
        });
    }

    $scope.queryCardList = function () {
        var url = domainConfig.hulkDomain + 'hulk/card/listByCurUser';
        listService.events(url).success(function (data, status, headers) {
            $scope.cardList = data.cardVoList;
        }).error(function (data) {
            // $scope.dataList.push($scope.obj);
        });
    }

    $scope.queryDataList = function (queryStatus) {
        var params = {
            warehouserId: $scope.queryParameters.warehouserId,
            cardId: $scope.queryParameters.cardId,
            ownerName: $scope.queryParameters.ownerName,
            status: $scope.queryStatus,
            page: $scope.pagination.currentPage,
            pageSize: $scope.pagination.pageSize
        };
        var url = domainConfig.hulkDomain + 'hulk/storage/manage';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.dataList = data.storageListVos;
            $scope.pagination.totalItems = data.total;
            // angular.forEach($scope.dataList, function (data, key) {
            //     var length = 6 - data.cardName.length - 1;
            //     data.placeCodeRegex = new RegExp('^' + data.cardName + '\\d{' + length + '}[a-zA-Z]$');
            // });
        }).error(function (data) {
            // $scope.dataList.push($scope.obj);
        });
    }

    $scope.initTotalItems = function () {
        var url = domainConfig.hulkDomain + 'hulk/storage/storageCount';
        listService.events(url).success(function (data, status, headers) {
            $scope.totalSum = data.allCount;
            $scope.availableSum = data.normalCount;
            $scope.inTransSum = data.inTransCount;
            $scope.unavailableSum = data.freezenCount;
        }).error(function (data) {

        });
    }

    $scope.changeTab = function (queryStatus) {
        $scope.queryStatus = queryStatus;
        $scope.pagination.currentPage = 1;
        $scope.queryParameters = {
            warehouserId: '',
            cardId: '',
            ownerName: ''
        };
        $scope.queryDataList();
    }

    $scope.pageChanged = function () {
        $log.log('Page changed to: ' + $scope.pagination.currentPage);
        //reloaddata
        $scope.queryDataList();
    }

    $scope.setPage = function (pageNo) {
        $scope.pagination.currentPage = pageNo;
        //reload data
        $scope.queryDataList();
    }

    $scope.save = function (stock, form) {
        if (form.$valid) {
            var url = domainConfig.hulkDomain + 'hulk/storage/move';
            var data = {
                cardId: stock.cardId,
                id: stock.storageId,
                placeCode: stock.placeCode
            };
            formService.put(url,data).success(function (data, status, headers) {
                if (data.success) {
                    stock.storageId = data.storageId;
                    $scope.toggleEditing(stock);
                } else {
                    toastr['error'](data.msg, '修改库位失败！');
                }
            }).error(function (data) {
                toastr['error'](data.msg, '修改库位失败！');
            });
        } else {
            angular.forEach(form.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                    errorField.$setDirty();
                })
            });
        }
    }

    $scope.modify = function (stock) {
        $scope.changeSelectedCardName(stock);
        stock.oldCardName = stock.cardName;
        stock.oldPlaceCode = stock.placeCode;
        $scope.toggleEditing(stock);
    }

    $scope.cancel = function (stock) {
        stock.cardName = stock.oldCardName;
        stock.placeCode = stock.oldPlaceCode;
        $scope.toggleEditing(stock);
    }

    $scope.toggleEditing = function (stock) {
        stock.editing = !stock.editing;
    }

    $scope.changeSelectedCardName = function (obj) {
        angular.forEach($scope.cardList, function (card, index) {
            if (obj.cardName == card.cardName) {
                obj.cardId = card.id;
            }
        });
    }

});
