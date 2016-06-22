var app = angular.module('exingcai_captain_web');

app.register.controller('TransferBatchDtCtrl', function ($rootScope, $scope, $uibModal, $log, $http, $injector, listService, $stateParams, domainConfig, formService) {
  $scope.productProperties = ['qdd', 'w', 'e', 'r', 't', 'y', 'u', 'i'];

  $scope.transferBatchNo = $stateParams.transferBatchNo;

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.basicInfo = {};
 
  $scope.transferList = [];

  $scope.init = function () {
    $scope.queryBasicInfo();
    $scope.queryTransferList();
    
  }

  $scope.queryTransferList = function () {
    var params = {
      batchNo: $scope.transferBatchNo
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoTransfer/listByBatchNo';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.transferList = data.cargoTransferManageListVos;
    }).error(function (data) {

    });
  }

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

  $scope.expandDetail = function (delivery) {
    delivery.expanded = !delivery.expanded;
    if (delivery.expanded && (!delivery.productList || delivery.productList.length == 0)) {
      //load cargo info
      var url = domainConfig.hulkDomain + 'hulk/cargoSend/' + delivery.id;
      listService.events(url).success(function (data, status, headers) {
        delivery.productList = [];
        angular.forEach(data.dtlList, function (obj, index) {
          var product = {
            productName: obj.product ? obj.product.productName : '',
            categoryName: obj.product ? obj.product.modelName : '',
            brandName: obj.product ? obj.product.brandName : '',
            count: obj.count,
            countUnitCode: obj.countUnitCode,
            weight: obj.weight,
            weightUnitCode: obj.weightUnitCode ? obj.weightUnitCode : '吨',
            cardId: obj.cardName
          };
          delivery.productList.push(product);
        });
      }).error(function (data) {

      });
    }
  }

  $scope.checkTransfer = function (delivery) {
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/checkCargoSend?id=' + delivery.id;
    formService.put(url).success(function (data, status, headers) {
      if (data.success) {
        delivery.status = $rootScope.CARGO_SEND_STATUS.SHIPPING;
        toastr['success']('核对成功！', '提示');
      } else {
        toastr['error']('核对失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('核对失败！', '提示');
    });
  }

  $scope.createShippingOrder = function (transfer) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'addModal.html',
      controller: 'AddModalCtrl',
      size: 'lg',
      resolve: {
        transfer: function () {
          return transfer;
        }
      }
    });

    modalInstance.result.then(function (req) {
      var url = domainConfig.hulkDomain + 'hulk/cargoTransfer';
      formService.put(url, req).success(function (data) {
        if (data.success) {
          transfer.existCargoOut = true;
          toastr['success']('生成出库单成功！', '提示');
        } else {
          toastr['error']('生成出库单失败！', '提示');
        }
      }).error(function (data, status, headers, config) {
        toastr['error']('生成出库单失败！', '提示');
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  $scope.popEditTransferModal = function (delivery) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'editTransferModal.html',
      controller: 'editTransferModalCtrl',
      size: '',
      resolve: {
        ownerId: function () {
          return $scope.basicInfo.ownerId;
        },
        deliveryId: function () {
          return delivery ? delivery.id : null;
        },
        contractBatchId: function () {
          return $scope.basicInfo.id;
        }
      }
    });

    modalInstance.result.then(function () {
      $scope.querydeliveryList();
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  $scope.pageChanged = function () {
    $log.log('Page changed to: ' + $scope.pagination.currentPage);
    //reloaddata
    $scope.querydeliveryList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
    $scope.querydeliveryList();
  }

});
app.register.controller('AddModalCtrl', function ($http, $scope, $uibModalInstance, cargoTransferId, listService, domainConfig) {
  $scope.shipping = {
    cargoTransferId: cargoTransferId,
    storageIdList: []
  };
  $scope.cardProductOwnerVoList = [];

  $scope.init = function () {
    var params = {
      cargoTransferId: cargoTransferId
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoOut/toEdit';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
      angular.forEach($scope.cardProductOwnerVoList, function (e1, index1) {
        e1.selectedWeight = new BigDecimal('0');
        angular.forEach(e1.storageVoList, function (e2, index2) {
          angular.forEach(data.dtlList, function (e3, index3) {
            if (e3.storageId == e2.id) {
              e2.checked = true;
              e1.selectedWeight = e1.selectedWeight.add(new BigDecimal(e2.weight.toString()));
            }
          });
        });
      });
      angular.forEach(data.dtlList, function (dt, index) {
        $scope.shipping.storageIdList.push(dt.storageId);
      });
    }).error(function (data) {
      toastr['error']('加载数据失败！', '提示');
    });
  }

  $scope.checkStorage = function (repository, storage) {
    if (storage.checked) {
      repository.selectedWeight = repository.selectedWeight.add(new BigDecimal(storage.weight.toString()));
      $scope.shipping.storageIdList.push(storage.id);
    } else {
      for (var i = 0; i < $scope.shipping.storageIdList.length; i++) {
        if ($scope.shipping.storageIdList[i] == storage.id) {
          $scope.shipping.storageIdList.splice(i, 1);
          repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
          break;
        }
      }
    }
  }

  $scope.ok = function () {
    $uibModalInstance.close($scope.shipping);
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

app.register.controller('editTransferModalCtrl', function ($scope, $log, $http, $q, listService, $uibModalInstance, ownerId, deliveryId, contractBatchId, domainConfig, formService) {
  var edit = deliveryId ? true:false;
  $scope.cardProductOwnerVoList = [];

  $scope.newDeliveryInfo = {
    id: deliveryId,
    contractBatchId: contractBatchId,
    storageIdList: []
  };

  $scope.init = function () {
    $scope.queryStorageList().promise.then(function () {
      if (deliveryId) {
        $scope.querySelectedStorage(deliveryId);
      }
    }, function error() {

    });
  }

  $scope.queryStorageList = function () {
    var params = {
      ownerId: ownerId
    };
    var promise = $q.defer();
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/queryCardStorage';
    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        promise.resolve();
        $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
        for (var i = $scope.cardProductOwnerVoList.length - 1; i >= 0; i--) {
          var repo = $scope.cardProductOwnerVoList[i];
          repo.selectedWeight = new BigDecimal('0');
        }
      } else {
        promise.reject();
        toastr['error']('加载数据失败！', '提示');
      }
    }).error(function (data) {
      promise.reject();
      toastr['error']('加载数据失败！', '提示');
    });

    return promise;
  }

  $scope.querySelectedStorage = function (deliveryId) {
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/' + deliveryId;
    listService.events(url).success(function (data, status, headers) {
      $scope.newDeliveryInfo.carCode = data.cargoSendVo.carCode;
      $scope.newDeliveryInfo.driverName = data.cargoSendVo.driverName;
      $scope.newDeliveryInfo.driverIdentityNum = data.cargoSendVo.driverIdentityNum;
      $scope.newDeliveryInfo.carLoadWeight = data.cargoSendVo.carLoadWeight;
      $scope.newDeliveryInfo.remark = data.cargoSendVo.remark;
      if (data.success) {
        for (var i = 0; i < data.dtlList.length; i++) {
          var dt = data.dtlList[i];
          for (var j = 0; j < $scope.cardProductOwnerVoList.length; j++) {
            var repository = $scope.cardProductOwnerVoList[j];
            for (var m = 0; m < repository.storageVoList.length; m++) {
              var storage = repository.storageVoList[m];
              if (storage.id == dt.storageId) {
                storage.checked = true;
                $scope.checkStorage(repository, storage);
              }
            }
          }
        }
      } else {

      }
    }).error(function (data) {

    });
  }

  $scope.checkStorage = function (repository, storage) {
    if (storage.checked) {
      repository.selectedWeight = repository.selectedWeight.add(new BigDecimal(storage.weight.toString()));
      $scope.newDeliveryInfo.storageIdList.push(storage.id);
    } else {
      for (var i = 0; i < $scope.newDeliveryInfo.storageIdList.length; i++) {
        if ($scope.newDeliveryInfo.storageIdList[i] == storage.id) {
          $scope.newDeliveryInfo.storageIdList.splice(i, 1);
          repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
          break;
        }
      }
    }
  }

  $scope.ok = function () {
    var prefix;
    if(edit){
      prefix = '编辑';
    }else{
      prefix = '添加';
    }
    var url = domainConfig.hulkDomain + 'hulk/cargoSend';
    formService.put(url, $scope.newDeliveryInfo).success(function (data) {
      if (data.success) {
        toastr['success'](prefix+'发货单成功！', '提示');
        $uibModalInstance.close();
      } else {
        toastr['error'](data.msg, prefix+'发货单失败！');
      }
    }).error(function (data) {
      toastr['error'](prefix+'发货单失败！', '提示');
    });
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


});