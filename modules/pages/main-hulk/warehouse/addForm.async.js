var app = angular.module('exingcai_captain_web');


app.register.controller('addForm', function ($scope, $uibModal, $log, $http, $stateParams, $state, listService, domainConfig,formService) {

  var pager = listService.pager;
  console.log(pager.currentPage);
  var acceptGoodsId = $stateParams.acceptGoodsId;
  $scope.dataList = [
  ];
  $scope.obj = {
    "name": "",
    "address": "",
    "province":"请选择省份",
    "city":"请选择市",
    "country":"请选择区",
    "segment":"",
    "type": 1,
    "districtCode" : "" ,
    "districtName" : "" ,
    "provinceCode": "" ,
    "provinceName": "",
    "segmentNodeCode":"" ,
    "segmentNodeName": "" ,
    "cityCode":"" ,
    "cityName": "" ,
    "contactor": "",
    "contactorPhone": "",
    "deleteFlag": "0",
    "status": "100",
    "area": "",
    "floorHeight": "",
    "capacity": "",
    "groundPress": "",
    "maxCardCount": "",
    "cardList": $scope.dataList

  };
  $scope.typeOption = [{ 'value': 1, 'name': '楼层仓' }, { 'value': 2, 'name': '平台仓' }, { 'value': 3, 'name': '高台仓' }];
   $scope.queryArea = function(method){
    var method="selectAllProvinces";
    var url = domainConfig.scmdDomain + 'scmd/area/query?method='+method;
    listService.events(url).success(function(data, status, headers){
      $scope.area=data.provinces;
     
    }).error(function(data){
      console.log("获取省份信息失败！");
          });
  }
  $scope.getCities=function(){
    var provinceID=$scope.obj.province.provinceCode;
    $scope.obj.provinceCode=$scope.obj.province.provinceCode;
    $scope.obj.provinceName=$scope.obj.province.provinceName;
    var method="selectCitysByProvinceCode";
    var url = domainConfig.scmdDomain + 'scmd/area/query?method='+method+'&provinceCode='+provinceID;
    listService.events(url).success(function(data, status, headers){
      $scope.cities=data.citys;
     
    }).error(function(data){
      console.log("获取市信息失败！");
          });
  }
   $scope.getCountries=function(){
    var cityID=$scope.obj.city.cityCode;
     $scope.obj.cityCode=$scope.obj.city.cityCode;
    $scope.obj.cityName=$scope.obj.city.cityName;
    var method="selectDistrictsByCityCode";
    //var  ={"provinceCode":x};
    var url = domainConfig.scmdDomain + 'scmd/area/query?method='+method+'&cityCode='+cityID;
    listService.events(url).success(function(data, status, headers){
      $scope.countries=data.districts;
     
    }).error(function(data){
      console.log("获取区信息失败！");
          });
  }
  $scope.getSegments=function(){
   
    var method="selectAddressByDistrictCode";
     var countryID=$scope.obj.country.countryCode;
      $scope.obj.districtCode=$scope.obj.country.districtCode;
    $scope.obj.districtName=$scope.obj.country.districtName;
    var url = domainConfig.scmdDomain + 'scmd/area/query?method='+method+'&districtCode='+countryID;
    listService.events(url).success(function(data, status, headers){
      $scope.segments=data.addresses;
     
    }).error(function(data){
      console.log("获取区信息失败！");
          });
  }
  
  $scope.areaUnit='㎡';
  $scope.floorHeightUnit='m';
  $scope.capacityUnit='T';
  $scope.groundPressUnit='N';
  $scope.maxCardCountUnit='个';
$scope.queryArea("selectAllProvinces");
  $scope.addWarehouse = function () {
    var warehouseObj = { "area": "", "cardName": "" }
    $scope.dataList.push(warehouseObj);
  }
  $scope.delete = function (index) {
    $scope.dataList.splice(index,1);
  }

  $scope.save = function (valid) {
    if($scope.obj.segment!=""){
       $scope.obj.segmentNodeCode=$scope.obj.segment.addressCode;
      $scope.obj.segmentNodeName=$scope.obj.segment.addressName;
    }
      
    if (valid) {
      var origin = angular.copy($scope.obj);
      $scope.obj.area+=$scope.areaUnit;
      $scope.obj.floorHeight+=$scope.floorHeightUnit;
      $scope.obj.capacity+=$scope.capacityUnit;
      $scope.obj.groundPress+=$scope.groundPressUnit;
      var url = domainConfig.hulkDomain + 'hulk/warehouse/addWarehouse';
      formService.put(url,$scope.obj).success(function (data, status, headers) {
        $state.go('warehouseList');
      }).error(function (data) {
        $scope.obj = origin;
        toastr['error']('保存仓库失败！', '提示');
      });
    }else{
      $scope.myForm.$setDirty();
      angular.forEach($scope.myForm.$error.required, function(field) {
          field.$setDirty();
      });
    }
  }


});
