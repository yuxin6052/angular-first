var app = angular.module('exingcai_captain_web');


app.register.controller('EditWarehouseAgreeCtrl', function ($timeout, $rootScope, $scope, $uibModal, $log, $http, $stateParams, listService, Upload, domainConfig, formService, $state) {
  var self = this;
  self.owner={};
  $scope.agreementId = $stateParams.agreementId;
  $scope.newAgreement = {};
  $scope.init = function () {
    if ($scope.agreementId) {
      $scope.queryAgreement();
    }
  }

  $scope.queryAgreement = function () {
    var url = domainConfig.jarvisDomain + 'jarvis/agreement/storage/queryStorageAgreement?agreementId=' + $scope.agreementId;
    listService.events(url).success(function (data, status, headers) {
      $scope.newAgreement = data.storageAgreementAddVo;
      self.owner.compAddress = $scope.newAgreement.tradeCompanyAddress;
          //self.owner.userCompanyId = $scope.newAgreement.tradeCompanyId;
          self.owner.compName = $scope.newAgreement.tradeCompanyName;
          self.owner.compContact= $scope.newAgreement.tradeCompanyContact;
          self.owner.compPhone =$scope.newAgreement.tradeCompanyPhone;
      $scope.newAgreement.agreementId = $scope.agreementId;
    }).error(function (data) {

    });
  }
  $scope.getOwnerList=function(){
    var url=domainConfig.witchDomain+"witch/userCompany/companyNameByLikeCompName?isAgreement=0";
    listService.events(url).success(function (data, status, headers) {
        if (data.success) {
         $scope.ownerList=data.userCompanyVos;
         
        } else {
          toastr['error'](data.msg, 提示);
        }
      }).error(function (data) {
        toastr['error']('公司不存在', 提示);
      });
  }
  $scope.getOwnerList();

  $scope.tradeCompanyChange = function (loginName) {
    if (!$scope.agreementId) {
      var url = domainConfig.witchDomain + 'witch/userCompany/companyName/' + loginName;
      listService.events(url).success(function (data, status, headers) {
        if (data.success) {
          self.owner.compAddress = data.compAddress;
          self.owner.userCompanyId = data.userCompanyId;
          self.owner.compContact= data.compContact;
          self.owner.compPhone = data.compPhone;

          // $scope.newAgreement.tradeCompanyAddress = data.compAddress;
          // $scope.newAgreement.tradeCompanyId = data.userCompanyId;
          // $scope.newAgreement.tradeCompanyContact = data.compContact;
          // $scope.newAgreement.tradeCompanyPhone = data.compPhone;

         
        } else {
          toastr['error'](data.msg, 提示);
        }
      }).error(function (data) {
        toastr['error']('公司不存在', 提示);
      });
    }
  }

  $scope.popDropdown = function ($event) {
    var list = $event.currentTarget.parentElement.getElementsByTagName('ul')[0];
    var span = $event.currentTarget.parentElement.getElementsByTagName('span')[0];
    if (list.classList.contains('ng-hide')) {
      $timeout(function () {
        span.click();
      });
    }
  }

  $scope.uploadFiles = function (file) {
    if (file) {
      $scope.newAgreement.fileName = file.name;
      if (file) {
        Upload.upload({
          url: 'http://localhost:9030/hulk/utility/fileUpload',
          params: { 'name': file.name, 'type': file.type },
          data: {
            file: file
          }
        }).then(function (response) {
          if (response.data.success) {
            $scope.newAgreement.filePath = response.data.filePath;
          } else {
            toastr['error'](response.data.msg, '提示');
          }
        }, function (response) {
          toastr['error']('上传文件失败', '提示');
        });
      }
    }
  }

  $scope.saveAgreement = function () {
          $scope.newAgreement.tradeCompanyAddress = self.owner.compAddress;
          $scope.newAgreement.tradeCompanyId = self.owner.userCompanyId;
          $scope.newAgreement.tradeCompanyContact = self.owner.compContact;
          $scope.newAgreement.tradeCompanyPhone = self.owner.compPhone;

    var url;
    if ($scope.agreementId) {
      url = domainConfig.jarvisDomain + 'jarvis/agreement/storage/storageAMModify';
    } else {
      url = domainConfig.jarvisDomain + 'jarvis/agreement/storage/storageAMadd';
    }

    formService.put(url, $scope.newAgreement).success(function (data, status, headers) {
      if (data.success) {
        $state.go('agreementList');
      } else {
        toastr['error'](data.msg, '提交协议失败');
      }
    }).error(function (data) {
      toastr['error']('提交协议失败', '提示');
    });
  }

});
