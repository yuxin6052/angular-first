var captainModule = angular.module('exingcai_captain_web', ['ngAnimate', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngFileUpload', 'ui.select', 'ngSanitize']);

require('router/hulkRouter');
require('pages/common/common');
require('pages/filters/filters');
require('interceptor/captainInterceptor');

var warehouseList;
var config;
angular.element(document).ready(function () {
    //load domain config
    config = require("main/config");
    //load warehouseList
    var url = config.hulkDomain + 'hulk/warehouse/listWarehouseByCurUser';
    var security = getCookie('Security-Token');
    $.ajax({
        url: url,
        type: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('Security-Token', security); },
        success: function (data) {
            if (data.success) {
                warehouseList = data.warehouseList;
            } else {
                toastr['error'](data.msg, '提示');
            }
            angular.bootstrap(document, ['exingcai_captain_web']);
        }
    });
    // $.get(url, function (data) {
    //     debugger;
    //     permissionList = data;
    //     angular.bootstrap(document, ['App']);
    // });
});

captainModule.config(function ($provide) {

    $provide.factory('domainConfig', function ($http) {

        // var config = require("main/config");
        return config;

    });
});

captainModule.run(function ($rootScope, domainConfig, $http, $cookieStore, listService) {
    $rootScope.domainConfig = domainConfig;
    var user = $cookieStore.get("Security-Token");
    $rootScope.system = user.system;

    $rootScope.warehouseList = warehouseList;
    if ($rootScope.warehouseList&&$rootScope.warehouseList.length > 0) {
        $rootScope.warehouseId = $rootScope.warehouseList[0].id
    }
    // var url = domainConfig.hulkDomain + 'hulk/warehouse/listWarehouseByCurUser';
    // listService.events(url).success(function (data, status, headers) {
    //     if (data.success) {
    //         $rootScope.warehouseList = data.warehouseList;
    //         if ($rootScope.warehouseList.length > 0) {
    //             $rootScope.warehouseId = $rootScope.warehouseList[0].id
    //         }
    //     } else {
    //         toastr['error'](data.msg, '提示');
    //     }
    // }).error(function (data) {
    //     toastr['error'](data.msg, '提示');
    // });
});

captainModule.controller('hulkController', function ($rootScope, $scope, $cookieStore, $location) {


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'login') return;// 如果是进入登录界面则允许
        // 如果用户不存在
        var user = $cookieStore.get("Security-Token")
        if (typeof (user) == "undefined") {
            event.preventDefault();// 取消默认跳转行为
            if ((typeof $location.port()) === 'number') {
                window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/login";
            } else {
                window.location.href = 'http://' + $location.host() + "/login";
            }
            //$state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
        }
    });

    var mobileView = 992;
    $scope.getWidth = function () {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function (newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = !$cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function () {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function () {
        $scope.$apply();
    };





});
captainModule.controller('headCtrl', function ($rootScope, $scope, $http, $cookieStore, domainConfig, listService, $location) {
    $scope.userName=$cookieStore.get("Security-Token").loginName;
    $scope.init = function () {
    }

    $scope.warehouseChange = function (warehouseId) {
        $rootScope.warehouseId = warehouseId;
    }

    $scope.logout = function () {
        //接口错误接口错误
        var cookie_person = $cookieStore.get("person");
        var url = domainConfig.witchDomain + "witch/logout?uuid=123123" + cookie_person.uuid;
        console.log(url);


        console.log(cookie_person);
        $http({ method: 'GET', url: url })
            .then(
            function (result) {
                console.log(result.data);
                $cookieStore.remove("Security-Token")

                var dataResult = result.data;
                if (dataResult.success === true) {
                    if ((typeof $location.port()) === 'number') {
                        window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/login";
                    } else {
                        window.location.href = 'http://' + $location.host() + "/login";
                    }
                }
            },
            function (err) {

            }
            );
    };

});

captainModule.controller('MessageCtrl', function ($http, $scope, $uibModalInstance, items) {
    $scope.title = items.title;
    $scope.msg = items.msg;

    $scope.ok = function () {
        $uibModalInstance.close();
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

function getCookie(objName) {//获取指定名称的cookie的值    
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        //获取单个cookies   
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) {
            if (temp.length > 1) {
                return unescape(temp[1]);
            } else {
                return "";
            }
        };
    }
    return "";
}  