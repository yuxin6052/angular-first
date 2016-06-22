var app = angular.module('exingcai_captain_web');


app.register.controller('DeliverDt', function($scope, $uibModal, $log, $http, $stateParams, $location, listService, pagerConfig, domainConfig) {


    // initMap();

    $scope.deliverInfo = {};
    $scope.deliveryId = $stateParams.deliveryId;
    $scope.products = [];
    $scope.gpsData = {};

    $scope.imgurl = "";
    $scope.imgBaseurl = domainConfig.imgDomain;

    function initData() {
        var url = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverDtlInfos/' + $scope.deliveryId;
        listService.events(url, {}).success(function(data, status, headers) {
            // angular.copy(data.gpsDeviceInfo, $scope.gpsEditInfo);
            $scope.delivery = data.delivery;
            console.log(data.completeCert);
            if ($scope.delivery.completeCert != null) $('#filepicker1').hide();
            //initMap(data.gpsRecords);
            var pathCargoNo = $scope.delivery.cargoNo;
            console.log(pathCargoNo);
            //var pathCargoNo = "CARGO20160511161";
            var urlPath = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo;
            //var urlPath = 'http://192.168.20.61:9000/captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo;
            listService.events(urlPath, {}).success(function(data, status, headers) {
                console.log(data);
                initMap(data);
                $scope.gpsData = data;
            });
        });

    }

    function initMap(records) {
        //http://127.0.0.1:8080/#/deliverDt/23
        // map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        // map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
        var map = new BMap.Map("map", { minZoom: 5, maxZoom: 18 });
        map.enableScrollWheelZoom(true);

        //起点
        opts = { offset: new BMap.Size(0, -10) };


        //gps data
        var allRecords = records.gpsRecords;
        var allRecordsLength = allRecords.length;
        var gpsRecords = [];
        var gpsPoint = [];

        //起点和终点
        var fromWarehouseData = records.fromWarehouse;
        var toWarehouseData = records.toWarehouse;
        console.log(records);

        function xYgps(x, y) //声明对象
        {
            this.x = x;
            this.y = y;
        }

        function getInfoContent(name, count, telephone, address, faceimg) {
            return '<div class="infoWc_inner"></div>';
        }

        for (i = 0; i < allRecordsLength; i++) {
            gpsRecords.push(new xYgps(allRecords[i].longitude, allRecords[i].latitude));
            var point = new BMap.Point(allRecords[i].longitude, allRecords[i].latitude);
            gpsPoint.push(point);
        }


        if (fromWarehouseData != null && toWarehouseData != null) {
            //起点
            //var startPoint = gpsPoint[0];
            var startPoint = new BMap.Point(fromWarehouseData.longitude, fromWarehouseData.latitude);

            //var iconStart = new BMap.Icon('http://127.0.0.1:8080/statics/lib/images/markerStart.png', new BMap.Size(122, 122));
            var iconStart = new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOd16ljJ3BAAA7rnl42F0615.png', new BMap.Size(24, 24));
            //var iconStart = new BMap.Icon('http://' + $location.host() + ':' + $location.port() + '/statics/lib/images/markerStart.png', new BMap.Size(24, 24));

            var markerStart = new BMap.Marker(startPoint, { icon: iconStart });
            map.addOverlay(markerStart);
            content = getInfoContent();
            //var markerStart = new BMap.Marker(startPoint); // 创建标注
            //map.addOverlay(markerStart); // 将标注添加到地图中
            markerStart.addEventListener("click", function() {
                infoWindow = new BMap.InfoWindow(content, opts);
                this.openInfoWindow(infoWindow);

            });
            var startLabel = new BMap.Label("出发仓库", { position: startPoint, offset: new BMap.Size(-24, 14) }); //定义一个文字标签，注意1.2请用position
            map.addOverlay(startLabel);
            startLabel.setStyle({
                "color": "#666",
                "background-color": "#fff",
                "font-family": "Arial"
            });
            //markerStart.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            //markerStart.openInfoWindow(new BMap.InfoWindow(content, opts));

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

            //中心视距生成
            var centerX = (fromWarehouseData.longitude + toWarehouseData.longitude) / 2;
            var centerY = (fromWarehouseData.latitude + toWarehouseData.latitude) / 2;
            var pointCenter = new BMap.Point(centerX, centerY);
            map.centerAndZoom(pointCenter, 18);

            //
            var centerViewpoints = [
                startPoint,
                endPoint
            ];
            map.setViewport(centerViewpoints);

        } else {
            console.log('ERROR fromWarehouseData && toWarehouseData');
        }

        if (allRecordsLength != 0) {
            //车
            var carPoint = gpsPoint[gpsPoint.length - 1];
            var iconCar = new BMap.Icon('http://' + $location.host() + ':' + $location.port() + '/statics/lib/images/markerCar.png', new BMap.Size(24, 24));
            var markerCar = new BMap.Marker(carPoint, { icon: iconCar });
            //var markerCar = new BMap.Marker(carPoint);
            //map.addOverlay(markerCar);
            console.log(gpsPoint);
            //markerCar.setAnimation(BMAP_ANIMATION_BOUNCE);
            //画行径轨迹
            var polyline = new BMap.Polyline(gpsPoint, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5 }); //创建折线
            map.addOverlay(polyline);
            map.centerAndZoom(carPoint, 18);
            map.setViewport(gpsPoint);

            //运动轨迹
            //
            //
            // var BMapLib;
            // if(BMapLib){
            //    BMapLib = window.BMapLib = BMapLib;
            // } else {
            //    BMapLib = window.BMapLib = BMapLib = {};
            // }
            //http://120.55.163.90/group1/M00/00/07/eDejWldOdt3xF49yAAA_x_VP6U8334.png
            var lushu = new BMapLib.LuShu(map, gpsPoint, {
                defaultContent: "铜线坯-26mm-20吨", //"从天安门到百度大厦"
                autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                //icon: new BMap.Icon('http://' + $location.host() + ':' + $location.port() + '/statics/lib/images/markerCar.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
                icon: new BMap.Icon('http://120.55.163.90/group1/M00/00/07/eDejWldOdt3xF49yAAA_x_VP6U8334.png', new BMap.Size(52, 26), { anchor: new BMap.Size(27, 13) }),
                speed: 4500,
                enableRotation: false ,//是否设置marker随着道路的走向进行旋转
                landmarkPois: [
                    // { lng: 116.314782, lat: 39.913508, html: '加油站', pauseTime: 2 },
                    // { lng: 116.315391, lat: 39.964429, html: '高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>', pauseTime: 3 },
                    // { lng: 116.381476, lat: 39.974073, html: '肯德基早餐<div><img src="http://ishouji.baidu.com/resource/images/map/show_pic04.gif"/></div>', pauseTime: 2 }
                ]
            });
            // var initLushu = function() {
            //     lushu.start();
            // };
            // setTimeout(initLushu, 4000);
            map.addEventListener("click",startlushu);//给地图注册点击事件
            function startlushu(){
              lushu.start();//启动路书函数
            }

            // map.addEventListener("click",function(e){
            //     alert(e.point.lng + "," + e.point.lat);
            // });
            
        } else {
            console.log('ERROR GPSLIST');
        }


    }


    $scope.showMap = function(size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'showMap.html',
            controller: 'showMapCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function() {


        }, function() {
            var map2 = new BMap.Map("map2", { minZoom: 5, maxZoom: 18 });
            map2.enableScrollWheelZoom(true);
        });
    };

    $scope.init = function() {
        initData();
    };


    var ratio = window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio;
    var configs = [{
        view: "", //预览图片ID
        picker: "filepicker1", //选择图片按钮ID
        thumWidth: thumbnailWidth,
        thumHeight: thumbnailHeight,
        input: "imgCert", //图片地址显示,
        callback: $scope.doUpload
    }];

    $scope.doUpload = function() {

        //if ($('#imgCertValue').val() !== "") $scope.delivery.completeCert = $('#imgCertValue').val();
        //if ($('#imgCertValue').attr('data-cargono') !== "") $scope.delivery.completeCert = $('#imgCertValue').attr('data-cargono');

        var saveDeliveryCertImageReq = {
            "cargoNo": $('#imgCertValue').attr('data-cargono'),
            "certImage": $('#imgCertValue').val()
        };

        $http({
            method: 'put',
            url: domainConfig.dispatchDomain + '/captain/cargoDeliver/saveDeliveryCertImage',
            data: JSON.stringify(saveDeliveryCertImageReq), // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            if (!data.success) {
                toastr['error']('提交失败', data.msg);
            } else {}
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    };

    initUploader(configs);

});

