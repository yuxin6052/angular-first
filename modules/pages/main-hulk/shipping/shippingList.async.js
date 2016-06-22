var app = angular.module('exingcai_captain_web');

app.register.controller('ShippingListCtrl', function ($rootScope, $scope, $uibModal, $log, $http, $injector, listService, domainConfig, formService) {

  $scope.cargoOutBatchList = [];
  $scope.totalSum = 0;
  $scope.unhandledSum = 0;
  $scope.unConfirmedSum = 0;
  $scope.passedSum = 0;
  $scope.failedSum = 0;
  $scope.queryStatus;
  $scope.queryParameters = {
    batchNo: '',
    cargoNoShow: '',
    ownerName: '',
    startDate: '',
    endDate: ''
  };

  $scope.cargoOutBatchList = [];

  $scope.pagination = {
    totalItems: 0,
    maxSize: 5,
    currentPage: 1,
    pageSize: 10
  }

  $scope.init = function () {
    $scope.initTotalItems();
    $scope.queryShippingList();
    $scope.initDatePicker();
  }

  $scope.initDatePicker = function () {
    if (jQuery().datepicker) {
      $.fn.datepicker.dates['zh'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        meridiem: ["上午", "下午"],
        //suffix:      ["st", "nd", "rd", "th"],  
        today: "今天"
      };
      $('.date-picker').datepicker({
        language: 'zh',
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true
      });
    }
  }

  $scope.queryShippingList = function () {
    var params = {
      cargoNoShow: $scope.queryParameters.cargoNoShow,
      batchNo: $scope.queryParameters.batchNo,
      ownerName: $scope.queryParameters.ownerName,
      startDate: $scope.queryParameters.startDate,
      endDate: $scope.queryParameters.endDate,
      status: $scope.queryStatus,
      page: $scope.pagination.currentPage,
      pageSize: $scope.pagination.pageSize
    };
    var url = domainConfig.hulkDomain + 'hulk/cargoOut';
    listService.events(url, params).success(function (data, status, headers) {
      $scope.cargoOutBatchList = data.cargoOutList;
      $scope.pagination.totalItems = data.total;
    }).error(function (data) {

    });
  }

  $scope.initTotalItems = function () {
    var url = domainConfig.hulkDomain + 'hulk/cargoOut/countByStatus';
    listService.events(url).success(function (data, status, headers) {
      $scope.totalSum = data.countOfStart + data.countOfComplete + data.countOfCompleteOK + data.countOfCompleteProblem;
      $scope.unhandledSum = data.countOfStart;
      $scope.unConfirmedSum = data.countOfComplete;
      $scope.passedSum = data.countOfCompleteOK;
      $scope.failedSum = data.countOfCompleteProblem;
    }).error(function (data) {

    });
  }

  $scope.changeTab = function (queryStatus) {
    $scope.queryStatus = queryStatus;
    $scope.pagination.currentPage = 1;
    $scope.queryParameters = {
      batchNo: '',
      cargoNoShow: '',
      ownerName: '',
      startDate: '',
      endDate: ''
    };
    $scope.queryShippingList();
  }

  $scope.pageChanged = function () {
    $log.log('Page changed to: ' + $scope.pagination.currentPage);
    //reloaddata
    $scope.queryShippingList();
  }

  $scope.setPage = function (pageNo) {
    $scope.pagination.currentPage = pageNo;
    //reload data
    $scope.queryShippingList();
  }

  $scope.openAddModal = function (oldShipping) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: __uri('../../common/editShippingOrder.tpl.html'),
      controller: 'EditShippingOrderCtrl',
      size: 'lg',
      resolve: {
        cargoSendId: function () {
          return null;
        },
        ownerId: function () {
          return oldShipping.ownerId;
        },
        shippingId: function () {
          return oldShipping.id;
        }
      }
    });

    modalInstance.result.then(function (shipping) {
      var url = domainConfig.hulkDomain + 'hulk/cargoOut';
      formService.put(url, shipping).success(function (data) {
        if (data.success) {
          oldShipping.status = $rootScope.CARGO_OUT_STATUS.WAIT_FOR_SHIPPING;
          $scope.initTotalItems();
          toastr['success']('编辑出库单成功！', '提示');
        } else {
          toastr['error']('编辑出库单失败！', '提示');
        }
      }).error(function (data, status, headers, config) {
        toastr['error']('编辑出库单失败！', '提示');
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.expandDetail = function (shipping) {
    shipping.expanded = !shipping.expanded;
    if (shipping.expanded) {
      //load detail
      var params = {
        cargoOutId: shipping.id
      };
      var url = domainConfig.hulkDomain + 'hulk/cargoOut/queryDtl';
      listService.events(url, params).success(function (data, status, headers) {
        if (data.success) {
          shipping.wlCompanyName = data.wlCompanyName;
          shipping.wlCompanyPerson = data.wlCompanyPerson;
          shipping.wlCompanyPhone = data.wlCompanyPhone;
          shipping.opPerson = data.cargoOutVo.opPerson;
          shipping.approvePerson = data.cargoOutVo.approvePerson;
          shipping.remark = data.cargoOutVo.remark;
          shipping.driverList = [{
            toolNo: data.carCode,
            driverName: data.driverName,
            driverIdentityNo: data.driverIdentityNum,
            carLoadWeight: data.carLoadWeight
          }];
          shipping.cardProductOwnerVoList = [];
          for (var i = 0; i < data.cardProductOwnerVoList.length; i++) {
            var repo = data.cardProductOwnerVoList[i];
            var newRepo = {};
            angular.copy(repo, newRepo);
            newRepo.storageVoList = [];
            for (var j = repo.storageVoList.length - 1; j >= 0; j--) {
              for (var m = data.dtlList.length - 1; m >= 0; m--) {
                if (data.dtlList[m].storageId == repo.storageVoList[j].id) {
                  newRepo.storageVoList.push(repo.storageVoList[j]);
                  break;
                }
              }
            }
            if (newRepo.storageVoList.length > 0) {
              shipping.cardProductOwnerVoList.push(newRepo);
            }
          }
          /*angular.forEach(shipping.cardProductOwnerVoList,function(e1,index1){
            angular.forEach(e1.storageVoList,function(e2,index2){
              angular.forEach(data.dtlList,function(e3,index3){
                if(e3.storageId == e2.id){
                  e2.checked = true;
                }
              });
            });
          });*/
        } else {
          toastr['error']('加载数据失败！', '提示');
        }
      }).error(function (data) {
        toastr['error']('加载数据失败！', '提示');
      });
    }
  }

  $scope.confirmShipping = function (shipping) {
    var url = domainConfig.hulkDomain + 'hulk/cargoOut/doOut?id=' + shipping.id;
    formService.put(url).success(function (data, status, headers) {
      if (data.success) {
        shipping.status = $rootScope.CARGO_OUT_STATUS.WAIT_FOR_CONFIRM;
        $scope.initTotalItems();
        toastr['success']('出库成功！', '提示');
      } else {
        toastr['error']('出库失败！', '提示');
      }
    }).error(function (data) {
      toastr['error']('出库失败！', '提示');
    });
  }
});
// app.register.controller('editShippingModalCtrl', function ($http, $scope, $uibModalInstance, shippingId, listService, domainConfig) {
//   $scope.shipping = {
//     id: shippingId,
//     storageIdList: []
//   };
//   $scope.cardProductOwnerVoList = [];

//   $scope.init = function () {
//     var params = {
//       cargoOutId: shippingId
//     };
//     var url = domainConfig.hulkDomain + 'hulk/cargoOut/toEdit';
//     listService.events(url, params).success(function (data, status, headers) {
//       if (data.success) {
//         debugger;
//         $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
//         $scope.shipping = data.cargoOutVo;
//         $scope.shipping.storageIdList = [];
//         $scope.allSelectedCount;
//         angular.forEach($scope.cardProductOwnerVoList, function (e1, index1) {
//           e1.selectedWeight = new BigDecimal('0');
//            $scope.allSelectedCount=new BigDecimal('0');
//           angular.forEach(e1.storageVoList, function (e2, index2) {
//             angular.forEach(data.dtlList, function (e3, index3) {
//               if (e3.storageId == e2.id) {
//                 e1.selectedWeight = e1.selectedWeight.add(new BigDecimal(e2.weight.toString()));
//                 e2.checked = true;
//               }
//             });
//             $scope.allSelectedCount=$scope.allSelectedCount.add(e1.selectedWeight);
//           });
//         });
//         angular.forEach(data.dtlList, function (dt, index) {
//           $scope.shipping.storageIdList.push(dt.storageId);
//         });
//       } else {
//         toastr['error']('加载数据失败！', '提示');
//       }
//     }).error(function (data) {
//       toastr['error']('加载数据失败！', '提示');
//     });
//   }

//   $scope.checkStorage = function (repository, storage) {
//     if (storage.checked) {
//       repository.selectedWeight = repository.selectedWeight.add(new BigDecimal(storage.weight.toString()));
//       $scope.shipping.storageIdList.push(storage.id);
//     } else {
//       for (var i = 0; i < $scope.shipping.storageIdList.length; i++) {
//         if ($scope.shipping.storageIdList[i] == storage.id) {
//           $scope.shipping.storageIdList.splice(i, 1);
//           repository.selectedWeight = repository.selectedWeight.subtract(new BigDecimal(storage.weight.toString()));
//           break;
//         }
//       }
//     }
//   }

//   $scope.ok = function (valid) {
//     if (valid) {
//       $uibModalInstance.close($scope.shipping);
//     } else {
//       angular.forEach($scope.myForm.$error, function (field) {
//         angular.forEach(field, function (errorField) {
//           errorField.$setTouched();
//           errorField.$setDirty();
//         })
//       });
//     }

//   }

//   $scope.cancel = function () {
//     $uibModalInstance.dismiss('cancel');
//   };
// });