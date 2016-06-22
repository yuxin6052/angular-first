var app = angular.module('exingcai_captain_web');

app.register.controller('CargoOutReportListCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig) {
  $scope.orderFeeList = [{
    orderFeeId:1
  }];

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.init = function () {
    $scope.queryOrderFeeList();
  }

  $scope.queryOrderFeeList = function () {
    var params = {
      pageNum: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.jarvisDomain + 'jarvis/orderFee/queryAgreementListForPage';
    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        $scope.orderFeeList = data.agreementListVos;
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
    $scope.queryOrderFeeList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
    $scope.queryOrderFeeList();
  }

});