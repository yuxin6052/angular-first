var scope = ['$scope','$http','listService',function($scope, $http,listService) {

console.log("aaa");

    $http.defaults.useXDomain = true;

    $scope.users = [];

    $http.get('http://127.0.0.1:9000/exingcai/cualuser').success(function (data, status, headers, config, domainConfig) {
        $scope.users = data;
    }).error(function (data, status, headers, config) {
        $scope.errorMessage = "Can't retrieve cualuser list!";
    });



$scope.productList = [];
   
    $scope.alink = "index.productAdd";
     $scope.url = domainConfig.dispatchDomain + "exingcai/captain/product/findAll";
 
    listService.events($scope.url).success(function(data, status, headers) { 
                 $scope.productList = data.data;
             });
   
}];

return scope;