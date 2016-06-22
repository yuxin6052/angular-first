var app = angular.module('exingcai_captain_web');


app.register.controller('EditTransportAgreeCtrl', function ($rootScope, $scope, $uibModal, $log, $http, $stateParams,Upload, listService, domainConfig) {
  $scope.agreementId = $stateParams.agreementId;
  $scope.newAgreement = {};
  $scope.chargeList = [];
  

  $scope.init = function () {
    if ($scope.agreementId) {
      $scope.queryAgreement();
    }
  }
  
  $scope.queryAgreement = function (){
    
  }
  
  $scope.uploadFiles = function (file) {
    if (file) {
      $scope.newAgreement.fileName = file.name;
      if (file) {
        Upload.upload({
          url: domainConfig.hulkDomain + 'hulk/utility/fileUpload',
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

  $scope.addCharge = function(){
    $scope.chargeList.push({});
  }
  
  $scope.deleteCharge = function(index){
    $scope.chargeList.splice(index,1);
  }
  
  $scope.saveAgreement = function(){
    
  }
  
});
