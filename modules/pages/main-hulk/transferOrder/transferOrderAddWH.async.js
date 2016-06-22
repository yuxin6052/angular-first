var app = angular.module('exingcai_captain_web');

app.register.controller('TransferOrderAddWHCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig, $state, $filter, formService) {
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
    $scope.loadToOwnerList();
    $scope.loadFromOwnerList();
    $scope.loadStorage();
  }
  
  $scope.storageForTransferVos = [];

  $scope.loadToOwnerList = function () {
    var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/queryOptionForAddTransfer';
    listService.events(url).success(function (data, status, headers) {
      if (data.success) {
        $scope.toOwnerList = data.ownerOptionVos;
      } else {
        toastr['error']('货主信息读取失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('货主信息读取失败！', '提示');
    });
  }
  
  $scope.loadFromOwnerList = function () {
    
  }

  $scope.loadStorage = function () {
    var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/queryStorageForTransfer';
    listService.events(url).success(function (data, status, headers) {
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
          $state.go('transferOrderList');
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
