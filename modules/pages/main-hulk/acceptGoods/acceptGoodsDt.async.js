var app = angular.module('exingcai_captain_web');


app.register.controller('acceptGoodsDt', function ($rootScope, $scope, $uibModal, $log, $http, $stateParams, listService, domainConfig, formService) {

    var pager = listService.pager;
    console.log(pager.currentPage);
    $scope.batchNo = $stateParams.batchNo;
    $scope.cargoRecieveList = [];


    $scope.basicInfo = {};

    $scope.pagination = {
        totalItems: 0,
        maxSize: 5,
        currentPage: 1,
        pageSize: 10
    };

    $scope.init = function () {
        $scope.queryCargoRecieveList();
        $scope.queryBasicInfo();
    };

    $scope.queryCargoRecieveList = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoRecieve';
        var params = {
            batchNo: $scope.batchNo,
            page: $scope.pagination.currentPage,
            pageSize: $scope.pagination.pageSize
        };
        listService.events(url, params).success(function (data, status, headers) {
            $scope.cargoRecieveList = data.cargoRecieveList;
            $scope.pagination.totalItems = data.total;
            angular.forEach($scope.cargoRecieveList, function (obj, k) {
                obj.expanded = false;
            });
        }).error(function (data) {
            $scope.cargoRecieveList = [{
                expanded: false,
                "startDate": "2016-04-16",
                "driver": "周凯",
                "driverId": "43110219**********",
                "licenseCode": "沪A000001",
                "maxLoad": "50",
                "id": "SHPCH20160416",
                "status": 110
            }];
        });
    }


    $scope.queryBasicInfo = function () {
        var params = {
            batchNo: $scope.batchNo,
            type: 3
        };
        var url = domainConfig.hulkDomain + 'hulk/contractBatch/selectByBatchNo';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.basicInfo = data;
            $rootScope.detailId = data.id;
        }).error(function (data) {

        });
    }

    $scope.expandcargoRecieveDetail = function (cargoRecieve) {
        cargoRecieve.expanded = !cargoRecieve.expanded
        if (cargoRecieve.expanded && (!cargoRecieve.productList || cargoRecieve.productList.length == 0)) {

            //load cargo info
            var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/' + cargoRecieve.id;
            listService.events(url).success(function (data, status, headers) {
                cargoRecieve.productList = [];
                angular.forEach(data.dtlList, function (obj, index) {
                    var product = {
                        productName: obj.product ? obj.product.productName : '',
                        categoryName: obj.product ? obj.product.modelName : '',
                        brandName: obj.product ? obj.product.brandName : '',
                        count: obj.actualCount,
                        countUnitCode: obj.countUnitCode,
                        weight: obj.actualWeight,
                        weightUnitCode: obj.weightUnitCode,
                        cardId: obj.cardId
                    };
                    cargoRecieve.productList.push(product);
                });
            }).error(function (data) {

            });
        }
    }
    $rootScope.expandcargoRecieveDetail = $scope.expandcargoRecieveDetail;

    $scope.checkCargoRecieve = function (cargoRecieve) {

        var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/checkCargoRecieve?id=' + cargoRecieve.id;
        formService.put(url).success(function (data, status, headers) {
            if (data.success) {
                cargoRecieve.status = $rootScope.CARGO_RECIEVE_STATUS.REACHED;
                toastr['success']('核对成功！', '提示');
            } else {
                toastr['error']('核对失败！', '提示');
            }
        }).error(function (data) {
            toastr['error']('核对失败！', '提示');
        });
    }

    $scope.pageChanged = function () {
        $log.log('Page changed to: ' + $scope.pagination.currentPage);
        //reloaddata
        $scope.queryCargoRecieveList();
    }

    $scope.setPage = function (pageNo) {
        $scope.pagination.currentPage = pageNo;
        //reload data
        $scope.queryCargoRecieveList();
    }

    $scope.openAddModal = function (cargoRecieve, size) {


        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addModal.html',
            controller: 'newGodownList',
            size: 'lg',
            backdrop:'static',
            resolve: {
                cargoRecieve: function () {
                    return cargoRecieve;

                }
                
            }
        });



        modalInstance.result.then(function (req) {
           
            
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.getProduct = function () {
        var url = domainConfig.scmdDomain + 'scmd/producteffect/queryAllProductCategory';
        listService.events(url).success(function (data, status, headers) {

            $rootScope.productList = data.productCategorys;

        }).error(function (data) {

        });
    }
    $scope.getProduct();
    $scope.getCountUnit = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/listCountUnit';
        listService.events(url).success(function (data, status, headers) {
            $rootScope.countUnitList = data.countUnitList;

        }).error(function (data) {

        });
    }
    $scope.getCountUnit();
    $scope.getCard = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/listCard';
        listService.events(url).success(function (data, status, headers) {
            $rootScope.cardList = data.cardVoList;

        }).error(function (data) {

        });
    }
    $scope.getCard();
    $scope.openAddAcceptModal = function (cargoRecieve, size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addAcceptModal.html',
            controller: 'AddAcceptGoods',
            backdrop:'static',
            size: size,
            resolve: {
                cargoRecieveId: function () {
                    return cargoRecieve ? cargoRecieve.id:null;
                },
                contractBatchId: function(){
                    return $scope.basicInfo.id;
                }
            }
        });

        modalInstance.result.then(function (form) {
            if (form.isCopyCode == undefined||form.isCopyCode == false) {
                form.isCopyCode = 0;
            } else {
                form.isCopyCode = 1;
            }
            if (form.isBigPound == undefined||form.isBigPound == false) {
                form.isBigPound = 0;
            } else {
                form.isBigPound = 1;
            }
            if (form.isSmallPound == undefined||form.isSmallPound == false) {
                form.isSmallPound = 0;
            } else {
                form.isSmallPound = 1;
            }
            
            var url = domainConfig.hulkDomain + 'hulk/cargoRecieve';
            formService.put(url, form).success(function (data) {

                // $scope.isHideNewCompany = true;
                if (data.success) {
                    toastr['success']('新增收货单成功', '提示');
                    $scope.queryCargoRecieveList();
                } else {
                    toastr['error'](data.msg, '新增收货单失败');
                    // $scope.init().then(function () {
                    //     $scope.ownerName = company.compName;
                    //     // $scope.acceptGoodsBatch.ownerId = data.userId;
                    // });
                }
            }).error(function (data, status, headers, config) {
                toastr['error']('新增收货单失败', '提示');
            });



        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    app.register.controller('AddAcceptGoods', function ($http, $scope, $rootScope, $uibModalInstance, domainConfig, listService,contractBatchId, cargoRecieveId) {
        $scope.form = {
            contractBatchId: contractBatchId,
            id:cargoRecieveId,
            // id:cargoRecieve.id,
            // driverName:cargoRecieve.driverName,
            // driverIdentityNum:cargoRecieve.driverIdentityNum,
            // carCode:cargoRecieve.carCode,
            // carLoadWeight:cargoRecieve.carLoadWeight,
            // isCopyCode:cargoRecieve.isCopyCode==1?true:false,
            // isBigPound:cargoRecieve.isBigPound==1?true:false,
            // isSmallPound:cargoRecieve.isSmallPound==1?true:false,

            productDtlList: []

        }
        
        $scope.init = function(){
            if(cargoRecieveId){
                $scope.queryProducts(cargoRecieveId);
            }
        }
        
        $scope.queryProducts = function(id){
            var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/' + id;
            listService.events(url).success(function (data, status, headers) {
                $scope.form.isCopyCode = data.cargoRecieveVo.isCopyCode == 1 ? true:false;
                $scope.form.isBigPound = data.cargoRecieveVo.isBigPound== 1 ? true:false;
                $scope.form.isSmallPound = data.cargoRecieveVo.isSmallPound== 1 ? true:false;
                $scope.form.carCode = data.cargoRecieveVo.carCode;
                $scope.form.driverName = data.cargoRecieveVo.driverName;

                $scope.form.driverIdentityNum = data.cargoRecieveVo.driverIdentityNum;
                $scope.form.carLoadWeight = data.cargoRecieveVo.carLoadWeight;
                $scope.form.remark = data.cargoRecieveVo.remark;
               
                angular.forEach(data.dtlList, function (obj, index) {
                    var gzProductId=obj.productCategoryId;
                    var gzModel=obj.modelId;
                     var product = {
                        gzProductId: obj.productCategoryId ,
                        productId: obj.productId,
                        gzModelId:obj.modelId,
                        // brandName: obj.product ? obj.product.brandName : '',
                        count: obj.actualCount,
                        countUnitCode: obj.countUnitCode,
                        weight: obj.actualWeight,
                        weightUnitCode: obj.weightUnitCode,
                        cardId: obj.cardId
                    };
                    // var callback=function(){
                    //     $scope.form.productDtlList.push(product);
                    // }
                    $scope.getModelOrBrand(product,gzProductId);
                    $scope.getModelOrBrand(product,gzProductId,gzModel);
                     $scope.form.productDtlList.push(product);
                   

                    
                });
            }).error(function (data) {

            });
        }

        $scope.getModelOrBrand = function (product, productCategoryId, modelId) {
            var params = {
                productCategoryId: productCategoryId,
                modelId: modelId
            };
            var url = domainConfig.scmdDomain + 'scmd/producteffect/queryProductEffect';
            listService.events(url, params).success(function (data, status, headers) {
                if (modelId) {
                    product.brandList = data.brands;
                } else {
                    product.modelList = data.models;
                    product.brandList = data.brands;
                }
               

            }).error(function (data) {

            });
        }

        // $scope.form.productDtlList = [];
        $scope.addGoods = function () {
            var product = { "gzProductId": "", "gzBrandId": "", "count": "", "countUnitCode": "", "weight": "", "weightUnitCode": "吨", "cardId": "" };
            $scope.form.productDtlList.push(product);
        }

        $scope.deleteGoods = function (index) {
            $scope.form.productDtlList.splice(index, 1);
        }

        // $scope.gzProductChange = function (obj, gzProduct) {
        //     getModelOrBrand(obj, gzProduct.id);
        //     obj.gzProductId = gzProduct.id;
        //     obj.gzProductName = gzProduct.productCategoryName;
        // }

        // $scope.gzModelChange = function (obj, gzModel) {
        //     getModelOrBrand(obj, obj.gzProductId, gzModel.id);
        //     obj.gzModelId = gzModel.id;
        //     obj.gzModelName = gzModel.modelName;
        // }

        // $scope.gzBrandChange = function (obj, brand) {
        //     obj.productId = brand.id;
        //     obj.brandName = brand.brandName;
        // }

        // $scope.cardChange = function (obj, card) {
        //     obj.cardId = card.id;
        //     obj.cardName = card.cardName;
        // }

        $scope.ok = function (valid) {
            if (valid) {
                if (!$scope.form.productDtlList.length || $scope.form.productDtlList.length == 0) {
                    toastr['error']('至少包含一件货物', '提示');
                } else {
                    $uibModalInstance.close($scope.form);
                }
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

    $scope.bigWeigh = function (cargoRecieve, size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'bigWeigh.html',
            controller: 'BigWeighCtrl',
            size: size,
            resolve: {
                cargoRecieve: function () {
                    return cargoRecieve;

                }
            }
        });

        modalInstance.result.then(function (req) {
            var url = domainConfig.hulkDomain + '';
            formService.put(url, req).success(function (data) {
                if (data.success) {

                } else {
                    toastr['error'](data.msg, '提示');
                }
            }).error(function (data, status, headers, config) {
                toastr['error'](data.msg, '提示');
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.smallWeigh = function (cargoRecieve, size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'smallWeigh.html',
            controller: 'SmallWeighCtrl',
            size: size,
            resolve: {
                cargoRecieve: function () {
                    return cargoRecieve;

                }
            }
        });

        modalInstance.result.then(function (req) {
            var url = domainConfig.hulkDomain + ''
            formService.put(url, req).success(function (data) {
                if (data.success) {

                } else {
                    toastr['error'](data.msg, '提示');
                }
            }).error(function (data, status, headers, config) {
                toastr['error'](data.msg, '提示');
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.confirmBigWeight = function (cargoRecieve, size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'confirmBigWeight.html',
            controller: 'ConfirmBigWeightCtrl',
            resolve: {
                cargoRecieve: function () {
                    return cargoRecieve;
                }
            }
        });

        modalInstance.result.then(function (req) {
            var url = domainConfig.hulkDomain + '';
            formService.put(url, req).success(function (data) {
                if (data.success) {

                } else {
                    toastr['error'](data.msg, '提示');
                }
            }).error(function (data, status, headers, config) {
                toastr['error'](data.msg, '提示');
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.confirmSmallWeight = function (cargoRecieve, size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'confirmSmallWeight.html',
            controller: 'ConfirmSmallWeightCtrl',
            resolve: {
                cargoRecieve: function () {
                    return cargoRecieve;
                }
            }
        });

        modalInstance.result.then(function (req) {
            var url = domainConfig.hulkDomain + '';
            formService.put(url, req).success(function (data) {
                if (data.success) {

                } else {
                    toastr['error'](data.msg, '提示');
                }
            }).error(function (data, status, headers, config) {
                toastr['error'](data.msg, '提示');
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

});
app.register.controller('newGodownList', function ($rootScope, $http, $scope, $uibModalInstance, $filter,$cookieStore, listService, domainConfig, cargoRecieve,formService) {
    $scope.goodsList = [], goods = {};

    $scope.isBigPound = cargoRecieve.isBigPound;
    $scope.isSmallPound = cargoRecieve.isSmallPound;
    $scope.checkTypeList = [{ "name": "抄码", "value": 100 }];
    if ($scope.isSmallPound == 1) {
        var checkTypeObj = { "name": "小磅", "value": 200 };
        $scope.checkTypeList.push(checkTypeObj);
    }
    var userName=$cookieStore.get("Security-Token").loginName;
    $scope.form = {
        "approvePerson": "",
        "cargoRecieveId": cargoRecieve.id,
        "dtlList": [],

        "opPerson": userName
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
            "obj.opened": false,
            "weightUnitCode": "吨"
        };
        angular.forEach($scope.cardProductOwnerVoList, function (productObj, key) {
            if (productObj.id == product.id && productObj.productId == product.productId) {
                
                 productObj.storageVoList.push(obj);
            }

        });

    };
    $scope.removePlace = function (productIndex, storageIndex) {
        $scope.cardProductOwnerVoList[productIndex].storageVoList.splice(storageIndex, 1);
    }
    $scope.maoWeight=0;$scope.netWeight=0;
    $scope.maoWeightCopy=0;$scope.netWeightCopy=0;
    $scope.sum=function(obj){
         
         // var totalWeight = new BigDecimal('0');var totalWeightNet=new BigDecimal('0');
         var totalWeightCopy = new BigDecimal('0');var totalWeightNetCopy=new BigDecimal('0');
           angular.forEach(obj.storageVoList, function (obj, key) {
            
                // totalWeight=totalWeight.add(new BigDecimal(obj.smallGrossWeight.toString()));
                // totalWeightNet=totalWeightNet.add(new BigDecimal(obj.smallNetWeight.toString()));
                totalWeightCopy=totalWeightCopy.add(new BigDecimal(obj.copyCodeGrossWeight.toString()));
                totalWeightNetCopy=totalWeightNetCopy.add(new BigDecimal(obj.copyCodeNetWeight.toString()));
                
                
        })
           // $scope.maoWeight=totalWeight.toString();
           // $scope.netWeight=totalWeightNet.toString();
            $scope.maoWeightCopy=totalWeightCopy.toString();
           $scope.netWeightCopy=totalWeightNetCopy.toString();
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
            var mao = weightMao0 - weight0;
            $scope.cardProductOwnerVoList[productIndex].storageVoList[storageIndex].copyCodeNetWeight = weightMao - mao ;
        }
    }

    $scope.init = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoIn/toEdit';
        var params = { "cargoRecieveId": cargoRecieve.id };

        listService.events(url, params).success(function (data, status, headers) {
            $scope.cardProductOwnerVoList = data.cardProductOwnerVoList;
            $scope.isExactWeight = data.isExactWeight;
            angular.forEach($scope.cardProductOwnerVoList, function (productObj, key) {
                var length = 6 - productObj.cardName.length - 1;
                productObj.placeCodeRegex = new RegExp('^' + productObj.cardName + '\\d{' + length + '}[a-zA-Z]$');
                for (var i = productObj.count - 1 ; i >= 0; i--) {
                     var obj = {
                        "cardId": productObj.id,

                        "count": "1",
                        "countUnitCode": productObj.countUnitCode,
                        "placeCode": "",
                        "productId": productObj.productId,
                        "produceDateStr": productObj.produceDateStr,
                        "obj.opened": false,
                        "weight": "",
                        "weightMao": "",
                        "weightUnitCode": "吨"
                    };
                    if (productObj.storageVoList == null) {
                        productObj.storageVoList = [];
                    }
                    productObj.storageVoList.push(obj); 
                }


            });

        }).error(function (data) {
            console.log("初始化生成入库单报错！")
        });

    }



    $scope.ok = function () {
        var map = {};
        var duplicatedPlaceCode = false;
        var weightError = false;
        var countError = false;
        angular.forEach($scope.cardProductOwnerVoList, function (productObj, key) {
            productObj.weightError = false;
            productObj.countError = false;
            var totalWeight = new BigDecimal('0');
            var totalCount = 0;
            $scope.form.dtlList=[];
            angular.forEach(productObj.storageVoList, function (storage, key) {
                var weightMao = storage.weightMao ? storage.weightMao : '0';
                totalWeight = totalWeight.add(new BigDecimal(weightMao.toString()));
                totalCount += Number(storage.count);

                if (map[storage.placeCode]) {
                    duplicatedPlaceCode = true;
                } else {
                    
                    map[storage.placeCode] = true;
                }
                $scope.form.dtlList.push(storage);

                storage.produceDateStr = $filter('date')(storage.produceDateStr, 'yyyy-MM-dd');
            })
            if ($scope.isExactWeight == $rootScope.VERIFY_TYPE.EXACT_WEIGHT && totalWeight.compareTo(new BigDecimal(productObj.weight + '')) != 0) {
                productObj.weightError = true;
                weightError = true;
                // toastr['error']('品名：'+productObj.product.productName+',品牌：'+productObj.product.brandName,'入库单总毛重与收货单总重量不等');
            }
            if (totalCount != productObj.count) {
                productObj.countError = true;
                countError = true;
            }
        });
       var url = domainConfig.hulkDomain + 'hulk/cargoIn';
            formService.put(url, $scope.form).success(function (data) {
                if (data.success) {
                    cargoRecieve.existCargoOut = true;
                    toastr['success']('生成入库单成功！', '提示');
                    $uibModalInstance.close($scope.form);
                } else {
                    toastr['error']('生成入库单失败！', '提示');
                }

            }).error(function (data, status, headers, config) {
                toastr['error']('生成入库单失败！', '提示');
            });
       
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };





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
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }


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

app.register.controller('BigWeighCtrl', function ($rootScope, $http, $scope, $uibModalInstance, $filter, listService, cargoRecieve, domainConfig) {
    $scope.cargoNoShow = cargoRecieve.cargoNoShow;
    $scope.ok = function () {
        $uibModalInstance.close({
            cargoRecieveId: cargoRecieve.id,
            weight: $scope.weight
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.register.controller('SmallWeighCtrl', function ($rootScope, $http, $scope, $uibModalInstance, $filter, listService, cargoRecieve, domainConfig) {
    $scope.form = {
        cargoNoShow: cargoRecieve.cargoNoShow,
        productList: [{
            name: 'qwe',
            model: '12qwe',
            brand: 'mnjk8',
        }]
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.form);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.register.controller('ConfirmBigWeightCtrl', function ($rootScope, $http, $scope, $uibModalInstance, $filter, listService, cargoRecieve, domainConfig) {
    $scope.form = {
        cargoNoShow: cargoRecieve.cargoNoShow,
        bigMaoWeight: 300,
        productList: [{
            name: 'qwe',
            model: '12qwe',
            brand: 'mnjk8',
        }]
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.form);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.register.controller('ConfirmSmallWeightCtrl', function ($rootScope, $http, $scope, $uibModalInstance, $filter, listService, cargoRecieve, domainConfig) {
    $scope.form = {
        cargoNoShow: cargoRecieve.cargoNoShow,
        productList: [{
            name: 'qwe',
            model: '12qwe',
            brand: 'mnjk8',
        }]
    }
    $scope.ok = function () {
        $uibModalInstance.close($scope.form);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});