var app = angular.module('exingcai_captain_web');

app.register.controller('DeliveryBatchListCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig) {

  $scope.deliveryBatchList = [];
  $scope.totalSum = 0;
  $scope.unhandledSum = 0;
  $scope.handlingSum = 0;
  $scope.handledSum = 0;
  $scope.queryStatus;
  $scope.queryParameters = {
    batchNo: '',
    wlCompanyName: ''
  };

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.init = function () {
    $scope.initTotalItems();
    $scope.queryDliveryBatchList();
  }

  $scope.queryDliveryBatchList = function () {
    var params = {
      batchNo: $scope.queryParameters.batchNo,
      wlCompanyName: $scope.queryParameters.wlCompanyName,
      type: 1,
      status: $scope.queryStatus,
      page: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.hulkDomain + 'hulk/contractBatch/list';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.deliveryBatchList = data.contractBatchList;
      $scope.pagination.totalItems = data.total;
    }).error(function (data) {

    });
  }

  $scope.initTotalItems = function () {
    var params = {
      type: 1
    };
    var url = domainConfig.hulkDomain + 'hulk/contractBatch/countByStatus';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.totalSum = data.countOfStart + data.countOfDoing + data.countOfComplete;
      $scope.unhandledSum = data.countOfStart;
      $scope.handlingSum = data.countOfDoing;
      $scope.handledSum = data.countOfComplete;
    }).error(function (data) {

    });
  }

  $scope.changeTab = function (queryStatus) {
    $scope.queryStatus = queryStatus;
    $scope.pagination.currentPage = 1;
    $scope.queryParameters = {
      batchNo: '',
      wlCompanyName: ''
    };
    $scope.queryDliveryBatchList();
  }

  $scope.pageChanged = function () {
    $log.log('Page changed to: ' + $scope.pagination.currentPage);
    //reloaddata
    $scope.queryDliveryBatchList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
    $scope.queryDliveryBatchList();
  }

});