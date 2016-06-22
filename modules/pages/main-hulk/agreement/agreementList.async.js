var app = angular.module('exingcai_captain_web');

app.register.controller('AgreementListCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig) {
  $scope.agreementList = [{
    agreementId:1
  }];

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.init = function () {
    $scope.queryAgreementList();
  }

  $scope.queryAgreementList = function () {
    var params = {
      pageNum: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.jarvisDomain + 'jarvis/agreement/queryAgreementListForPage';
    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        $scope.agreementList = data.agreementListVos;
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
    $scope.queryAgreementList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
    $scope.queryAgreementList();
  }

});