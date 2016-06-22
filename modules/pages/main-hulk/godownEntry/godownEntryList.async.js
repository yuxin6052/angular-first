var app = angular.module('exingcai_captain_web');


app.register.controller('godownEntryList', function ($rootScope, $scope, $uibModal, $log, $http, $injector, listService, domainConfig, formService) {

    $scope.cargoInBatchList = [];

    $scope.totalSum = 4;
    $scope.unhandledSum = 4;
    $scope.unstoredSum = 4;
    $scope.storedSum = 4;
    $scope.queryStatus;
    $scope.queryParameters = {
        batchNo: '',
        cargoNoShow: '',
        ownerName: '',
        startDate: '',
        endDate: ''
    };

    $scope.pagination = {
        totalItems: 0,
        maxSize: 5,
        currentPage: 1,
        pageSize: 10
    }

    $scope.init = function () {
        $scope.initTotalItems();
        $scope.queryCargoInBatchList();
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

    $scope.queryCargoInBatchList = function () {
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
        var url = domainConfig.hulkDomain + 'hulk/cargoIn';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.cargoInBatchList = data.cargoInList;
            // $scope.cargoInBatchList = data.contractBatchList;
            $scope.pagination.totalItems = data.total;
        }).error(function (data) {

        });
    }

    $scope.initTotalItems = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoIn/countByStatus';
        listService.events(url).success(function (data, status, headers) {
            $scope.totalSum = data.countOfStart + data.countOfDoing + data.countOfComplete;
            $scope.unhandledSum = data.countOfStart;
            $scope.unstoredSum = data.countOfDoing;
            $scope.storedSum = data.countOfComplete;
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
        $scope.queryCargoInBatchList();
    }

    $scope.pageChanged = function () {
        $log.log('Page changed to: ' + $scope.pagination.currentPage);
        //reloaddata
        $scope.queryCargoInBatchList();
    }

    $scope.setPage = function (pageNo) {
        $scope.pagination.currentPage = pageNo;
        //reload data
        $scope.queryCargoInBatchList($scope.queryStatus);
    }

    $scope.expandDetail = function (cargoIn) {
        cargoIn.expanded = !cargoIn.expanded;
        if (cargoIn.expanded) {
            //load detail
            var params = {
                cargoInId: cargoIn.id
            };
            var url = domainConfig.hulkDomain + 'hulk/cargoIn/queryCargoInDetailById';
            listService.events(url, params).success(function (data, status, headers) {
                if (data.success) {
                    cargoIn.wlCompanyName = data.wlCompanyName;
                    cargoIn.wlCompanyPerson = data.wlCompanyPerson;
                    cargoIn.wlCompanyPhone = data.wlCompanyPhone;
                    cargoIn.cargoList = data.productList;
                } else {
                    toastr['error']('加载数据失败！', '提示');
                }
            }).error(function (data) {
                toastr['error']('加载数据失败！', '提示');
            });
        }
    }

    $scope.openAddModal = function (cargoIn, size) {
        $rootScope.id = cargoIn.id;


        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addModal.html',
            controller: 'godownEntryListModal',
            size: 'lg',
            resolve: {
                cargoIn: function () {
                    return cargoIn;

                }
            }
        });


        modalInstance.result.then(function (req) {
             cargoIn.status = $rootScope.CARGO_IN_STATUS.WAIT_FOR_STORING;
                    $scope.initTotalItems();
            
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.confirmCargoIn = function (cargoIn) {
        var url = domainConfig.hulkDomain + 'hulk/cargoIn/doIn?id=' + cargoIn.id;
        formService.put(url).success(function (data) {
            if (data.success) {
                toastr['success']('入库成功！', '提示');
                cargoIn.status = $rootScope.CARGO_IN_STATUS.STORED;
                $scope.initTotalItems();
            } else {
                toastr['error']('入库失败！', '提示');
            }
        }).error(function (data, status, headers, config) {
            toastr['error']('入库失败！', '提示');
        });

    }

});
app.register.controller('godownEntryListModal', function ($rootScope, $http, $scope, $uibModalInstance, $filter, listService, domainConfig,cargoIn,formService) {
    $scope.goodsList = [], goods = {};
    
    $scope.checkTypeList = [{ "name": "抄码", "value": 100 }];
    if ($scope.isSmallPound == 1) {
        var checkTypeObj = { "name": "小磅", "value": 200 };
        $scope.checkTypeList.push(checkTypeObj);
    }

    $scope.form = {
        "approvePerson": "",
        "id": $rootScope.id,
        "dtlList": [],

        "opPerson": ""
    };
    $scope.isExactWeight;

    $scope.addPlace = function (product) {
        var obj = {
            "cardId": product.id,

            "count": "1",
            "countUnitCode": product.countUnitCode,
            "placeCode": "",
            "productId": product.productId,
            "weight": "",
            "produceDateStr": product.produceDateStr,
            "weightMao": "",
            "weightUnitCode": "吨"
        };
        angular.forEach($scope.cardProductOwnerVoList, function (productObj, key) {
            if (productObj.id == product.id && productObj.productId == product.productId) {
                productObj.storageVoList.push(obj);

            }

        });

    };
    $scope.removePlace = function (parentIndex, index) {
        $scope.cardProductOwnerVoList[parentIndex].storageVoList.splice(index, 1);

    }

    $scope.analyseBatch=function (productBatch,productIndex,storageIndex){
        if(productBatch == undefined || productBatch.length < 6) return ;
        var year = productBatch.substring(0,2) ;
        var month = productBatch.substring(2,4) ;
        var day = productBatch.substring(4,6) ;
        var datastr = "20" + year +"-"  + month +"-"  + day;
        $scope.cardProductOwnerVoList[productIndex].storageVoList[storageIndex].produceDateStr =new Date(datastr) ;
    }
    $scope.analyseCopyCodeNetWeight = function(weightMao,productIndex,storageIndex){ 
        var weight = $scope.cardProductOwnerVoList[productIndex].storageVoList[storageIndex].copyCodeNetWeight ;
        if(weight != undefined && weight != "") return ;
        var weightMao0 = $scope.cardProductOwnerVoList[productIndex].storageVoList[0].copyCodeGrossWeight ;
        var weight0 = $scope.cardProductOwnerVoList[productIndex].storageVoList[0].copyCodeNetWeight ;
        if(weightMao0 != undefined && weight0 != undefined) {
            var mao = new BigDecimal(weightMao0.toString()).subtract(new BigDecimal(weight0.toString()));
            var result = new BigDecimal(weightMao.toString()).subtract(mao).toString() ;
            $scope.cardProductOwnerVoList[productIndex].storageVoList[storageIndex].copyCodeNetWeight = result ;
        }
    }

    $scope.init = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoIn/toEdit';
        var params = { "cargoInId": $rootScope.id };

        listService.events(url, params).success(function (data, status, headers) {
            $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
            $scope.form.approvePerson = data.approvePerson;
            $scope.isBigPound = data.isBigPound;
            $scope.isSmallPound = data.isSmallPound;
            $scope.form.opPerson = data.opPerson;
            $scope.form.checkType=data.checkType;
            $scope.form.bigGrossWeight=data.bigGrossWeight;
            $scope.isExactWeight = data.isExactWeight;
            angular.forEach($scope.cardProductOwnerVoList, function (productObj, key) {
                if (productObj.produceDateStr == null || productObj.produceDateStr == "") {
                    productObj.produceDateStr = "";
                } else {
                    productObj.produceDateStr = new Date(productObj.produceDateStr);

                }
                var length = 6 - productObj.cardName.length - 1;
                productObj.placeCodeRegex = new RegExp('^' + productObj.cardName + '\\d{' + length + '}[a-zA-Z]$');
                var obj = {
                    "cardId": productObj.id,

                    "count": "1",
                    "countUnitCode": productObj.countUnitCode,
                    "placeCode": "",
                    "productId": productObj.productId,
                    "produceDateStr": productObj.produceDateStr,
                    "weight": "",
                    "weightMao": "",
                    "weightUnitCode": "吨"
                };
                if (productObj.storageVoList == null) {
                    productObj.storageVoList = [];
                    productObj.storageVoList.push(obj);
                };

                angular.forEach(productObj.storageVoList, function (obj, key) {
                    if(obj.produceDateStr!=""&&obj.produceDateStr!=null){
                        obj.produceDateStr=new Date(obj.produceDateStr);
                    }else{

                    }
                    
                }
                    )


            });

        }).error(function (data) {
            console.log("初始化生成入库单报错！")
        });

    }
    $scope.init();

    $scope.ok = function (valid) {
        if (!valid) {
            angular.forEach($scope.myForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                    errorField.$setDirty();
                })
            });
            return;
        }
        var map = {};
        var duplicatedPlaceCode = false;
        var weightError = false;
        var countError = false;
        angular.forEach($scope.cardProductOwnerVoList, function (productObj, key) {
            productObj.weightError = false;
            productObj.countError = false;
            var totalWeight = new BigDecimal('0');
            var totalCount = 0;
            angular.forEach(productObj.storageVoList, function (storage, key) {
                storage.produceDateStr = $filter('date')(storage.produceDateStr, 'yyyy-MM-dd');

                var weightMao = storage.weightMao ? storage.weightMao : '0';
                totalWeight = totalWeight.add(new BigDecimal(weightMao.toString()));
                totalCount += Number(storage.count);

                if (map[storage.placeCode]) {
                    duplicatedPlaceCode = true;
                } else {
                    $scope.form.dtlList.push(storage);
                    map[storage.placeCode] = true;
                }
            })
            // if ($scope.isExactWeight == $rootScope.VERIFY_TYPE.EXACT_WEIGHT && totalWeight.compareTo(new BigDecimal(productObj.weight + '')) != 0) {
            //     productObj.weightError = true;
            //     weightError = true;
            //     // toastr['error']('品名：'+productObj.product.productName+',品牌：'+productObj.product.brandName,'入库单总毛重与收货单总重量不等');
            // }
            // if (totalCount != productObj.count) {
            //     productObj.countError = true;
            //     countError = true;
            // }
        });

        if (duplicatedPlaceCode) {
            toastr['error']('货位重复！', '生成入库单失败');
        } else if (weightError) {
            toastr['error']('总重量校验失败！', '提示');
        } else if (countError) {
            toastr['error']('总数量校验失败！', '提示');
        } else {
            
             var url = domainConfig.hulkDomain + 'hulk/cargoIn';
            formService.put(url, $scope.form).success(function (data) {
                if (data.success) {
                    toastr['success']('完善入库单成功！', '提示');
                    cargoIn.status = $rootScope.CARGO_IN_STATUS.WAIT_FOR_STORING;
                    
                    $uibModalInstance.close($scope.form);
                } else {
                    toastr['error']('生成入库单失败！', '提示');
                }
            }).error(function (data, status, headers, config) {
                toastr['error']('生成入库单失败！', '提示');
            });
       
            
        }
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

 function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        showWeeks: true
    };

    $scope.dateOptions = {
       
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        startingDay: 1
    };

    // Disable weekend selection



    $scope.open2 = function (obj) {

        obj.opened = true;

    };

    $scope.openDatePicker = function (obj) {
        obj.opened = true;
    }


    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];


    $scope.popup2 = {
        opened: false
    };


    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
});