app.register.controller('showMapCtrl', function($http, $scope, $uibModalInstance, $stateParams, domainConfig, pagerConfig, listService, items, $timeout) {

    $scope.init = function() {
        setTimeout(initMap, 1000);
    };

    $scope.gpsData = {};
    $scope.deliveryId = $stateParams.deliveryId;
    var initMap = function() {
        // var map = new BMap.Map("map2", { minZoom: 5, maxZoom: 18 });
        // map.enableScrollWheelZoom(true);
        // map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        var url = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverDtlInfos/' + $scope.deliveryId;
        listService.events(url, {}).success(function(data, status, headers) {
            // angular.copy(data.gpsDeviceInfo, $scope.gpsEditInfo);
            $scope.delivery = data.delivery;
            //initMap(data.gpsRecords);
            var pathCargoNo = $scope.delivery.cargoNo;
            //var pathCargoNo = "CARGO20160511161";
            var urlPath = domainConfig.dispatchDomain + 'captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo;
            //var urlPath = 'http://192.168.20.61:9000/captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo;
            listService.events(urlPath, {}).success(function(data, status, headers) {
                //console.log(data);
                initMap2(data);
                $scope.gpsData = data;
            });
        });

        // var pathCargoNo = "CARGO20160511161";
        // // var urlPath = domainConfig.dispatchDomain+'captain/cargoDeliver/cargoDeliverGpsRecord/'+pathCargoNo;
        // var urlPath = 'http://192.168.20.61:9000/captain/cargoDeliver/cargoDeliverGpsRecord/' + pathCargoNo;
        // listService.events(urlPath, {}).success(function(data, status, headers) {
        //     //console.log(data);
        //     initMap2(data);
        //     $scope.gpsData = data;
        // });

    };


    function initMap2(records) {
        //http://127.0.0.1:8080/#/deliverDt/23
        // map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        // map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
        var map = new BMap.Map("map2", { minZoom: 5, maxZoom: 18 });
        map.enableScrollWheelZoom(true);
        var allRecords = records.gpsRecords;
        var allRecordsLength = allRecords.length;
        var gpsRecords = [];
        var gpsPoint = [];

        function xYgps(x, y) //声明对象
        {
            this.x = x;
            this.y = y;
        }



        for (i = 0; i < allRecordsLength; i++) {
            gpsRecords.push(new xYgps(allRecords[i].longitude, allRecords[i].latitude));
            //console.log(gpsRecords);
            var point = new BMap.Point(allRecords[i].longitude, allRecords[i].latitude);
            gpsPoint.push(point);

        }
        var startPoint = gpsPoint[0];
        var markerStart = new BMap.Marker(startPoint); // 创建标注
        map.addOverlay(markerStart); // 将标注添加到地图中
        //markerStart.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        var endPoint = gpsPoint[gpsPoint.length - 1];
        var markerEnd = new BMap.Marker(endPoint); // 创建标注
        map.addOverlay(markerEnd); // 将标注添加到地图中
        //markerEnd.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        var centerX = (gpsRecords[0].x + gpsRecords[gpsRecords.length - 1].x) / 2;
        var centerY = (gpsRecords[0].y + gpsRecords[gpsRecords.length - 1].y) / 2;
        //console.log(gpsRecords);
        var pointCenter = new BMap.Point(centerX, centerY);
        //var pointCenter = new BMap.Point(gpsRecords[0].x, gpsRecords[0].y);
        map.centerAndZoom(pointCenter, 18);
        //var point = new BMap.Point(temp.longitude, temp.latitude);
        var polyline = new BMap.Polyline(gpsPoint, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5 }); //创建折线
        map.addOverlay(polyline);
    }

    //$timeout(initMap(), 3000);

});
