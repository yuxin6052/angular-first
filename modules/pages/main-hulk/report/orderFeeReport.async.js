var app = angular.module('exingcai_captain_web');

app.register.controller('orderFeeReportCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig) {
  $scope.orderFeeReportList = [{
    orderFeeId:1
  }];

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.init = function () {
    $scope.queryOrderFeeReportList();
  }

  $scope.queryOrderFeeReportList = function () {
    var params = {
      pageNum: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.jarvisDomain + 'jarvis/report/queryOrderFeeReportList';
    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        $scope.orderFeeReportList = data.orderFeeReportVos;
      } else {
        toastr['error'](data.msg, '提示');
      }
    }).error(function (data) {
      toastr['error'](data.msg, '提示');
    });
  }

  $scope.pageChanged = function () {
    $log.log('Page changed to: ' + $scope.pagination.currentPage);
    //reloaddata
    $scope.queryOrderFeeReportList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
    $scope.queryOrderFeeReportList();
  }

});