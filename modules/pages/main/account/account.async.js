var app = angular.module('exingcai_captain_web');


app.register.controller('account', function($scope, $uibModal, $cookieStore, $http, $stateParams, listService, domainConfig) {


    $scope.account = {
        "oldPwd": "",
        "newPwd": "",
        'newPwd1': ""

    };
    $scope.person = $cookieStore.get("person");

    $scope.url = domainConfig.witchDomain + "witch/userbase/changepwd";

    $scope.modifyAccount = function() {
        if ($scope.account.oldPwd ==""){
            alert("请输入原密码");return ;
        }
        if ($scope.account.newPwd ==""){
            alert("请输入新密码");return ;
        }
        if ($scope.account.newPwd1 ==""){
            alert("请输入确认密码");return ;
        }
        if ($scope.account.newPwd != $scope.account.newPwd1) {
            alert("确认确认密码与新密码不一致");
            return ;
        }

        $http({
                method: 'PUT',
                url: $scope.url,
                data: JSON.stringify($scope.account), // pass in data as strings
                headers: { 'Content-Type': 'application/json;charset=UTF-8' } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                console.log(data);
              
                if (data.success) {
                      toastr['success']('修改成功！', '提示');
                } else {
                     toastr['success'](data.msg, '提示');

                }
            })
            .error(function(data, status, headers, config) {
                console.log(data);

            });

        // listService.events($scope.url).success(function(data, status, headers) { 
        //   console.log("修改密码成功")
        // });
    };


});
