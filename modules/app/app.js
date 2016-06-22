var captainModule = angular.module('exingcai_captain_web', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.router', 'ngCookies']);

require('router');
require('interceptor/captainInterceptor');

/**
 * Master Controller
 */

/*
    config.json
*/
captainModule.config(function($provide) {

    $provide.factory('domainConfig', function($http) {
        
        var config = require("main/config");
        return config;

    });
});
captainModule.config(function($provide) {

    $provide.factory('listService', function($http) {

        var doRequest = function(url) {

            return $http({
                method: 'GET',
                url: url
            });
        };
        return {
            events: function(url) {
                return doRequest(url);
            },
        };

    });

});

captainModule.controller('LoginCtrl', function($scope, $http, $cookieStore, domainConfig, listService, $location,captainInterceptor) {

    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.compType="2";
    $scope.person = {
        "loginName": "",
        "loginPwd": ""
    };

    $scope.login = function() {
        //domainConfig.witchDomain 
        var url = domainConfig.witchDomain + "witch/login?loginName=" + $scope.person.loginName + "&loginPwd=" + $scope.person.loginPwd;

        $http({
            method: 'PUT',
            url: url,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        })

        .success(function(data, status, headers) {
            if(data.success){

                var uuid = data.uuid;
                //_GLOBAL_uuid.uuid = uuid; 
                var userId = data.userBaseDTO.id;
                $cookieStore.put("Security-Token", {
                    loginName: $scope.person.loginName,
                    ticket: uuid,
                    userRoles: 'allRoles',
                    system: data.system,
                });
                if($scope.compType=="1"){
                    if ((typeof $location.port()) === 'number') {
                    window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/#/index";
                } else {
                    window.location.href = 'http://' + $location.host() + "/#/index";

                }
                }else if($scope.compType=="2" ){
                   if ((typeof $location.port()) === 'number') {
                    window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/index-hulk.html#/godownEntryList";
                } else {
                    window.location.href = 'http://' + $location.host() + "/index-hulk.html#/godownEntryList";

                } 
                }
            }else{
                $scope.loginResponse=data.msg;
            }
                
                

            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

    };

});
