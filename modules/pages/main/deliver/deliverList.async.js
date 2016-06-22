var app = angular.module('exingcai_captain_web');


app.register.controller('DeliverList', function($scope, $uibModal, $log, $http, $injector, listService, pagerConfig, domainConfig) {
    console.log("aa");
    $scope.deliverList = [];
    $scope.tabpane = 0;

    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;
    $scope.allSize=0;
    $scope.delivering=0;
    $scope.prepare=0;
    $scope.complete=0;

    $scope.queryDeliver = function(status) {
        $scope.queryStatus = status;
        var url = domainConfig.dispatchDomain + "captain/cargoDeliver/cargoDeliverInfos?status="+status;

        listService.events(url).success(function(data, status, headers) { 
            $scope.allSize=data.allSize;
            $scope.delivering=data.deliveryingSize;
            $scope.prepare=data.tobeReceiveSize;
            $scope.complete=data.completeSize;
            $scope.deliverList = data.cargoDeliveryList.dataList;  
            console.log($scope.deliverList);
            angular.forEach($scope.deliverList, function(obj, k) {
                var status = obj.status;
                switch (status) {
                    case 300:
                        obj.status = "送货中";
                        break;
                    case 310:
                        obj.status = "已送达";
                        break;
                    case 320:
                        obj.status = "待收货";
                        break;
                    case 309:
                        obj.status = "待收货";
                        break;

                }
            });       

            if ($scope.firstInit) {
                $scope.totalItems = $scope.deliverList.length;
                $scope.firstInit = false;
            }
        });
    };

    $scope.init = function() {
        $scope.queryDeliver(0);
    };


    // $scope.queryProdoct=function(){
    //  $http.get('http://localhost:9000/exingcai/captain/product/findAll').success(function (data, status, headers, config) {
    //        $scope.productList = data.data;
    //        $scope.totalItems=data.data.length;

    //  $scope.currentPage = 1;
    //  $scope.maxSize = 5;
    //    }).error(function (data, status, headers, config) {
    //        $scope.errorMessage = "Can't retrieve cualuser list!";
    //    });

    // };


    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log("pageChanged");
        $scope.queryDeliver();

    };

    $scope.changeDeliverStatus = function(id,completeCert) {
        if(completeCert==null) return toastr['error']('修改失败！', '未上传凭证');
        $http({
            method: 'put',
            url: domainConfig.dispatchDomain + 'captain/cargoDeliver/modifyCargoDeliverInfo',
            params: { id: id },
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            console.log(data);
            if (!data.success) {
                popMsg('修改失败！');
            } else {
                $scope.queryDeliver(0);
                popMsg('修改成功！');
                window.location.reload();
            }
        }).error(function(data, status, headers, config) {
            popMsg('修改失败！');
        });
    };

    function popMsg(msg) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'messageModal.html',
            controller: 'MessageCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return {
                        msg: msg
                    };
                }
            }
        });
    }

    $scope.popTrailModal = function(cargoNo) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'trailModal.html',
            controller: 'trailModalCtrl',
            size: 'sm',
            resolve: {
                cargoNo: function() {
                    return cargoNo;
                }
            }
        });
    }

});

app.register.controller('trailModalCtrl', function($http, $scope, $uibModalInstance, domainConfig, listService, cargoNo) {
    $scope.initMap = function() {
        var url = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverGpsRecord?cargoNo=' + cargoNo;
        listService.events(url).success(function(data, status, headers) {
            var gpsRecords = data.gpsRecords;
            if (gpsRecords.length == 0) {
                return;
            }
            var start;
            if (gpsRecords.length > 1) {
                start = gpsRecords[gpsRecords.length - 1];
            }
            var end = gpsRecords[0];
            var p1 = new BMap.Point(start.longitude, start.latitude);
            var p2 = new BMap.Point(end.longitude, end.latitude);
            /*var p1 = new BMap.Point(116.301934,39.977552);
            var p2 = new BMap.Point(116.508328,39.919141);*/
            var map = new BMap.Map("trailMap");
            var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true } });
            driving.search(p1, p2);
            map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
        });
    }

    $scope.close = function() {
        $uibModalInstance.dismiss();
    };
})
