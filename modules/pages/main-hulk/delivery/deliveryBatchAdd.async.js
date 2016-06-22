var app = angular.module('exingcai_captain_web');

app.register.controller('DeliveryBatchAddCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig, $state, formService) {
  var self = this;
  $scope.ownerName = '';
  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1
  }

  $scope.deliveryBatch = {};

  $scope.deliveryList = [];
  $scope.selectedStorageIds = [];

  $scope.init = function () {
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/ownerList';
    listService.events(url).success(function (data, status, headers) {
      if (data.success) {
        $scope.ownerList = data.ownerList;
      } else {
        toastr['error']('货主信息读取失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('货主信息读取失败！', '提示');
    });
  };

  self.onSelectCallback = function (item, model) {
    $scope.deliveryBatch.ownerId = model;
  }

  // $scope.$watch('ownerName', function (newValue, oldValue) {
  //   var findOwner = false;
  //   angular.forEach($scope.ownerList, function (owner, index) {
  //     if (owner.ownerName === newValue) {
  //       findOwner = true;
  //       $scope.deliveryBatch.ownerId = owner.id;
  //     }
  //   });
  //   if (!findOwner) {
  //     $scope.deliveryBatch.ownerId = null;
  //   }
  // });

  $scope.deleteDelivery = function (index) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MessageCtrl',
      size: 'sm',
      resolve: {
        items: function () {
          return {
            msg: '是否确认删除？'
          };
        }
      }
    });
    modalInstance.result.then(function () {
      $scope.deliveryList.splice(index, 1);
    }, function () {

    });
  }

  $scope.saveDeliveryBatch = function (valid) {
    if (valid) {
      $scope.deliveryBatch.cargoSendBatchArr = $scope.deliveryList;
      var url = domainConfig.hulkDomain + 'hulk/cargoSend/addCargoSend';
      formService.put(url, $scope.deliveryBatch).success(function (data, status, headers) {
        $state.go('deliveryBatchList');
      }).error(function (data) {
        toastr['error']('提交发货单失败！', '提示');
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

  $scope.popEditDeliveryModal = function (delivery) {
    if (!$scope.deliveryBatch.ownerId) {
      toastr['error']('请先选择货主！', '提示');
      return;
    }
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'addDeliveryModal.html',
      controller: 'addDeliveryModalCtrl',
      size: '',
      resolve: {
        ownerId: function () {
          return $scope.deliveryBatch.ownerId;
        },
        selectedStorageIds: function () {
          return $scope.selectedStorageIds;
        }
      }
    });

    modalInstance.result.then(function (newDeliveryInfo) {
      var storageIdsNotSelected = true;
      newDeliveryInfo.storageIdList = [];
      angular.forEach(newDeliveryInfo.productList, function (obj, index) {
        angular.forEach($scope.selectedStorageIds, function (storageId, index) {
          if (storageId == obj.storageId) {
            storageIdsNotSelected = false;
          }
        });
        newDeliveryInfo.storageIdList.push(obj.storageId);
      });
      if (storageIdsNotSelected) {
        $scope.selectedStorageIds = $scope.selectedStorageIds.concat(newDeliveryInfo.storageIdList);
        $scope.deliveryList.push(newDeliveryInfo);
      } else {
        toastr['error']('货物重复添加', '提示');
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
});

app.register.controller('addDeliveryModalCtrl', function ($scope, $log, $http, listService, $uibModalInstance, ownerId, selectedStorageIds, domainConfig) {
  $scope.cardProductOwnerVoList = [];

  $scope.newDeliveryInfo = {
    productList: []
  };

  $scope.init = function () {
    var params = {
      ownerId: ownerId
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/queryCardStorage';
    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
        for (var i = $scope.cardProductOwnerVoList.length - 1; i >= 0; i--) {
          var repo = $scope.cardProductOwnerVoList[i];
          repo.selectedWeight = new BigDecimal('0');
          for (var j = repo.storageVoList.length - 1; j >= 0; j--) {
            for (var m = selectedStorageIds.length - 1; m >= 0; m--) {
              if (selectedStorageIds[m] == repo.storageVoList[j].id) {
                repo.storageVoList.splice(j, 1);
                break;
              }
            }
          }
          if (!repo.storageVoList || repo.storageVoList == 0) {
            $scope.cardProductOwnerVoList.splice(i, 1);
          }
        }
      } else {
        toastr['error']('加载数据失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('加载数据失败！', '提示');
    });
  }

  $scope.checkStorage = function (repository, storage) {
    var cardName = repository.cardName;
    var productInfo = repository.product;
    if (storage.checked) {
      repository.selectedWeight = repository.selectedWeight.add(new BigDecimal(storage.weight.toString()));
      var product = {
        storageId: storage.id,
        productName: productInfo.productName,
        categoryName: productInfo.categoryName,
        brandName: productInfo.brandName,
        count: storage.count,
        countUnitCode: storage.countUnitCode,
        weight: storage.weight,
        weightUnitCode: storage.weightUnitCode ? storage.weightUnitCode : '吨',
        cardId: cardName
      };
      $scope.newDeliveryInfo.productList.push(product);
    } else {
      for (var i = 0; i < $scope.newDeliveryInfo.productList.length; i++) {
        if ($scope.newDeliveryInfo.productList[i].storageId == storage.id) {
          $scope.newDeliveryInfo.productList.splice(i, 1);
          repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
          break;
        }
      }
    }
  }

  $scope.ok = function () {
    $uibModalInstance.close($scope.newDeliveryInfo);
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


});


