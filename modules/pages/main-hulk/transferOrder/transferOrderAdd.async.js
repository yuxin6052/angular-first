var app = angular.module('exingcai_captain_web');

app.register.controller('TransferOrderAddCtrl', function ($scope, $uibModal, $log, $http, $injector,listService, domainConfig, $state, $stateParams,$filter, formService) {
  
  $scope.transferBatchNo = $stateParams.transferBatchNo;

  var self = this;
  //datePicker options
  $scope.opened = false;
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  self.newTransfer = {};
  $scope.storageList = [];
  $scope.init = function () {
    $scope.queryBasicInfo();
    $scope.loadOwnerList();
    $scope.loadStorage();
  }
  
  $scope.storageForTransferVos = [{
        brandName: 'asdf',
        cardId: '1',
        cardName: 'H0111A',
        countUnitCode: '件',
        productId: 1,
        productName: '品名',
        productSize: '产品规格',
        totalCount: 2,
        totalWeight: 2,
        totalWeightMao: 2
      }, {
          brandName: 'asdf',
          cardId: '1',
          cardName: 'H0111A',
          countUnitCode: '件',
          productId: 1,
          productName: '品名',
          productSize: '产品规格',
          totalCount: 2,
          totalWeight: 2,
          totalWeightMao: 2
        }, {
          brandName: 'asdf',
          cardId: '1',
          cardName: 'H0111A',
          countUnitCode: '件',
          productId: 1,
          productName: '品名',
          productSize: '产品规格',
          totalCount: 2,
          totalWeight: 2,
          totalWeightMao: 2
        }];

  $scope.queryBasicInfo = function () {
    var params = {
      batchNo: $scope.transferBatchNo,
      type: 5
    };
    var url = domainConfig.hulkDomain + 'hulk/contractBatch/selectByBatchNo';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.basicInfo = data; 
    }).error(function (data) {
      toastr['error']('数据加载失败！', '提示');
    });
  }

  $scope.loadOwnerList = function () {
    var params = {
      batchNo: $scope.transferBatchNo
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/queryOptionForAddTransfer';
    listService.events(url,params).success(function (data, status, headers) {
      if (data.success) {
        $scope.ownerList = data.ownerOptionVos;
      } else {
        toastr['error']('货主信息读取失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('货主信息读取失败！', '提示');
    });
  }

  $scope.loadStorage = function () {
    var params = {
      batchNo: $scope.transferBatchNo
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/queryStorageForTransfer';
    listService.events(url,params).success(function (data, status, headers) {
      if (data.success) {
        $scope.storageForTransferVos = data.storageForTransferVos;
      } else {
        toastr['error']('货主信息读取失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('货主信息读取失败！', '提示');
    });
  }

  $scope.open = function () {
    $scope.opened = true;
  }

  $scope.addCompany = function (size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'addCompany.html',
      controller: 'AddClientCtrl',
      size: size
    });

    modalInstance.result.then(function (company) {
      $scope.init();//reload conpanies
    }, function () {

    });
  }

  $scope.saveTransferOrder = function (valid) {
    if (valid) {
      self.newTransfer.toOwnerId = self.toOwner.id;
      self.newTransfer.batchNo = $scope.transferBatchNo ;
      self.newTransfer.transferDate = $filter('date')(self.transferDate, 'yyyy-MM-dd');
      self.newTransfer.addCargoTransferNoticeDtlVos = [];
      angular.forEach($scope.storageForTransferVos, function (obj, index) {
        if (obj.transferCount && obj.transferWeight) {
          self.newTransfer.addCargoTransferNoticeDtlVos.push({
            cardId: obj.cardId,
            productId: obj.productId,
            totalCount: obj.transferCount,
            totalWeight: obj.transferWeight
          });
        }
      });
      var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/addTransfer';
      formService.put(url,self.newTransfer).success(function (data, status, headers) {
        
        if (data.success) {
           $state.go('transferBatchDt',{'transferBatchNo':$scope.transferBatchNo});
        } else {
          toastr['error'](data.msg, '提交失败');
        }
      }).error(function (data) {
        toastr['error']('提交失败！', '提示');
      });
    } else {
      angular.forEach($scope.myForm.$error, function (field) {
        angular.forEach(field, function (errorField) {
          errorField.$setTouched();
          errorField.$setDirty();
        })
      });
    }
  }
});

app.register.controller('AddClientCtrl', function ($http, $scope, $uibModalInstance, listService, domainConfig, formService) {
  $scope.company = {};

  $scope.ok = function (valid) {
    if (valid) {
      var url = domainConfig.hulkDomain + 'hulk/user/addTradeComp';
      formService.put(url, $scope.company).success(function (data) {
        if (!data.success) {
        } else {
          $uibModalInstance.close($scope.company);
        }
      }).error(function (data, status, headers, config) {
        console.log(data);
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

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
