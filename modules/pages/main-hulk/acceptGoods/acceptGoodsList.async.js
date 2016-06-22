var app = angular.module('exingcai_captain_web');


app.register.controller('acceptGoodsList', function ($scope, $uibModal, $log, $http, $injector, listService, domainConfig) {

    var pager = listService.pager;

    $scope.acceptBatchList = [];
    $scope.totalSum = 0;
    $scope.unhandledSum = 0;
    $scope.handlingSum = 0;
    $scope.handledSum = 0;
    $scope.queryStatus;
    $scope.queryParameters = {
        batchNo: '',
        wlCompanyName: '',
        startDate:'',
        endDate:''
    };

    $scope.pagination = {
        totalItems: 0,
        maxSize: 5,
        currentPage: 1,
        pageSize: 10
    };

    $scope.init = function () {
        $scope.initTotalItems();
        $scope.queryAcceptBatchList();
    }

    $scope.queryAcceptBatchList = function () {
        var params = {
            batchNo: $scope.queryParameters.batchNo,
            wlCompanyName: $scope.queryParameters.wlCompanyName,
            type: 3,
            status: $scope.queryStatus,
            page: $scope.pagination.currentPage,
            pageSize: $scope.pagination.pageSize
        };
        var url = domainConfig.hulkDomain + 'hulk/contractBatch/list';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.acceptBatchList = data.contractBatchList;
            $scope.pagination.totalItems = data.total;
        }).error(function (data) {
            $scope.acceptBatchList = [{
                batchNo: 1,
                wlCompanyName: 'company',
                wlCompanyPerson: 'pw',
                wlCompanyPhone: '1550****',
                createdDateStr: '2015-04-01',
                status: 100
            }, {
                    batchNo: 1,
                    wlCompanyName: 'company',
                    wlCompanyPerson: 'pw',
                    wlCompanyPhone: '1550****',
                    createdDateStr: '2015-04-01',
                    status: 200
                }, {
                    batchNo: 1,
                    wlCompanyName: 'company',
                    wlCompanyPerson: 'pw',
                    wlCompanyPhone: '1550****',
                    createdDateStr: '2015-04-01',
                    status: 300
                }];
        });
    }

    $scope.initTotalItems = function () {
        var params = {
            type: 3
        };
        var url = domainConfig.hulkDomain + 'hulk/contractBatch/countByStatus';
        listService.events(url, params).success(function (data, status, headers) {
            $scope.totalSum = data.countOfStart + data.countOfDoing + data.countOfComplete;
            $scope.unhandledSum = data.countOfStart;
            $scope.handlingSum = data.countOfDoing;
            $scope.handledSum = data.countOfComplete;
        }).error(function (data) {

        });
    }

    $scope.changeTab = function (queryStatus) {
        $scope.queryStatus = queryStatus;
        $scope.pagination.currentPage = 1;
        $scope.queryParameters = {
            batchNo: '',
            wlCompanyName: ''
        };
        $scope.queryAcceptBatchList();
    }

    $scope.pageChanged = function () {
        $log.log('Page changed to: ' + $scope.pagination.currentPage);
        //reloaddata
        $scope.queryAcceptBatchList();
    }

    $scope.setPage = function (pageNo) {
        $scope.pagination.currentPage = pageNo;
        //reload data
        $scope.queryAcceptBatchList();
    }
});
