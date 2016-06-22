var app = angular.module('exingcai_captain_web');

app.register.controller('driverEdit', function($scope, $uibModal, $log, $http, $stateParams, $location, listService, pagerConfig, domainConfig) {

    $scope.imgurl = "";
    $scope.imgurl2 = "";
    $scope.imgurl3 = "";
    $scope.imgurl4 = "";
    $scope.imgBaseurl = domainConfig.imgDomain;

    $scope.userGenderEnumRefs = [];
    $scope.driverLicenseTypeEnumRef = [];
    $scope.driverProfessQualityTypeEnumRef = [];

    $scope.userId = $stateParams.userId;

    $scope.newDriver = {
        isAvaliable: '1'
    };

    $scope.genders = [{
        code: "1",
        label: '男'
    }, {
        code: "2",
        label: '女'
    }];

    $scope.vehicleList = [];
    $scope.currentPage = pagerConfig.currentPage;
    $scope.maxSize = pagerConfig.maxSize;

    var handleDatePickers = function() {
        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
    };
    handleDatePickers();

    var ratio = window.devicePixelRatio || 1,
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
    }, {
        view: "", //预览图片ID
        picker: "filePicker3", //选择图片按钮ID
        thumWidth: thumbnailWidth,
        thumHeight: thumbnailHeight,
        input: "fileshow3" //图片地址显示
    }, {
        view: "", //预览图片ID
        picker: "filePicker4", //选择图片按钮ID
        thumWidth: thumbnailWidth,
        thumHeight: thumbnailHeight,
        input: "fileshow4" //图片地址显示
    }];
    initUploader(configs);

    $scope.queryDemandDt = function() {
        $scope.url = domainConfig.witchDomain + "witch/driver/queryForUpdate/" + $scope.userId;
        listService.events($scope.url).success(function(data, status, headers) { 
            $scope.newDriver = data.queryDriverInfo;
        });

    };

    $scope.queryEnumRef = function() {
        $scope.enumurl = domainConfig.witchDomain + "witch/driver/" + $scope.userId;
        listService.events($scope.enumurl).success(function(data, status, headers) {
            $scope.userGenderEnumRefs = data.userGenderEnumRefs;
            $scope.driverLicenseTypeEnumRef = data.driverLicenseTypeEnumRef;
            $scope.driverProfessQualityTypeEnumRef = data.driverProfessQualityTypeEnumRef;        
        });

    };

    $scope.ok = function() {
        $uibModalInstance.close($scope.newDriver);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.queryVehicle = function() {
        var url = domainConfig.dispatchDomain + "captain/deliveryTool/deliverToolFullInfos?status=201&pageStatus.page=1&pageStatus.pageSize=5";
        listService.events(url).success(function(data, status, headers) { 
            $scope.vehicleList = data.deliveryToolFull.dataList; 
            $scope.totalItems = data.deliveryToolFull.total;
        });
    };
    $scope.queryVehicle();

    $scope.saveDriver = function() {
        //$scope.newDriver.deliveryToolId= $parent.newDriver.deliveryToolId;
        //接口问题接口问题

        if ($('#imgurl').val() !== "") $scope.newDriver.driverLicenseFaceFile = $('#imgurl').val();
        if ($('#imgurl2').val() !== "") $scope.newDriver.driverLicenseBackFile = $('#imgurl2').val();
        if ($('#imgurl3').val() !== "") $scope.newDriver.professionQulificationFaceFile = $('#imgurl3').val();
        if ($('#imgurl4').val() !== "") $scope.newDriver.professionQulificationBackFile = $('#imgurl4').val();
        // console.log(imgURL);
        $http({
            method: 'put',
            url: domainConfig.witchDomain + 'witch/driver/addDriver',
            data: JSON.stringify($scope.newDriver), // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            if (!data.success) {
                toastr['error']('保存失败！', data.msg);
            } else {
                toastr['success']('保存成功！');
                if ((typeof $location.port()) === 'number') {
                    window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/#/driverList";
                } else {
                    window.location.href = 'http://' + $location.host() + "/#/driverList";
                }
            }
        }).error(function(data, status, headers, config) {
            toastr['error']('保存失败！', 'data.msg');
        });
    };

    $scope.init = function() {
        if ($scope.userId !== '') {
            $scope.queryDemandDt();
            $scope.queryEnumRef();
        } else {
            $scope.staticInfo = "toolUseQuality,userGender,driverLicenseType,driverProfessQualityType";

            $http({
                method: 'post',
                url: domainConfig.dispatchDomain + 'captain/common/enumConfigs',
                params: { keys: $scope.staticInfo }, // pass in data as strings
                // data:JSON.stringify($scope.staticInfo),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                console.log(data);

                $scope.driverLicenseTypeEnumRef = data.data.driverLicenseType;
                $scope.driverProfessQualityTypeEnumRef = data.data.driverProfessQualityType;
                $scope.userGenderEnumRefs = data.data.userGender;

                $scope.newDriver.gender="1";
                $scope.newDriver.driverLicenseType="A2";
                $scope.newDriver.professionQulificationType="100";

            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }
    };
    $scope.init();

});
