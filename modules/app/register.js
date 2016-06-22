var captainModule = angular.module('exingcai_captain_web', ['ngAnimate', 'ui.bootstrap', 'ui.router', 'ngCookies']);

require('router');




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
        }
        return {
            events: function(url) {
                return doRequest(url); },
        };



    });
});






captainModule.controller('register', function($scope, $http, $cookieStore,$cookies, domainConfig, listService,$location) {
    $scope.imgBaseurl = domainConfig.imgDomain;
    /**
     * Sidebar Toggle & Cookie Control
     */
    $scope.form = {
        "loginName": "",
        "loginPwd": "",
        "loginPwd1": "",
        "compName":"",
        "compAddress":"",
        "compContact":"",
        "compPhone":"",
        "compType":2,
        "busLicenceFile":"",
        "taxationRegFile":"",
        "organizationFile":"",
        "openAccountFile":""

    }
  
     var
    // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio;
    var configs = [{
        view: "", //预览图片ID
        picker: "filePicker", //选择图片按钮ID
        thumWidth: thumbnailWidth,
        thumHeight: thumbnailHeight,
        input: "fileshow" //图片地址显示
    },
     {
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
    }
    ];
    initUploader(configs);
    $scope.isabled="disabled";
    $scope.isValidate=false;
    $scope.validateName=function(){
         var url = domainConfig.witchDomain + "witch/validateLoginName?loginName="+$scope.form.loginName;
          $http({
                method: 'GET',
                url: url,
             
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
             
                if(data.success){
                    $scope.isValidate=true;
                    $scope.userNameInfo="用户名可用√";
                    $scope.errorInfoClass="rightInfo";
                
                }else{
                    $scope.isValidate=true;
                    $scope.userNameInfo="用户名已存在";
                    $scope.errorInfoClass="errorInfo";
                } 
             
                
            })
            .error(function(data, status, headers, config) {
                console.log(data);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }
    $scope.submit = function() {
        if ($('#imgurl').val() !== "") $scope.form.busLicenceFile = $('#imgurl').val();
        if ($('#imgurl2').val() !== "") $scope.form.taxationRegFile = $('#imgurl2').val();
        if ($('#imgurl3').val() !== "") $scope.form.organizationFile = $('#imgurl3').val();
        if ($('#imgurl4').val() !== "") $scope.form.openAccountFile = $('#imgurl4').val();
        $scope.pictureShow=true;
        if($scope.form.busLicenceFile!=""&&$scope.form.taxationRegFile!=""&&$scope.form.organizationFile!=""&&$scope.form.openAccountFile){
           $scope.pictureShow=false; 
        }else{
            return false;
        }
       
        var url = domainConfig.witchDomain + "witch/doRegister";

       $scope.registerReponseTrue=false;

        $http({
                method: 'PUT',
                url: url,
                data:JSON.stringify($scope.form),
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
             
                if(data.success){
                   
                    $scope.registerReponseTrue=true;
                   
                       if((typeof $location.port())==='number'){
                    window.location.href = 'http://'+$location.host()+':'+$location.port()+"/login"
                }else{
                    window.location.href = 'http://'+$location.host()+"/login"
                }
                }else{
                    $scope.registerReponseTrue=false;
                } 
             
                
            })
            .error(function(data, status, headers, config) {
                console.log(data);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });

    }


});

// captainModule
//   .directive('pwdIsEqual', [function () {
//       return {
//           require: "ngModel",
//           link: function (scope, element, attr, ngModel) {
//               if (ngModel) {
//                   var emailsRegexp = /^([a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*[;；]?)+$/i;
//               }
//               var customValidator = function (value) {
//                   var validity = ngModel.$isEmpty(value) || emailsRegexp.test(value);
//                   ngModel.$setValidity("multipleEmail", validity);
//                   return validity ? value : undefined;
//               };
//               ngModel.$formatters.push(customValidator);
//               ngModel.$parsers.push(customValidator);
//           }
//       };
//   }])
