var app = angular.module('exingcai_captain_web');


app.register.controller('cargoTransferReportList', function ($scope, $uibModal, $log, $http, $injector, $rootScope, listService, domainConfig) {

    var pager = listService.pager;

    $scope.transferReportDtlList = [];
    $scope.queryParameters = {
        date:'',
        productCategoryId:'',
        modelId:'',
        brandId:'',
        fromOwnerName:'',
        toOwnerName:''
    };

    $scope.init = function () {
        $scope.queryCargoTransferReportList();
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

    $scope.queryCargoTransferReportList = function () {
        var params = {
            date: $scope.queryParameters.date,
            productCategoryId: $scope.queryParameters.productCategoryId,
            modelId: $scope.queryParameters.modelId,
            brandId: $scope.queryParameters.brandId,
            fromOwnerName: $scope.queryParameters.fromOwnerName,
            toOwnerName: $scope.queryParameters.toOwnerName,
            isExport: false
        };
        var url = domainConfig.hulkDomain + 'hulk/report/transfer';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.transferReportDtlList = data.transferReportDtlList;
        }).error(function (data) {

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
