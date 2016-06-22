var app = angular.module('exingcai_captain_web');


app.register.controller('vehicleDispatchList', function($scope, $uibModal, $log, $http, $injector, listService, pagerConfig,domainConfig) {
   
    $scope.vehicleDispatchList = [];
    $scope.queryStatus=800;

    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;
    $scope.unhandled=0;
    $scope.underView=0;
    $scope.dispatching=0;
    $scope.loading=0;
    $scope.completed=0;

    $scope.query = function(queryStatus) {
        var url = domainConfig.dispatchDomain + "captain/cargo/vehicleDispatch/vehicleDemandDispatchList?status="+queryStatus;
        $scope.queryStatus = queryStatus;
        listService.events(url).success(function(data, status, headers) {           
            $scope.vehicleDemandList = data.vehiceDemandDispatchList.dataList;
            $scope.unhandled=data.unhandled;
            $scope.underView=data.underView;
            $scope.dispatching=data.dispatching;
            $scope.loading=data.loading;
            $scope.completed=data.completed;
            angular.forEach($scope.vehicleDemandList , function(demand, k){
                angular.forEach(demand.vehicleDispatchList , function(dispatch, k){
                    dispatch.showTransfer=false;
                    if(demand.standard=="N"&&dispatch.status==840){
                        dispatch.showTransfer=true;
                    }
                    dispatch.expanded = false;
                }); 
            }); 

            if ($scope.firstInit) {
                $scope.totalItems = data.vehiceDemandDispatchList.total;
                $scope.firstInit = false;
            }      
        });
    };
    $scope.query('810');

    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log("pageChanged");
        $scope.query('810');

    };
    $scope.selectDriver=function(driverId,dispatch){
        var selectDriverURL=domainConfig.dispatchDomain + "captain/cargo/vehicleDispatch/driverSelect?vehicleDispatchId="+dispatch.id+"&driverId="+driverId;
        $http({
          method  : 'put',
          url     : selectDriverURL,
          data    : {} // set the headers so angular passing info as form data (not request payload)
      }).success(function(data) {
          console.log(data);

          if (!data.success) {
            toastr['error']('操作失败', data.msg);
          } else {
            toastr['success']('操作成功', '提示');
            dispatch.driverId=driverId;
            $scope.toggleEditing();
          }
      }).error(function(data, status, headers, config) {
          console.log(data);
      });
    }
    $scope.verify=function(dispatch){
        var verifyURL=domainConfig.dispatchDomain + "captain/cargo/vehicleDispatch/verify/"+dispatch.dispatchNo;
        $http({
          method  : 'put',
          url     : verifyURL,
          data    : {} // set the headers so angular passing info as form data (not request payload)
      }).success(function(data) {
          console.log(data);

          if (!data.success) {
            toastr['error']('操作失败', data.msg);
          } else {
            dispatch.status=820;
            toastr['success']('操作成功', '提示');
            $scope.query('820');
          }
      }).error(function(data, status, headers, config) {
          console.log(data);
      });
    }
    $scope.dispatchComplete=function(dispatch){
        var verifyURL=domainConfig.dispatchDomain + "captain/cargo/vehicleDispatch/fakeComplete/"+dispatch.dispatchNo;
        $http({
          method  : 'put',
          url     : verifyURL,
          data    : {} // set the headers so angular passing info as form data (not request payload)
      }).success(function(data) {
          console.log(data);

          if (!data.success) {
            toastr['error']('操作失败', data.msg);
          } else {
            dispatch.status=820;
            toastr['success']('操作成功', '提示');
            $scope.query('840');
          }
      }).error(function(data, status, headers, config) {
          console.log(data);
      });
    }




});






