var app = angular.module('exingcai_captain_web');


app.register.controller('addAcceptGoods', function ($rootScope, $scope, $uibModal, $log, $http, $stateParams, listService, $state, domainConfig,formService) {
    var self = this;
    $scope.ownerName = '';
    $scope.isHideNewCompany = false;

    $scope.acceptGoodsBatch = {

    };
    $scope.acceptGoodsBatch.cargoRecieveBatchArr = [];
    $scope.acceptGoodsBatch.cargoRecieveBatchArr.productDtlList = [];

    $scope.init = function () {
        var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/ownerList';
        return listService.events(url).then(function (response) {
            var data = response.data;
            if (data.success) {
                $scope.ownerList = data.ownerList;
            } else {
                toastr['error']('货主信息读取失败！', '提示');
            }
        }, function (response) {
            toastr['error']('货主信息读取失败！', '提示');
        });
    };
    
    self.onSelectCallback = function(item,model){
        $scope.acceptGoodsBatch.ownerId = model;
    }

    // $scope.$watch('ownerName', function (newValue, oldValue) {
    //     var findOwner = false;
    //     angular.forEach($scope.ownerList, function (owner, index) {
    //         if (owner.ownerName === newValue) {
    //             findOwner = true;
    //             $scope.acceptGoodsBatch.ownerId = owner.id;
    //         }
    //     });
    //     if (!findOwner) {
    //         $scope.acceptGoodsBatch.ownerId = null;
    //     }
    // });

    $scope.updateOwnerId = function (model) {
        if (model) {
            $scope.acceptGoodsBatch.ownerId = model.id;
            return model.ownerName;
        }
    }

    $scope.deleteCargoRecieve = function (index) {
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
            $scope.acceptGoodsBatch.cargoRecieveBatchArr.splice(index, 1);
        }, function () {

        });
    }

    $scope.saveAcceptGoodsBatch = function (valid) {
        if (valid) {
            // if (!$scope.acceptGoodsBatch.cargoRecieveBatchArr || $scope.acceptGoodsBatch.cargoRecieveBatchArr.length == 0) {
            //     toastr['error']('请填写至少一个收货单！', '提交失败');
            //     return;
            // }
            //domainConfig.hulkDomain
            var url = domainConfig.hulkDomain + 'hulk/cargoRecieve/addCargoRecieve';
            formService.put(url,$scope.acceptGoodsBatch).success(function (data, status, headers) {
                $state.go('acceptGoodsList');
            }).error(function (data) {
                toastr['error']('提交收货单失败！', '提示');
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

    $scope.getProduct = function () {
        var url = domainConfig.scmdDomain + 'scmd/producteffect/queryAllProductCategory';
        listService.events(url).success(function (data, status, headers) {
            $rootScope.productList = data.productCategorys;

        }).error(function (data) {

        });
    }
    $scope.getProduct();

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

    $scope.states = ['Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


    $scope.openAddModal = function (size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addModal.html',
            controller: 'AddAcceptGoods',
            size: size,
            resolve: {
                getModelOrBrand: function () {
                    return $scope.getModelOrBrand;
                }
            }
        });

        modalInstance.result.then(function (form) {
            $scope.acceptGoodsBatch.cargoRecieveBatchArr.push(form);


        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    /**新增货主信息*/
    $scope.addCompany = function (size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addCompany.html',
            controller: 'addCompany',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (company) {
            console.log(company);
            var url = domainConfig.hulkDomain + 'hulk/user/addTradeComp';
            formService.put(url,company).success(function (data) {
                console.log(data);

                // $scope.isHideNewCompany = true;
                if (!data.success) {
                    toastr['error'](data.msg, '提示');
                } else {
                    $scope.init().then(function () {
                        $scope.ownerName = company.compName;
                        // $scope.acceptGoodsBatch.ownerId = data.userId;
                    });
                }
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

app.register.controller('AddAcceptGoods', function ($http, $scope, $rootScope, $uibModalInstance, domainConfig, listService, getModelOrBrand) {
    $scope.getModelOrBrand = getModelOrBrand;

    $scope.form = {
        isExactWeight: $rootScope.VERIFY_TYPE.EXACT_WEIGHT
        
    }
    $scope.form.productDtlList = [];
    $scope.addGoods = function () {
        var product = { "gzProductId": "", "gzBrandId": "", "count": "", "countUnitCode": "", "weight": "", "weightUnitCode": "吨", "cardId": "" };
        $scope.form.productDtlList.push(product);
    }

    $scope.deleteGoods = function (index) {
        $scope.form.productDtlList.splice(index, 1);
    }

    $scope.gzProductChange = function (obj, gzProduct) {
        getModelOrBrand(obj, gzProduct.id);
        obj.gzProductId = gzProduct.id;
        obj.gzProductName = gzProduct.productCategoryName;
    }

    $scope.gzModelChange = function (obj, gzModel) {
        getModelOrBrand(obj, obj.gzProductId, gzModel.id);
        obj.gzModelId = gzModel.id;
        obj.gzModelName = gzModel.modelName;
    }

    $scope.gzBrandChange = function (obj, brand) {
        obj.productId = brand.id;
        obj.brandName = brand.brandName;
    }

    $scope.cardChange = function (obj, card) {
        obj.cardId = card.id;
        obj.cardName = card.cardName;
    }

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
/***新增货主信息**/
app.register.controller('addCompany', function ($http, $scope, $uibModalInstance) {

    $scope.company = {};

    $scope.ok = function (valid) {
        if (valid) {
            $uibModalInstance.close($scope.company);
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