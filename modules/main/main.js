var captainModule = angular.module('exingcai_captain_web', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.router','ngFileUpload', 'ngCookies','ui.select', 'ngSanitize']);

require('router');
require('pages/filters/filters');
require('interceptor/captainInterceptor');

//require.loadJs('statics/modules/pages/logout/logoutController.js');



/**
 * Master Controller
 */
captainModule.run(function ($rootScope, domainConfig, $http, $cookieStore, listService) {
    var user = $cookieStore.get("Security-Token");
    $rootScope.system = user.system;
});


captainModule.config(function($provide) {

    $provide.factory('_GLOBAL_uuid', function($http) {

        var uinfo = {
            "uuid": ""
        };

        return uinfo;
    });
});
captainModule.config(function($provide) {

    $provide.factory('pagerConfig', function($http) {
        //var requestData = $("#formFilter").serialize();

        var pager = {
            "currentPage": 1,
            "maxSize": 5
        }
        return pager;

    });
});


captainModule.config(function($provide) {

    $provide.factory('domainConfig', function($http) {

        var config = require("main/config");
        return config;

    });
});

captainModule.controller('mainFrameContrl', function($rootScope, $scope, $cookieStore, $state) {
    /**
     * Sidebar Toggle & Cookie Control
     */
   $scope.userName=$cookieStore.get("Security-Token");
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'login') return; // 如果是进入登录界面则允许
        // 如果用户不存在
        var user = $cookieStore.get("Security-Token");

        if (typeof(user) == "undefined") {
            event.preventDefault(); // 取消默认跳转行为
            if ((typeof $location.port()) === 'number') {
                window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/login";
            } else {
                window.location.href = 'http://' + $location.host() + "/login";
            }
            //$state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
        }
    });


    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
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

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

});

captainModule.controller('AccordionDemoCtrl', function($scope) {

    $scope.oneAtATime = true;

    $scope.groups = [{
        title: '单据维护',
        items: [{ 'subnav': '派车单维护', 'link': '.dispatch' }, { 'subnav': '送货单维护', 'link': '.product' }]

    }, {
        title: '路线管理',
        items: [{ 'subnav': '路线查询', 'link': '.dispatch' }, { 'subnav': '路线规划', 'link': '.product' }]
    }, {
        title: '信息管理',
        items: [{ 'subnav': '司机维护', 'link': '.dispatch' }, { 'subnav': '车辆维护', 'link': '.product' }, { 'subnav': '公司信息维护', 'link': '.product' }]
    }];


    $scope.items = ['派车单维护', '送货单维护'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
});

captainModule.filter('gpsStatus', function() {
    return function(input) {
        var newValue;
        switch (input) {
            case 100:
                newValue = "无效";
                break;
            case 200:
                newValue = "有效";
                break;
            case 300:
                newValue = "已绑定车辆";
                break;
        }
        return newValue;
    };
});

captainModule.filter('comType', function() {
    return function(input) {
        var newValue;
        switch (input) {
            case "1":
                newValue = "物流企业";
                break;
            case "2":
                newValue = "仓储企业";
                break;
            case "3":
                newValue = "贸易企业";
                break;
        }
        return newValue;
    };
});


captainModule.filter('gpsStatus', function() {
    return function(input) {
        var newValue;
        switch (input) {
            case 100:
                newValue = "冻结";
                break;
            case 200:
                newValue = "激活";
                break;
            case 300:
                newValue = "已绑定车辆";
                break;
        }
        return newValue;
    };

});

captainModule.filter('driverStatus', function() {
    return function(input) {
        var newValue;
        console.log(input);
        switch (input) {
            case "0":
                newValue = "无效";
                break;
            case "1":
                newValue = "有效";
                break;
            default:
                newValue = "有效";
                break;

        }
        return newValue;
    };
});

captainModule.filter('toolStatus', function() {
    return function(input) {
        var newValue;
        switch (input) {
            case 100:
                newValue = "无效";
                break;
            case 200:
                newValue = "有效";
                break;
        }
        return newValue;
    };
});

captainModule.filter('vehicleStatus', function() {
    return function(input) {
        var newValue;
        switch (input) {
            case 100:
                newValue = "无效";
                break;
            case 200:
                newValue = "有效";
                break;
            case 300:
                newValue = "已绑定司机";
                break;
        }
        return newValue;
    };
});

captainModule.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop]&&item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }
        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }
    return out;
  };
});

captainModule.controller('MessageCtrl', function($http, $scope, $uibModalInstance, items) {
    $scope.title = items.title;
    $scope.msg = items.msg;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});

captainModule.controller('headCtrl', function($scope, $http, $cookieStore, domainConfig, listService, $location) {
    $scope.logout = function() {
        //接口错误接口错误
        var cookie_person = $cookieStore.get("person");
        var url = domainConfig.witchDomain + "witch/logout?uuid=123123" + cookie_person.uuid;
        console.log(url);


        console.log(cookie_person);
        $http({ method: 'GET', url: url })
            .then(
                function(result) {
                    console.log(result.data);
                    $cookieStore.remove("Security-Token");

                    var dataResult = result.data;
                    if (dataResult.success === true) {
                        if ((typeof $location.port()) === 'number') {
                            window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/login";
                        } else {
                            window.location.href = 'http://' + $location.host() + "/login";
                        }
                    }
                },
                function(err) {

                }
            );
    };

});
