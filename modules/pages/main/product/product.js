// module.exports = {
//     url: '/product',
//     template: __inline('./product.html'),
//     //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
//     // controller : ["$scope","$injector","$http",function($scope, $injector, $http) {
//     //     //支持异步加载controller
//     //     require.async('/modules/pages/cualusers/cualusers.async.js', function(ctrl) {
//     //         $injector.invoke(ctrl, this, {'$scope': $scope, '$http': $http});
//     //     });
//     // }]
// };
 module.exports = {
    url: '/product',
    template: __inline('./product.html'),
       resolve: {
        loadCtrl: ["$q", function($q) { 
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'product.async' 
            ], function() { 
              deferred.resolve(); 
            });
            return deferred.promise;
        }]
    }
};