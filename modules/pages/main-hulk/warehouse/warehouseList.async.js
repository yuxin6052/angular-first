var app = angular.module('exingcai_captain_web');

app.register.controller('WarehouseListCtrl', function ($rootScope, $scope, $uibModal, $log, $http, $injector, listService, Upload, domainConfig) {

  $scope.warehouseList = [];
  $scope.totalSum = 0;
  $scope.availableSum = 0;
  $scope.unavailableSum = 0;
  $scope.unInitSum = 0;
  $scope.queryStatus;
  $scope.file;
  $scope.queryParameters = {
    name: '',
    address: '',
    contactor: '',
    contactorPhone: ''
  };

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }



  $scope.queryWarehouseList = function () {
    var params = {
      name: $scope.queryParameters.name,
      address: $scope.queryParameters.address,
      contactor: $scope.queryParameters.contactor,
      contactorPhone: $scope.queryParameters.contactorPhone,
      status: $scope.queryStatus,
      page: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.hulkDomain + 'hulk/warehouse';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.warehouseList = data.warehouseList;
      $scope.pagination.totalItems = data.total;
      /*switch(queryStatus){
        case 100:$scope.unhandledSum = data.totalItems;break;
        case 200:$scope.handlingSum = data.totalItems;break;
        case 300:$scope.handledSum = data.totalItems;break;
        default :$scope.totalSum = data.totalItems;
      }*/
    }).error(function (data) {
      $scope.warehouseList = [{
        name: 'a',
        address: 'xxx'
      }];
    });
  }

  $scope.init = function () {
    $scope.initTotalItems();
    $scope.queryWarehouseList();
  }

  $scope.initTotalItems = function () {
    var url = domainConfig.hulkDomain + 'hulk/warehouse/countByStatus';
    listService.events(url).success(function (data, status, headers) {
      $scope.totalSum = data.countOfAvailable + data.countOfUnavailable + data.countOfStart;
      $scope.availableSum = data.countOfAvailable;
      $scope.unavailableSum = data.countOfUnavailable;
      $scope.unInitSum = data.countOfStart;
    }).error(function (data) {

    });
  }

  $scope.changeTab = function (queryStatus) {
    $scope.queryStatus = queryStatus;
    $scope.pagination.currentPage = 1;
    $scope.queryParameters = {
      name: '',
      address: '',
      contactor: '',
      contactorPhone: ''
    };
    $scope.queryWarehouseList();
  }

  $scope.pageChanged = function () {
    $log.log('Page changed to: ' + $scope.pagination.currentPage);
    //reloaddata
    $scope.queryWarehouseList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
  }

  $scope.upload = function (warehouse) {
    if (warehouse.file && !warehouse.file.$error) {
      Upload.upload({
        url: domainConfig.hulkDomain + 'hulk/warehouse/initWareHouseStorage?warehouseId=' + warehouse.id,
        data: {
          file: warehouse.file
        }
      }).then(function (response) {
        if (response.data.success) {
          warehouse.status = $rootScope.WAREHOUSE_STATUS.AVAILABLE;
          warehouse.file = null;
          toastr['success']('初始化库存成功！', '提示');
        } else {
          toastr['error'](response.data.msg, '提示');
        }
      }, function (response) {
        toastr['error']('初始化库存失败', '提示');
      });
    }
  }

});