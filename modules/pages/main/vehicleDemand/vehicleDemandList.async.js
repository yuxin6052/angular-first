var app = angular.module('exingcai_captain_web');


app.register.controller('vehicleDemandList', function($scope, $uibModal, $log, $http, $injector, listService, pagerConfig, domainConfig) {

    $scope.demandList = [];
    $scope.tabpane = 0;

    $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/vehicleDemandList";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.queryDemand = function(status) {
        if (status == '1') {
            $scope.tabpane = 1;
            $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/vehicleDemandList?status=100";

        } 
        else if (status == '2') {
            $scope.tabpane = 2;
            $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/vehicleDemandList?status=300";

        } else {
            $scope.tabpane = 0;
            $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/vehicleDemandList";
        }
        listService.events($scope.url).success(function(data, status, headers) { 
            $scope.demandList = data.vehicleDemands.dataList;
            // $scope.demandList.cargolist=[CG20160530000175,CG20160530000175,CG20160530000175];
            // $scope.demandList.cargolist = $scope.demandList.cargolist.join(','); 
            // console.log($scope.demandList.cargolist);
            angular.forEach($scope.demandList, function(obj, k) {
                var status = obj.status;
                switch (status) {
                    case 100:
                        obj.status = "未处理";
                        break;
                    case 200:
                        obj.status = "进行中";
                        break;
                    case 300:
                        obj.status = "已处理";
                        break;
                    case 302:
                        obj.status = "已派车";
                        break;
                    case 400:
                        obj.status = "已完成";
                        break;

                }
            }); 
            $scope.handledSum =  data.handled;     
            $scope.unhandledSum =  data.unhandled;
            if ($scope.firstInit) {
                $scope.totalItems = data.vehicleDemands.total;
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




    // $scope.deleteProduct = function(index) {
    //     $scope.productList.splice(index, 1);
    //     $http.put('http://192.168.20.114:9000/exingcai/captain/product/findAll' + id).success(function(data, status, headers, config) {
    //         $scope.product = data;
    //     }).error(function(data, status, headers, config) {
    //         $scope.errorMessage = "Can't del product!";
    //     });
    // };
    //queryProdoct();


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
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    //map
    $scope.showMap = function(size, vehicleDemandNo) {
        var timer = 0;
        $scope.items = vehicleDemandNo;
        console.log(vehicleDemandNo);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'showMap.html',
            controller: 'showMapCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                },
                timer: function() {
                    return timer;
                }
            }
        });

        modalInstance.result.then(function() {


        }, function(timer) {
            window.timer2 = window.clearInterval(window.timer2);
        });
    };

});

