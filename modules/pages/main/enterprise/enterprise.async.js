var app = angular.module('exingcai_captain_web');


app.register.controller('enterprise', function($scope, $uibModal, $cookieStore, $http, $stateParams, listService, domainConfig) {

    $scope.basicInfo = {
        "compName": "上海某某公司",
        "compAddress": "上海某某公司",
        "compContact": "上海某某公司",
        "compMobile": "上海某某公司",
        "compType": "上海某某公司",
        "busLicenceFile": "",
        "corporationIdentityBackFile": "",
        "organizationFile": "",
        "taxationRegFile": ""
    };


    //$scope.person = $cookieStore.get("person");
    $scope.url = domainConfig.witchDomain + "witch/userCompany/companyInfo";

    $http({
            method: 'GET',
            url: $scope.url,
            data: "", // pass in data as strings
            headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {

            if (!data.success) {
                console.log("/witch/userCompany/{{uuid}}接口错误");
            } else {
                $scope.basicInfo = data.userCompanyDTO;

                $scope.basicInfo.busLicenceFile = domainConfig.imgDomain + $scope.basicInfo.busLicenceFile;
                $scope.basicInfo.taxationRegFile = domainConfig.imgDomain + $scope.basicInfo.taxationRegFile;
                $scope.basicInfo.organizationFile = domainConfig.imgDomain + $scope.basicInfo.organizationFile;
                $scope.basicInfo.openAccountFile = domainConfig.imgDomain + $scope.basicInfo.openAccountFile;

            }
        })
        .error(function(data, status, headers, config) {

        });


    $scope.queryInfo = function() {
        listService.events($scope.url).success(function(data, status, headers) { 
            $scope.basicInfo = data.userCompanyDTO;
        });
    };
    //$scope.queryInfo();


});
