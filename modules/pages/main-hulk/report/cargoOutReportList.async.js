var app = angular.module('exingcai_captain_web');


app.register.controller('cargoOutReportList', function ($scope, $uibModal, $log, $http, $injector, $rootScope, listService, domainConfig) {

    var pager = listService.pager;

    $scope.cargoOutReportVoList = [];
    $scope.queryParameters = {
        outDateStr: '',
        productCategoryId: '',
        modelId:'',
        brandId:'',
        ownerName:'',
        cardId:''
    };

    $scope.init = function () {
        $scope.queryCargoOutReportList();
        $scope.queryOption();
        $scope.initDatePicker();
    }

    $scope.initDatePicker = function () {
        if (jQuery().datepicker) {
            $.fn.datepicker.dates['zh'] = {
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
                daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
                meridiem: ["上午", "下午"],
                //suffix:      ["st", "nd", "rd", "th"],
                today: "今天"
            };
            $('.date-picker').datepicker({
                language: 'zh',
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true
            });
        }
    }

    $scope.queryCargoOutReportList = function () {
        var params = {
            outDateStr: $scope.queryParameters.outDateStr,
            productCategoryId: $scope.queryParameters.productCategoryId,
            modelId: $scope.queryParameters.modelId,
            brandId: $scope.queryParameters.brandId,
            ownerName: $scope.queryParameters.ownerName,
            cardId: $scope.queryParameters.cardId,
            queryOrExport:'1'
        };
        var url = domainConfig.hulkDomain + 'hulk/reportOutIn/cargoOutReport';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.cargoOutReportVoList = data.cargoOutReportVoList;
        }).error(function (data) {
            // $scope.cargoOutReportVoList = [{
            //     batchNo: 1,
            //     wlCompanyName: 'company',
            //     wlCompanyPerson: 'pw',
            //     wlCompanyPhone: '1550****',
            //     createdDateStr: '2015-04-01',
            //     status: 100
            // }];
        });
    }

    $scope.queryOption = function () {
        var url = domainConfig.hulkDomain + 'hulk/report/queryOption';
        listService.events(url).success(function (data, status, headers) {
            $scope.productCategoryList = data.productCategoryList;
            $scope.modelList = data.modelList;
            $scope.brandList = data.brandList;
            $scope.cardList = data.cardList;
        }).error(function (data) {

        });
    }

    $scope.changeSelectedCardName = function (obj) {
        angular.forEach($scope.cardList, function (card, index) {
            if (obj.cardName == card.cardName) {
                obj.cardId = card.id;
            }
        });
    }

    $scope.changeSelectedProductCategoryName = function (obj) {
        angular.forEach($scope.productCategoryList, function (product, index) {
            if (obj.productCategoryName == product.productCategoryName) {
                obj.productCategoryId = product.id;
            }
        });
    }

    $scope.changeSelectedModelName = function (obj) {
        angular.forEach($scope.modelList, function (model, index) {
            if (obj.modelName == model.modelName) {
                obj.modelId = model.id;
            }
        });
    }

    $scope.changeSelectedBrandName = function (obj) {
        angular.forEach($scope.brandList, function (brand, index) {
            if (obj.brandName == brand.brandName) {
                obj.brandId = brand.id;
            }
        });
    }
});
