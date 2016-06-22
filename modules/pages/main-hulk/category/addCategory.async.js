var app = angular.module('exingcai_captain_web');
var secretEmptyKey = '[$empty$]';
app.register.controller('AddCategoryCtrl', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig, $state, formService) {
  $scope.newProductCategory = {};
  $scope.newModelBrand = {};
  $scope.type = 1;
  
  $scope.init = function () {
    $scope.queryAllCategory();
  }

  $scope.queryAllCategory = function () {
    var url = domainConfig.scmdDomain + 'scmd/addProduct/queryAllCategory';
    listService.events(url).success(function (data, status, headers) {
      if (data.success) {
        $scope.categoryList = data.categoryVos;
      } else {
        toastr['error'](data.msg, '品类信息读取失败');
      }
    }).error(function (data) {
      toastr['error']('品类信息读取失败！', '提示');
    });
  }

  $scope.changeCategory = function (categoryId) {
    if (categoryId) {
      var url = domainConfig.scmdDomain + 'scmd/addProduct/queryProductCategoryByCategoryId?categoryId=' + categoryId;
      listService.events(url).success(function (data, status, headers) {
        if (data.success) {
          $scope.productCategoryList = data.productCategorys;
        } else {
          toastr['error'](data.msg, '品名信息读取失败');
        }
      }).error(function (data) {
        toastr['error']('品名信息读取失败！', '提示');
      });
    }
  }

  $scope.modelBrandProductChange = function (product) {
    if(product){
      $scope.newModelBrand.productCategoryId = product.id;
      $scope.newModelBrand.productCategoryCode = product.productCategoryCode;
      $scope.newModelBrand.productCategoryName = product.productCategoryName;
    }
  }

  $scope.addProductCategory = function (valid) {
    if (valid) {
      var url = domainConfig.scmdDomain + 'scmd/addProduct/addProductCategory';
      formService.post(url,null,$scope.newProductCategory).success(function (data, status, headers) {
        if (data.success) {
          toastr['success']('添加成功', '提示');
          $scope.changeCategory($scope.newModelBrand.categoryId);
        } else {
          toastr['error'](data.msg, '添加品名失败');
        }
      }).error(function (data) {
        toastr['error']('添加品名失败', '提示');
      });
    } else {
      angular.forEach($scope.myForm1.$error, function (field) {
        angular.forEach(field, function (errorField) {
          errorField.$setTouched();
          errorField.$setDirty();
        })
      });
    }
  }
  
  $scope.addModelBrand = function(valid){
    if(valid){
      var url;
      if($scope.type=='1'){
        url = domainConfig.scmdDomain + 'scmd/addProduct/addProductInfoByModel';
      }else{
        url = domainConfig.scmdDomain + 'scmd/addProduct/addProductInfoByBrand';
      }
      formService.post(url,null,$scope.newModelBrand).success(function (data, status, headers) {
        if (data.success) {
          toastr['success']('添加成功', '提示');
        } else {
          toastr['error'](data.msg, '添加规格/品牌失败');
        }
      }).error(function (data) {
        toastr['error']('添加规格/品牌失败', '提示');
      });
    }else{
      angular.forEach($scope.myForm2.$error, function (field) {
        angular.forEach(field, function (errorField) {
          errorField.$setTouched();
          errorField.$setDirty();
        })
      });
    }
  }

});

