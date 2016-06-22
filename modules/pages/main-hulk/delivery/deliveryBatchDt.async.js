var app = angular.module('exingcai_captain_web');

app.register.controller('DeliveryBatchDtCtrl', function ($rootScope, $scope, $uibModal, $log, $http, $injector, $q, listService, $stateParams, domainConfig, formService) {
  $scope.productProperties = ['qdd', 'w', 'e', 'r', 't', 'y', 'u', 'i'];

  $scope.deliveryBatchNo = $stateParams.deliveryBatchNo;

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.basicInfo = {};

  $scope.deliveryList = [];

  $scope.init = function () {
    $scope.querydeliveryList();
    $scope.queryBasicInfo();

  }





  $scope.querydeliveryList = function () {
    var params = {
      batchNo: $scope.deliveryBatchNo,
      page: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/list';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.deliveryList = data.cargoSendList;
      $scope.pagination.totalItems = data.total;
    }).error(function (data) {

    });
  }

  $scope.queryBasicInfo = function () {
    var params = {
      batchNo: $scope.deliveryBatchNo,
      type: 1
    };
    var url = domainConfig.hulkDomain + 'hulk/contractBatch/selectByBatchNo';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.basicInfo = data;
    }).error(function (data) {

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

  $scope.checkDelivery = function (delivery) {
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

  $scope.createShippingOrder = function (delivery) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: __uri('../../common/editShippingOrder.tpl.html'),
      controller: 'EditShippingOrderCtrl',
      size: 'lg',
      resolve: {
        cargoSendId: function () {
          return delivery.id;
        },
        ownerId: function () {
          return $scope.basicInfo.ownerId;
        },
        shippingId: function () {
          return null;
        }
      }
    });

    modalInstance.result.then(function (req) {
      var url = domainConfig.hulkDomain + 'hulk/cargoOut';
      formService.put(url, req).success(function (data) {
        if (data.success) {
          delivery.existCargoOut = true;
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

  $scope.popEditDeliveryModal = function (delivery) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'editDeliveryModal.html',
      controller: 'editDeliveryModalCtrl',
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
// app.register.controller('AddModalCtrl', function ($http, $scope, $uibModalInstance,$q, cargoSendId, listService, domainConfig,ownerId) {
//   $scope.shipping = {
//     cargoSendId: cargoSendId,
//     storageIdList: []
//   };

//   $scope.cardProductOwnerVoList = [];
//   $scope.cardProductOwnerVoList1 = [];
//   $scope.totalSelectedWeight = new BigDecimal('0');

//   $scope.$watch('cardProductOwnerVoList1', function(newList, oldList) {
//     $scope.totalSelectedWeight = new BigDecimal('0');
//     for(var i = 0;i<$scope.cardProductOwnerVoList1.length;i++){
//       var repo = $scope.cardProductOwnerVoList1[i];
//       for(var j = 0;j<repo.storageVoList.length;j++){
//         var storage = repo.storageVoList[j];
//         if(storage.checked){
//           $scope.totalSelectedWeight = $scope.totalSelectedWeight.add(new BigDecimal(storage.weight.toString()));
//         }
//       }
//     }
//   },true);


//  $scope.queryParameters1 = {
//       cargoSendId: cargoSendId
//     };

//     $scope.queryParameters = {
//      // cargoSendId: cargoSendId
//     };

//   $scope.getStorage=function(){
//      var params = {
//       ownerId: ownerId
//     };
//     params=jQuery.extend(params, $scope.queryParameters);
//     var promise = $q.defer();
//     var url = domainConfig.hulkDomain + 'hulk/cargoSend/queryCardStorage';

//     listService.events(url, params).success(function (data, status, headers) {
//       if (data.success) {
//         promise.resolve();
//         $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
//         if($scope.cardProductOwnerVoList!=null&&$scope.cardProductOwnerVoList!=""){
//               for (var i = $scope.cardProductOwnerVoList.length - 1; i >= 0; i--) {
//               var repo = $scope.cardProductOwnerVoList[i];
//               repo.selectedWeight = new BigDecimal('0');
//             }
//           } else {
//             promise.reject();
//             toastr['error']('加载数据失败！', '提示');
//           }
//         }

//     }).error(function (data) {
//       promise.reject();
//       toastr['error']('加载数据为空', '提示');
//     });

//     return promise;

//   }
//   $scope.init = function () {
//     $scope.getStorage();
//    //暂时关闭
//     var url = domainConfig.hulkDomain + 'hulk/cargoOut/toEdit';
//     listService.events(url, $scope.queryParameters1 ).success(function (data, status, headers) {
//       angular.forEach(data.cardProductOwnerVoList, function (e1, index1) {
//         e1.selectedWeight = new BigDecimal('0');
//         angular.forEach(e1.storageVoList, function (e2, index2) {
//           angular.forEach(data.dtlList, function (e3, index3) {
//             if (e3.storageId == e2.id) {
//               e2.checked = true;
//               $scope.checkStorage(e1,e2);
//             }
//           });
//         });
//       });
//     }).error(function (data) {
//       toastr['error']('加载数据失败！', '提示');
//     });
//   }

//    $scope.getCondition = function(){
//     var url=domainConfig.hulkDomain + 'hulk/report/queryOption'; 
//      listService.events(url).success(function (data, status, headers) {
//       $scope.productCategoryList=data.productCategoryList;
//       $scope.brandList=data.brandList;
//       $scope.modelList=data.modelList;
//       $scope.cardList=data.cardList;
//     }).error(function (data) {

//     });
//   }
//   $scope.getCondition();
//   $scope.checkStorage = function (repository, storage) {
//     if (storage.checked) {
//       repository.selectedWeight = repository.selectedWeight.add(new BigDecimal(storage.weight.toString()));
//       var findRepo = false;
//       var findStorage = false;
//       angular.forEach($scope.cardProductOwnerVoList1,function(repo,i){
//         if(repo.cardName === repository.cardName ){
//           findRepo = true;
//           angular.forEach(repo.storageVoList,function(st,j){
//             if(st.id === storage.id){
//               findStorage = true;
//             }
//           });
//           if(!findStorage){
//             repo.selectedWeight = repo.selectedWeight.add(new BigDecimal(storage.weight.toString()));
//             repo.storageVoList.push(angular.copy(storage));
//           }
//         }
//       });
//       if(!findRepo){
//         var newRepo = angular.copy(repository);
//         newRepo.storageVoList = [angular.copy(storage)];
//         $scope.cardProductOwnerVoList1.push(newRepo)
//       }
//       // $scope.shipping.storageIdList.push(storage.id);
//     } else {
//       for(var i = 0; i < $scope.cardProductOwnerVoList1.length; i++){
//         var repo = $scope.cardProductOwnerVoList1[i];
//         if(repo.cardName===repository.cardName){
//           for(var j=0;j<repo.storageVoList.length;j++){
//             var st = repo.storageVoList[j];
//             if(st.id==storage.id){
//               repo.storageVoList.splice(j,1);
//               repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
//               repo.selectedWeight = repo.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
//               if(repo.storageVoList.length==0){//storageVoList length=0, remove this repo
//                 $scope.cardProductOwnerVoList1.splice(i,1);
//               }
//             }
//           }
//         }
//       }
//       // for (var i = 0; i < $scope.shipping.storageIdList.length; i++) {
//       //   if ($scope.shipping.storageIdList[i] == storage.id) {
//       //     $scope.shipping.storageIdList.splice(i, 1);
//       //     repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
//       //     break;
//       //   }
//       // }
//     }
//   }

//   $scope.ok = function () {
//     for(var i = 0;i<$scope.cardProductOwnerVoList1.length;i++){
//       var repo = $scope.cardProductOwnerVoList1[i];
//       for(var j = 0;j<repo.storageVoList.length;j++){
//         $scope.shipping.storageIdList.push(repo.storageVoList[j].id);
//       }
//     }
//     $uibModalInstance.close($scope.shipping);
//   }

//   $scope.cancel = function () {
//     $uibModalInstance.dismiss('cancel');
//   };
// });

app.register.controller('editDeliveryModalCtrl', function ($scope, $log, $http, $q, listService, $uibModalInstance, ownerId, deliveryId, contractBatchId, domainConfig, formService) {
  var edit = deliveryId ? true : false;
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
  $scope.queryParameters = {
    // cargoSendId: cargoSendId
  };

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
    params = jQuery.extend(params, $scope.queryParameters);
    var promise = $q.defer();
    var url = domainConfig.hulkDomain + 'hulk/cargoSend/queryCardStorage';
    listService.events(url, params).success(function (data, status, headers) {
      if (data.success) {
        promise.resolve();
        $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
        if ($scope.cardProductOwnerVoList) {
          for (var i = $scope.cardProductOwnerVoList.length - 1; i >= 0; i--) {
            var repo = $scope.cardProductOwnerVoList[i];
            repo.selectedWeight = new BigDecimal('0');
          }
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
    }
  }

  $scope.ok = function () {
    for (var i = 0; i < $scope.cardProductOwnerVoList1.length; i++) {
      var repo = $scope.cardProductOwnerVoList1[i];
      for (var j = 0; j < repo.storageVoList.length; j++) {
        var storage = repo.storageVoList[j];
        if (storage.checked) {
          $scope.newDeliveryInfo.storageIdList.push(storage.id);
        }
      }
    }
    var prefix;
    if (edit) {
      prefix = '编辑';
    } else {
      prefix = '添加';
    }
    var url = domainConfig.hulkDomain + 'hulk/cargoSend';
    formService.put(url, $scope.newDeliveryInfo).success(function (data) {
      if (data.success) {
        toastr['success'](prefix + '发货单成功！', '提示');
        $uibModalInstance.close();
      } else {
        toastr['error'](data.msg, prefix + '发货单失败！');
      }
    }).error(function (data) {
      toastr['error'](prefix + '发货单失败！', '提示');
    });
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };


});