var app = angular.module('exingcai_captain_web');


app.register.controller('vehicleDemandAdd', function($rootScope, $scope, $uibModal, $log, $http, $stateParams, $location, listService, pagerConfig, domainConfig) {

    initialize();
    $scope.acceptGoodsBatch = {

    };
    $scope.acceptGoodsBatch.cargoRecieveBatchArr = {};
    $scope.acceptGoodsBatch.cargoRecieveBatchArr.productDtlList = [];
    //$scope.acceptGoodsBatch.cargoRecieveBatchArr.form.productDtlList=[];

    function initialize() {
        var handleDatePickers = function() {
            if (jQuery().datepicker) {
                $.fn.datetimepicker.dates['zh'] = {
                    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
                    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
                    meridiem: ["上午", "下午"],
                    //suffix:      ["st", "nd", "rd", "th"],  
                    today: "今天"
                };
                $('.date-picker').datetimepicker({
                    minView: "day",
                    language: 'zh',
                    isRTL: App.isRTL(),
                    format: "yyyy-mm-dd hh",
                    showMeridian: !0,
                    autoclose: !0,
                    // pickerPosition: App.isRTL() ? "bottom-right" : "bottom-left",
                    todayBtn: !0
                });
                //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
            }
        };
        handleDatePickers();
    }

    $scope.init = function() {

        $scope.newVhicleDemand = {
            // "fromWhName": "天津市广会通物流有限公司",
            // "fromWhAddress": "天津市东丽区华粮道2298号全程物流院办公大楼301室",
            // "pickupEndTime": "2016-02-03 00",
            // "pickupStartTime": "2016-02-04 00",
            // "fromWhContactPhone": "18602253518",
            // "fromWhContactor": "樊经理",

            // "toWhName": "上海丹尊物流有限公司",
            // "toWhAddress": "上海市嘉定区嘉美路880号6栋1楼",
            // "arriveEndTime": "2016-02-03 00",
            // "arriveStartTime": "2016-02-04 00",
            // "toWhContactPhone": "021-52847080",
            // "toWhContactor": "邹元斌",

            // "transCompanyId": 7, //

            // "demandProducts": [{
            //     "productCatagoryName": 1, //品名
            //     "productSpecifyName": 2, //规格
            //     "brandName": 25, //品牌
            //     "amount": 0, //数量
            //     "countUnit": "捆", //单位
            //     "weight": 3.5 ,//重量
            //     "weiUnit":'吨'
            // }],
            // "remark": "没有备注",
        };
    };
    $scope.transCompany = {

    };
    $scope.init();

    $scope.getTransCompanyId = function() {
        var url = domainConfig.dispatchDomain + 'captain/company/companyComboxList?companyName';
        listService.events(url).success(function(data, status, headers) {
            $scope.transCompanyList = data.companyList;

        }).error(function(data) {
            console.log("error");
        });

        // $http({
        //     method: 'get',
        //     url:domainConfig.dispatchDomain + 'captain/company/companyComboxList?companyName',
        //     headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        // }).success(function(data) {
        //     if (!data.success) {
        //         alert(data.msg);
        //     } else {
        //         console.log("y")
        //          $scope.transCompanyList = data.companyList;
        //     }
        // }).error(function(data, status, headers, config) {
        //     console.log(data);
        // });

    };
    $scope.getTransCompanyId();
    $scope.openAddModal = function(size) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addModal.html',
            controller: 'vehicleDemandAddModel',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(form) {
            $scope.acceptGoodsBatch.cargoRecieveBatchArr.productDtlList = $scope.acceptGoodsBatch.cargoRecieveBatchArr.productDtlList.concat(form.productDtlList);


        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.delete = function (index) {
        $scope.acceptGoodsBatch.cargoRecieveBatchArr.productDtlList.splice(index, 1);
    };

    $scope.saveNewVehicleDemand = function() {
    	$scope.newVhicleDemand.demandProducts=$scope.acceptGoodsBatch.cargoRecieveBatchArr.productDtlList;
        $http({
            method: 'put',
            url: domainConfig.dispatchDomain + 'captain/vehicleDemand/newVehicleDemand',
            data: JSON.stringify($scope.newVhicleDemand), // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        }).success(function(data) {
            if (!data.success) {
            	toastr['error']('提交失败！', data.msg);
                //alert(data.msg);
            } else {
                toastr['success']('提交成功！', '提示');
                if ((typeof $location.port()) === 'number') {
                    window.location.href = 'http://' + $location.host() + ':' + $location.port() + '/#/vehicleDemand';
                } else {
                    window.location.href = 'http://' + $location.host() + '/#/vehicleDemand';
                }
            }
        }).error(function(data, status, headers, config) {
            console.log(data);
        });
    };

    $scope.cancel = function() {
         window.location.href = 'http://' + $location.host() + ':' + $location.port() + '/#/vehicleDemand';
    };

});

app.register.controller('vehicleDemandAddModel', function($http, $scope, $uibModalInstance, domainConfig, listService) {
    $scope.form = {};
    $scope.form.productDtlList = [];
    $scope.addGoods = function() {
        var product = { "productCatagoryName": "", "productSpecifyName": "", "brandName": "", "amount": "", "countUnit": "捆", "weight": "", "weiUnit": "吨" };
        $scope.form.productDtlList.push(product);
    };

    $scope.deleteGoods = function(index) {
        $scope.form.productDtlList.splice(index, 1);
    };

    $scope.ok = function(valid) {
        console.log($scope.form.productDtlList);
        if (valid) {
            $uibModalInstance.close($scope.form);
        } else {
            toastr['error']('请填写完表单', '提示');
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
