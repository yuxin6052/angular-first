var app=angular.module('exingcai_captain_web');
app.register.controller('ModalDemoCtrl1', function ($scope, $uibModal, $log,$http,$stateParams,domainConfig) {
	var productId=$stateParams.productId;

	$scope.product={
		productName:"",
		productType:"",
		productMode:"",
		productStandard:"",
		productOrigin:""

	};
	 $scope.message = "";
	 //exingcai/captain/product/save
    $scope.addProduct = function(){
    //把数据存入数据库   
    $scope.message = "提交成功,欢迎您!";
    
    $http({
                method  : 'put',
                url     : domainConfig.dispatchDomain + 'exingcai/cualuser/put',
                data    : {},  // pass in data as strings
                headers : { 'Content-Type': 'application/json;charset=UTF-8' }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function(data) {
                    console.log(data);
                    if (!data.success) {
                    } else {
                    }
                })
                 .error(function(data, status, headers, config) {
                 	console.log(data);
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
                 alert("login success");
                
  }



	
})