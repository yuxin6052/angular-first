var app = angular.module('exingcai_captain_web');


app.register.controller('VehicleEditCtrl', function($scope, $uibModal, $log, $http, $stateParams, listService, pagerConfig, domainConfig, $location) {

    $scope.useQuality = [];
    $scope.fleetNoNames = [];
    //上传
    $scope.imgBaseurl = domainConfig.imgDomain;
    var ratio = window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio;
    var configs = [{
        view: "", //预览图片ID
        picker: "filePicker", //选择图片按钮ID
        thumWidth: thumbnailWidth,
        thumHeight: thumbnailHeight,
        input: "fileshow" //图片地址显示
    }, {
        view: "", //预览图片ID
        picker: "filePicker2", //选择图片按钮ID
        thumWidth: thumbnailWidth,
        thumHeight: thumbnailHeight,
        input: "fileshow2" //图片地址显示
    }];
    initUploader(configs);

    $scope.vehicle = {};
    $scope.gpsDevice = {};
    $scope.requestType = 'post';
    var handleDatePickers = function() {

        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true
            });
        }
    };


    $scope.bindgps = 0;
    $scope.isBind = false;
    $scope.vehicleList = [];
    $scope.currentPage = pagerConfig.currentPage;
    $scope.maxSize = pagerConfig.maxSize;
    $scope.vehicleId = $stateParams.vehicleId;
    $scope.imgUrl = [];
    $scope.init = function() {
        handleDatePickers();
        console.log($scope.vehicleId);
        if ($scope.vehicleId !== '') {
            $scope.saveUrl = domainConfig.dispatchDomain + 'captain/deliveryTool/deliverToolInfoModify';
            $scope.requestType = 'put';
            $scope.queryVehicleDt();
            var url = domainConfig.dispatchDomain + "captain/deliveryTool/deliveryToolDtlInfo/" + $stateParams.vehicleId;
            listService.events(url).success(function(data, status, headers) { 
                //console.log(data);
                $scope.useQuality = data.enumRefVos;
                $scope.fleetNoNames = data.fleetNoNames;
            });
        } else {
            $scope.vehicle.status = 200;
            $scope.saveUrl = domainConfig.dispatchDomain + 'captain/deliveryTool/deliverToolNew';

            //vehicleId为空，新增
            $scope.staticInfo = "toolUseQuality";

            $http({
                method: 'post',
                url: domainConfig.dispatchDomain + 'captain/common/enumConfigs',
                params: { keys: $scope.staticInfo }, // pass in data as strings
                // data:JSON.stringify($scope.staticInfo),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);

                // $scope.fleetNoNames = data.data.fleetNoNames;
                $scope.useQuality = data.data.toolUseQuality;
                $scope.vehicle.useQuality="租赁";

            }).error(function(data, status, headers, config) {
                console.log(data);
            });


        }

        $scope.queryGPSList();
    };

    $scope.queryVehicleDt = function() {
        var url = domainConfig.dispatchDomain + "captain/deliveryTool/deliveryToolDtlInfo/" + $scope.vehicleId;
        listService.events(url).success(function(data, status, headers) { 
            $scope.vehicle = data.secondDeliveryToolVo;
            $scope.imgUrl = $scope.vehicle.vehicleLicenceFile.split(',');
            $scope.gpsDevice = data.gpsDevice;
            if ($scope.gpsDevice.id !== '0') {
                $scope.isBind = true;
                $scope.bindgps = $scope.gpsDevice.id;
            }

        });
    };

    $scope.queryGPSList = function() {
        var url = domainConfig.dispatchDomain + "captain/gps/gpsDeviceInfos?status=200";
        listService.events(url).success(function(data, status, headers) {
            $scope.GPSList = data.gpsDeviceInfos.dataList; 
            $scope.totalItems = $scope.GPSList.length;
        });
    };

    $scope.bindGps = function(gpsID) {
        $scope.bindgps = gpsID;
        $scope.isBind = false;
        //将gpsid赋给form对象

    };
    $scope.unbindGps = function(vehicleId) {
        $scope.bindgps = 0;
        $scope.isBind = true;
        // $scope.newGPS.bindDeliveryToolId="";

    };


    $scope.deleteArrNullValue = function(array) {

        for (var i = 0; i < array.length; i++) {
            if (array[i] == "" || typeof(array[i]) == "undefined") {
                array.splice(i, 1);
                i = i - 1;

            }

        }
        return array;
    };
    $scope.saveVehicle = function() {
        // $scope.vehicle.deleteFlag= 0;
        $scope.imgUrl = [];
        var regex = /^-?\d+\.?\d*/;
        $scope.vehicle.axisNum = regex.exec($scope.vehicle.axisNum)[0];
        $scope.vehicle.maxLoad = regex.exec($scope.vehicle.maxLoad)[0];
        $scope.vehicle.totalMass = regex.exec($scope.vehicle.totalMass)[0];

        var dateRegex = /(\d{4})[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5](\d{2})[\u4e00-\u9fa5]/;
        $scope.vehicle.purchaseDate = $scope.vehicle.purchaseDate.replace(dateRegex, '$1$2$3');
        $scope.vehicle.deleteFlag = 0;

        if ($('#imgurl').val() !== "") $scope.imgUrl.push($('#imgurl').val());
        if ($('#imgurl2').val() !== "") $scope.imgUrl.push($('#imgurl2').val());
        console.log($scope.imgUrl);

        $scope.imgUrl = $scope.deleteArrNullValue($scope.imgUrl);
        $scope.vehicle.vehicleLicenceFile = $scope.imgUrl.join(",");
        console.log($scope.vehicle.vehicleLicenceFile);
        if ($scope.vehicle.useQuality == "自购") $scope.vehicle.useQuality = "01";
        if ($scope.vehicle.useQuality == "租赁") $scope.vehicle.useQuality = "02";

        var requestObj = { deliveryTool: $scope.vehicle, gpsId: Number($scope.bindgps) };
        $http({
            method: $scope.requestType,
            url: $scope.saveUrl,
            data: JSON.stringify(requestObj), // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            
            if (!data.success) {
                toastr['error']('保存失败！', data.msg);
            } else {
                if ((typeof $location.port()) === 'number') {
                window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/#/vehicleList";
                } else {
                    window.location.href = 'http://' + $location.host() + "/#/vehicleList";
                }
            }
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    };

});
