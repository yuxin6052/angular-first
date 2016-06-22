var app = angular.module('exingcai_captain_web');

app.controller('EditShippingOrderCtrl', function ($http, $scope, $uibModalInstance, $q, cargoSendId, listService, domainConfig,shippingId, ownerId) {
  $scope.shipping = {
    id:shippingId,
    cargoSendId: cargoSendId,
    storageIdList: []
  };

  $scope.cardProductOwnerVoList = [];
  $scope.cardProductOwnerVoList1 = [];
  $scope.totalSelectedWeight = new BigDecimal('0');

  $scope.$watch('cardProductOwnerVoList1', function (newList, oldList) {
    $scope.totalSelectedWeight = new BigDecimal('0');
    for (var i = 0; i < $scope.cardProductOwnerVoList1.length; i++) {
      var repo = $scope.cardProductOwnerVoList1[i];
      for (var j = 0; j < repo.storageVoList.length; j++) {
        var storage = repo.storageVoList[j];
        if (storage.checked) {
          $scope.totalSelectedWeight = $scope.totalSelectedWeight.add(new BigDecimal(storage.weight.toString()));
        }
      }
    }
  }, true);


  $scope.queryParameters1 = {
    cargoSendId: cargoSendId,
    cargoOutId: shippingId
  };

  $scope.queryParameters = {
    // cargoSendId: cargoSendId
  };

  $scope.getStorage = function () {
    var params = {
      ownerId: ownerId
    };
    params = jQuery.extend(params, $scope.queryParameters);
    var promise = $q.defer();
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/queryCardStorage';

    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        promise.resolve();
        $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
        if ($scope.cardProductOwnerVoList != null && $scope.cardProductOwnerVoList != "") {
          for (var i = $scope.cardProductOwnerVoList.length - 1; i >= 0; i--) {
            var repo = $scope.cardProductOwnerVoList[i];
            repo.selectedWeight = new BigDecimal('0');
          }
        } else {
          promise.reject();
          toastr['error']('加载数据失败！', '提示');
        }
      }

    }).error(function (data) {
      promise.reject();
      toastr['error']('加载数据为空', '提示');
    });

    return promise;
  }
  
  $scope.init = function () {
    $scope.getStorage();
    //暂时关闭
    var url = domainConfig.hulkDomain + 'hulk/cargoOut/toEdit';
    listService.events(url, $scope.queryParameters1).success(function (data, status, headers) {
      angular.forEach(data.cardProductOwnerVoList, function (e1, index1) {
        e1.selectedWeight = new BigDecimal('0');
        angular.forEach(e1.storageVoList, function (e2, index2) {
          angular.forEach(data.dtlList, function (e3, index3) {
            if (e3.storageId == e2.id) {
              e2.checked = true;
              $scope.checkStorage(e1, e2);
            }
          });
        });
      });

    }).error(function (data) {
      toastr['error']('加载数据失败！', '提示');
    });
  }

  $scope.getCondition = function () {
    var url = domainConfig.hulkDomain + 'hulk/report/queryOption';
    listService.events(url).success(function (data, status, headers) {
      $scope.productCategoryList = data.productCategoryList;
      $scope.brandList = data.brandList;
      $scope.modelList = data.modelList;
      $scope.cardList = data.cardList;
    }).error(function (data) {

    });
  }
  $scope.getCondition();
  $scope.checkStorage = function (repository, storage) {
    if (storage.checked) {
      repository.selectedWeight = repository.selectedWeight.add(new BigDecimal(storage.weight.toString()));
      var findRepo = false;
      var findStorage = false;
      angular.forEach($scope.cardProductOwnerVoList1, function (repo, i) {
        if (repo.cardName === repository.cardName) {
          findRepo = true;
          angular.forEach(repo.storageVoList, function (st, j) {
            if (st.id === storage.id) {
              findStorage = true;
            }
          });
          if (!findStorage) {
            repo.selectedWeight = repo.selectedWeight.add(new BigDecimal(storage.weight.toString()));
            repo.storageVoList.push(angular.copy(storage));
          }
        }
      });
      if (!findRepo) {
        var newRepo = angular.copy(repository);
        newRepo.storageVoList = [angular.copy(storage)];
        $scope.cardProductOwnerVoList1.push(newRepo)
      }
      // $scope.shipping.storageIdList.push(storage.id);
    } else {
      for (var i = 0; i < $scope.cardProductOwnerVoList1.length; i++) {
        var repo = $scope.cardProductOwnerVoList1[i];
        if (repo.cardName === repository.cardName) {
          for (var j = 0; j < repo.storageVoList.length; j++) {
            var st = repo.storageVoList[j];
            if (st.id == storage.id) {
              repo.storageVoList.splice(j, 1);
              repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
              repo.selectedWeight = repo.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
              if (repo.storageVoList.length == 0) {//storageVoList length=0, remove this repo
                $scope.cardProductOwnerVoList1.splice(i, 1);
              }
            }
          }
        }
      }
      // for (var i = 0; i < $scope.shipping.storageIdList.length; i++) {
      //   if ($scope.shipping.storageIdList[i] == storage.id) {
      //     $scope.shipping.storageIdList.splice(i, 1);
      //     repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
      //     break;
      //   }
      // }
    }
  }

  $scope.ok = function () {
    for (var i = 0; i < $scope.cardProductOwnerVoList1.length; i++) {
      var repo = $scope.cardProductOwnerVoList1[i];
      for (var j = 0; j < repo.storageVoList.length; j++) {
        var storage = repo.storageVoList[j];
        if (storage.checked) {
          $scope.shipping.storageIdList.push(storage.id);
        }
      }
    }
    
    $uibModalInstance.close($scope.shipping);
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});