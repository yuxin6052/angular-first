var app = angular.module('exingcai_captain_web');

app.register.controller('WarehouseDtCtrl',function($scope, $uibModal, $log, $http, $stateParams, listService,domainConfig){
  
  $scope.warehouseList = [];
  
  $scope.pagination = {
    totalItems:0,
    maxSize:5,
    currentPage:1,
    pageSize:10
  }
    
  $scope.init = function(){
    $scope.queryWarehouseList();
  }
  var id=$stateParams.warehouseId;
  
  $scope.queryWarehouseList = function(){
   
    var url = domainConfig.hulkDomain + 'hulk/warehouse/'+id;
    listService.events(url).success(function(data, status, headers){
      $scope.obj=data.warehouse;
      $scope.cardList=data.cardList;
    }).error(function(data){
      $scope.warehouseList = [{
        name:'a',
        address:'xxx'
      }];
    });
  }
  
  $scope.pageChanged = function(){
    $log.log('Page changed to: ' + $scope.pagination.currentPage);
    //reloaddata
    $scope.queryDliveryBatchList($scope.queryStatus);
  }
  
  $scope.setPage = function(pageNo){
    $scope.pagination.currentPage = pageNo;
    //reload data
  }
    
});