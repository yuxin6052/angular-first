var app = angular.module('exingcai_captain_web');


app.register.controller('ModalDemoCtrl', function($scope, $uibModal, $log, $http, $injector, listService, pagerConfig,domainConfig) {
    console.log("aa");
    $scope.productList = [];
   

    $scope.url = domainConfig.dispatchDomain + "exingcai/captain/product/findAll";
    $scope.currentPage = pagerConfig.currentPage;
    $scope.firstInit = true;
    $scope.maxSize = pagerConfig.maxSize;

    $scope.queryProdoct = function() {
        listService.events($scope.url).success(function(data, status, headers) {           
            $scope.productList = data.data;
            if ($scope.firstInit) {
                $scope.totalItems = data.data.length;
                $scope.firstInit = false;
            }


                    
        });

    };
$scope.queryProdoct();

    // $scope.queryProdoct=function(){
    //  $http.get('http://localhost:9000/exingcai/captain/product/findAll').success(function (data, status, headers, config) {
    //        $scope.productList = data.data;
    //        $scope.totalItems=data.data.length;

    //  $scope.currentPage = 1;
    //  $scope.maxSize = 5;
    //    }).error(function (data, status, headers, config) {
    //        $scope.errorMessage = "Can't retrieve cualuser list!";
    //    });

    // };


    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log("pageChanged");
        $scope.queryProdoct();

    };




    $scope.deleteProduct = function(index) {
        $scope.productList.splice(index, 1);
        $http.put('http://192.168.20.114:9000/exingcai/captain/product/findAll' + id).success(function(data, status, headers, config) {
            $scope.product = data;
        }).error(function(data, status, headers, config) {
            $scope.errorMessage = "Can't del product!";
        });
    };
    //queryProdoct();


    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function(size) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function() {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function() {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});






// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.register.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, items) {
    $scope.change = function(x) {
        console.log(x);
        alert("ok");
    }

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function() {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});
