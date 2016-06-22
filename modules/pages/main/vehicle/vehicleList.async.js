var app = angular.module('exingcai_captain_web');


app.register.controller('vehicleList', function($scope, $uibModal, $log, $http, listService, pagerConfig,domainConfig,$filter) {
    console.log("aa");
    $scope.vehicleList = [];
   
    $scope.url =domainConfig.dispatchDomain+ "captain/deliveryTool/deliverToolFullInfos";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.queryDemand = function(status) {
       
            listService.events($scope.url).success(function(data, status, headers) { 
            $scope.vehicleList = data.deliveryToolFull.dataList; 
             
            // angular.forEach($scope.demandList , function(obj, k){
            //     var status=obj.status;
            //      switch(status){
            //         case 100:obj.status="未处理"; break;
            //         case 200:obj.status="进行中";break;
            //         case 300:obj.status="已关闭"; break;
            //         case 400:obj.status="已完成"; break;
                   
            //      }
            // });       
            
            if ($scope.firstInit) {
                $scope.totalItems = data.deliveryToolFull.total;
                $scope.firstInit = false;
            }


                    
        });
        

    };
    $scope.queryDemand();

    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log("pageChanged");
        $scope.queryProdoct();

    };

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function(size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function() {
                }
            }
        });

        modalInstance.result.then(function(requestObj) {
            
            $http({
                method  : 'post',
                url     : domainConfig.dispatchDomain+'captain/deliveryTool/deliverToolNew',
                data    : JSON.stringify(requestObj),  // pass in data as strings
                headers : { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);
                if (!data.success) {
                } else {
                    $scope.queryDemand();
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
    
    $scope.changeStatus = function(vehicle,newStatus){
        var originalStatus = vehicle.status;
        var newStatusStr = $filter('vehicleStatus')(newStatus);
        var msg = '是否确认'+newStatusStr+'车辆 '+ vehicle.toolNo+' ?';
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            controller: 'MessageCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return {
                        msg:msg
                    };
                }
            }
        });
        modalInstance.result.then(function() {
            vehicle.status = newStatus;
            var requestObj = {deliveryTool:vehicle,gpsId:Number(vehicle.gpsId)};
            $http({
                method  : 'put',
                url     : domainConfig.dispatchDomain+'captain/deliveryTool/deliverToolInfoModify',
                data    : JSON.stringify(requestObj),  // pass in data as strings
                headers : { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                if (!data.success) {
                    vehicle.status = originalStatus;
                    toastr['error'](data.msg,'提示');
                } else {
                    toastr['success'](newStatusStr+'成功！','提示');
                }
            }).error(function(data, status, headers, config) {
                vehicle.status = originalStatus;
                toastr['error'](newStatusStr+'失败！','提示');
            });
        }, function() {
            
        });
    }
    
    $scope.deleteVehicle = function(vehicle){
        vehicle.deleteFlag = 1;
        var requestObj = {deliveryTool:vehicle,gpsId:Number(vehicle.gpsId)};
        $http({
            method  : 'put',
            url     : domainConfig.dispatchDomain + 'captain/deliveryTool/deliverToolInfoModify',
            data    : JSON.stringify(requestObj),  // pass in data as strings
            headers : { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            if (!data.success) {
                toastr['error']('删除失败！','提示');
            } else {
                toastr['success']('删除成功！','提示');
                $scope.queryDemand();
            }
        }).error(function(data, status, headers, config) {
            console.log(data);
            toastr['error']('删除失败！','提示');
        });
    }
    
});
app.register.controller('ModalInstanceCtrl', function($http, $scope, $uibModalInstance,listService,pagerConfig,domainConfig,items) {
    $scope.vehicle = {
    };
    $scope.driverUrl = domainConfig.witchDomain+"witch/driver/queryDriverInfoListForPage";

    $scope.querydriver = function() {
       
      listService.events($scope.driverUrl).success(function(data, status, headers) { 
    
        $scope.driverList = data.pageInfoRespDTOs.datas; 
 
            
            if ($scope.firstInit) {
                $scope.totalItems = data.pageInfoRespDTOs.total;
                $scope.firstInit = false;
            }
      }).error(function(){
        console.log("出错了！");
      });
    };
    $scope.querydriver();
     $scope.gspurl = domainConfig.dispatchDomain+"captain/gps/gpsDeviceInfos";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.queryGPS = function(status) {
       
            listService.events($scope.gspurl).success(function(data, status, headers) { 
            $scope.GPSList = data.gpsDeviceInfos.dataList; 
             
            $scope.totalItems = $scope.GPSList.length;
                    
        });
        

    };
    $scope.queryGPS();

    $scope.isBind=false;
    $scope.bindgps= '-1';

    $scope.bindgps=function(gpsID){
        $scope.bindgps=gpsID;
        $scope.isBind=false;
        //将gpsid赋给form对象
       
    }
    $scope.unbindgps=function(vehicleId){
        $scope.bindgps='-1';
        $scope.isBind=true;
       // $scope.newGPS.bindDeliveryToolId="";
       
    }

    $scope.ok = function() {
        if($scope.bindgps!=='-1'){
           var requestObj = {deliveryTool:$scope.vehicle,gpsId:Number($scope.bindgps)};
           $uibModalInstance.close(requestObj);
        }else{
            var requestObj = {deliveryTool:$scope.vehicle,gpsId:0};
            $uibModalInstance.close(requestObj);
        }
        
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});