app.register.controller('showMapCtrl', function($http, $scope, $uibModalInstance, $location, $stateParams, timer, domainConfig, pagerConfig, listService, items, $timeout) {

    $scope.vehicleDemandNo = items;
    // $scope.length2;
    $scope.gpsData = [];
    $scope.fromWarehouseName = "";
    $scope.toWarehouseName = "";
    $scope.url = domainConfig.dispatchDomain + "captain/vehicleDemand/" + $scope.vehicleDemandNo + "/cargoDeliverys";

    $scope.isShow = [];
    $scope.gpsPointList = [];
    $scope.recordsstock = {};
    $scope.recordsstock.gpsRecords;
    $scope.polylineList = []; //已经行进百度路线

    $scope.currentRouteGPSList = []; //将行进路线点
    $scope.currentRoutePointList =[];
    $scope.timeStampList = [];
    $scope.cargonoList = [];
    $scope.carMarkerList = [];
    //var initStoreHouseIcon;
    //初始化地图部分
    var map;


    var initMapBase = function() {
        map = new BMap.Map("map2", { minZoom: 5, maxZoom: 18 });
        map.enableScrollWheelZoom(true);
        var point = new BMap.Point(116.404, 39.915);

        function myFun(result) {

            cityName = result.name;
            map.centerAndZoom(cityName, 11);
        }
        var myCity = new BMap.LocalCity();
        myCity.get(myFun);
    };


    listService.events($scope.url).success(function(data, status, headers) { 

        $scope.items = data.list;
        // $scope.length2 = $scope.items.length;

        for (i = 0; i < $scope.items.length; i++) {

            var pathCargoNo = $scope.items[i].cargoNo;
            $scope.cargonoList.push($scope.items[i].cargoNo);
            // var pathCargoNo = 'CG20160601000176';

            var urlPath = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo;
            $scope.isShow[i] = true;

            listService.events(urlPath, {}).success(function(data, status, headers) {
                $scope.fromWarehouseName = data.fromWarehouse.name; //
                $scope.toWarehouseName = data.toWarehouse.name; //
                $scope.gpsData.push(data);
                $scope.timeStampList.push(data.timeStamp);
                if (data.gpsRecords.length == 0) toastr['error']('' + pathCargoNo + 'gpslist为空', '提示');

                var currentRoute = data.gpsRecords.slice(data.gpsRecords.length - 3, data.gpsRecords.length);
                var currentRoutePoint =$scope.gpsArrayToPoint(currentRoute);
                $scope.currentRoutePointList.push(currentRoutePoint);
                $scope.currentRouteGPSList.push(currentRoute);
                data.gpsRecords.length = data.gpsRecords.length - 2;
                $scope.gpsPointList.push(data.gpsRecords);

                $scope.recordsstock.fromWarehouse = data.fromWarehouse;
                $scope.recordsstock.toWarehouse = data.toWarehouse;

                return $scope.recordsstock;
            });

        }
        return {

        };
    });

    $scope.init = function() {

        setTimeout(initMapBase, 1000);
        setTimeout(function() {
            initStoreHouseIcon($scope.recordsstock);
        }, 1700);
        setTimeout(function() {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.initMap($scope.gpsPointList[i]);
                console.log(i);
            }

        }, 1400);
        setTimeout(function() {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.createCarMarker(i,$scope.currentRoutePointList[i]);
                console.log(i);
            }

        },1500);


        window.timer2 = setInterval(function() {
            for (var k = 0; k < $scope.items.length; k++) {
                $scope.initRunningWay($scope.timeStampList[k], $scope.cargonoList[k], k);
                //$scope.setCarMarker(k, $scope.currentRoutePointList[k]);
                $scope.drawingRoutePolyline(k,$scope.currentRoutePointList[k]);
            }
            console.log($scope.currentRoutePointList);
        }, 60000);

    };
    $scope.init();

    $scope.togglegpsdata = function(cargoindex) {

        if ($scope.isShow[cargoindex]) {
            // $scope.polylineList[cargoindex].strokeWeight('0');
            $scope.polylineList[cargoindex].setStrokeOpacity('0');
            //strokeColor:"red", .strokeWeight();:6, strokeOpacity:0.5,
            $scope.isShow[cargoindex] = false;
        } else {
            $scope.isShow[cargoindex] = true;
            $scope.polylineList[cargoindex].setStrokeOpacity('0.5');
            //$scope.showlist = $scope.gpsPointList[cargoindex];
            // $scope.recordsstock.gpsRecords = $scope.showlist;
            //$scope.initMap($scope.showlist);

        }
        // console.log($scope.currentRoutePointList);
        console.log($scope.gpsPointList);
        console.log($scope.timeStampList);
    };

    $scope.getchecked = function(index) {
        return $scope.isShow[index];
    };

    $scope.gpsArrayToPoint = function(array) {
        var arraylength = array.length;
        var gpsPoint = [];
        for (var i = 0; i < arraylength; i++) {

            var point = new BMap.Point(array[i].longitude, array[i].latitude);
            gpsPoint.push(point);
        }
        return gpsPoint;
    };

    //huizhi
    function initStoreHouseIcon(records) {
        //$scope.recordsstock
        var fromWarehouseData = records.fromWarehouse;
        var toWarehouseData = records.toWarehouse;

        if (fromWarehouseData != null && toWarehouseData != null) {
            //起点
            //var startPoint = gpsPoint[0];
            var startPoint = new BMap.Point(fromWarehouseData.longitude, fromWarehouseData.latitude);

            //var iconStart = new BMap.Icon('http://127.0.0.1:8080/statics/lib/images/markerStart.png', new BMap.Size(122, 122));
            var iconStart = new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOd16ljJ3BAAA7rnl42F0615.png', new BMap.Size(24, 24));
            //var iconStart = new BMap.Icon('http://' + $location.host() + ':' + $location.port() + '/statics/lib/images/markerStart.png', new BMap.Size(24, 24));

            var markerStart = new BMap.Marker(startPoint, { icon: iconStart });
            map.addOverlay(markerStart);
            // content = getInfoContent();

            // markerStart.addEventListener("click", function() {
            //     infoWindow = new BMap.InfoWindow(content, opts);
            //     this.openInfoWindow(infoWindow);

            // });
            var startLabel = new BMap.Label("出发仓库", { position: startPoint, offset: new BMap.Size(-24, 14) }); //定义一个文字标签，注意1.2请用position
            map.addOverlay(startLabel);
            startLabel.setStyle({
                "color": "#666",
                "background-color": "#fff",
                "font-family": "Arial"
            });

            //终点
            //var endPoint = gpsPoint[gpsPoint.length - 1];
            var endPoint = new BMap.Point(toWarehouseData.longitude, toWarehouseData.latitude);
            //var markerEnd = new BMap.Marker(endPoint);
            var iconEnd = new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOd2eu5IiGAAA7ZktH5qo010.png', new BMap.Size(24, 24));
            //var iconEnd = new BMap.Icon('http://' + $location.host() + ':' + $location.port() + '/statics/lib/images/markerEnd.png', new BMap.Size(24, 24));
            var markerEnd = new BMap.Marker(endPoint, { icon: iconEnd });
            map.addOverlay(markerEnd);
            //markerEnd.setAnimation(BMAP_ANIMATION_BOUNCE); 
            var endLabel = new BMap.Label("收货仓库", { position: endPoint, offset: new BMap.Size(-24, 14) }); //定义一个文字标签，注意1.2请用position
            map.addOverlay(endLabel);
            endLabel.setStyle({
                "color": "#666",
                "background-color": "#fff",
                "font-family": "Arial"
            });


            var centerViewpoints = [
                startPoint,
                endPoint
            ];
            map.setViewport(centerViewpoints);

        } else {
            toastr['error']('ERROR fromWarehouseData && toWarehouseData', '提示');
        }

    }

    $scope.initMap = function(records) {
        console.log(records);
        //起点
        opts = { offset: new BMap.Size(0, -10) };

        // var allRecords = records.gpsRecords;
        var allRecords = records;
        var allRecordsLength = allRecords.length;
        var gpsRecords = [];
        var gpsPoint = [];

        //起点和终点

        function xYgps(x, y) //声明对象
        {
            this.x = x;
            this.y = y;
        }

        function getInfoContent(name, count, telephone, address, faceimg) {
            return '<div class="infoWc_inner"></div>';
        }

        for (var i = 0; i < allRecordsLength; i++) {
            gpsRecords.push(new xYgps(allRecords[i].longitude, allRecords[i].latitude));
            var point = new BMap.Point(allRecords[i].longitude, allRecords[i].latitude);
            gpsPoint.push(point);
        }

        if (allRecordsLength != 0) {

            // var carPoint = gpsPoint[gpsPoint.length - 1];
            // var iconCar = new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOdt3xF49yAAA_x_VP6U8334.png', new BMap.Size(24, 24));
            // var markerCar = new BMap.Marker(carPoint, { icon: iconCar });
            // map.addOverlay(markerCar);
            //console.log(gpsPoint);

            var polyline = new BMap.Polyline(gpsPoint, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5 }); //创建折线
            $scope.polylineList.push(polyline);
            map.addOverlay(polyline);
            //map.centerAndZoom(carPoint, 18);
            //map.setViewport(gpsPoint);

            var lushu = new BMapLib.LuShu(map, gpsPoint, {
                defaultContent: "铜线坯-26mm-20吨", //"从天安门到百度大厦"
                autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                //icon: new BMap.Icon('http://' + $location.host() + ':' + $location.port() + '/statics/lib/images/markerCar.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
                icon: new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOdt3xF49yAAA_x_VP6U8334.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
                speed: 500,
                enableRotation: false, //是否设置marker随着道路的走向进行旋转
                landmarkPois: [
                    // { lng: 116.314782, lat: 39.913508, html: '加油站', pauseTime: 2 },
                    // { lng: 116.315391, lat: 39.964429, html: '高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>', pauseTime: 3 },
                    // { lng: 116.381476, lat: 39.974073, html: '肯德基早餐<div><img src="http://ishouji.baidu.com/resource/images/map/show_pic04.gif"/></div>', pauseTime: 2 }
                ]
            });

            map.addEventListener("click", startlushu); //给地图注册点击事件

            function startlushu() {
                //lushu.start(); //启动路书函数
            }

        } else {
            toastr['error']('ERROR GPSLIST', '提示');
        }

    };

    $scope.initRunningWay = function(timeStamp, cargoNo, index) {
        //$scope.timeStampList[index] 
        //time set
        var startDate = Number(timeStamp);
        var endDate = 60000 + Number(timeStamp);
        console.log(startDate,endDate);
        console.log($scope.currentRoutePointList[index]);
        $scope.timeStampList[index] = Number(endDate);
        var pathCargoNo = cargoNo;
        var urlPath = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo + '?startDate=' + startDate + '&endDate=' + endDate;

        listService.events(urlPath, {}).success(function(data, status, headers) {
            console.log(data);

            if (data.gpsRecords.length == 0) console(startDate+'~'+endDate+'时间段无点或接口异常');
            var addRoute = data.gpsRecords.slice(data.gpsRecords.length - 3, data.gpsRecords.length);
            var addRoutePoint = $scope.gpsArrayToPoint(data.gpsRecords);
            $scope.currentRoutePointList[index]= $scope.currentRoutePointList[index].concat(addRoutePoint);
            // var currentRoute = data.gpsRecords.slice(data.gpsRecords.length - 3, data.gpsRecords.length);
            // $scope.currentRoutePointList.push(currentRoute);
            // data.gpsRecords.length = data.gpsRecords.length - 3;
            // $scope.gpsPointList.push(data.gpsRecords);

            // $scope.recordsstock.fromWarehouse = data.fromWarehouse;
            // $scope.recordsstock.toWarehouse = data.toWarehouse;

        });
    };


    $scope.createCarMarker = function(index,array) {
        // var carPoint = array[0];lat
        var carPoint =new BMap.Point(113.5030276426,23.1144205343);
        // var carPoint = array[0];
        var iconCar = new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOdt3xF49yAAA_x_VP6U8334.png', new BMap.Size(24, 24));
        var markerCar = new BMap.Marker(carPoint, { icon: iconCar });
        $scope.carMarkerList.push(markerCar);
        map.addOverlay(markerCar);
    };
    $scope.setCarMarker = function(index,array) {

        var arrayEx =array;
        var point = arrayEx.pop();
       $scope.carMarkerList[index].setPosition(point);
    };

    $scope.drawingRoutePolyline =function(index,array){
        var Routepoint = array ;
        var polyline = new BMap.Polyline(Routepoint , { strokeColor: "red", strokeWeight: 10, strokeOpacity: 0.5 }); //创建折线
            //$scope.polylineList.push(polyline);
            map.addOverlay(polyline);
    };
    //$scope.initMap($scope.gpsData[0]);
    //$scope.isShow[0] = true;
});
