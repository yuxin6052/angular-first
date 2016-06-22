require('service');

module.exports = {
    url: '/feeCaculateDtl/:orderFeeId',
    template: __inline('./feeCaculateDtl.html'),
    params : { orderFeeId: null,ownerName:null ,totalFee:null,orderId:null,orderTypeName:null},
     //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'feeCaculateDtl',
    resolve: {
        loadCtrl: ["$q", function($q) { 
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'feeCaculateDtl.async' 
            ], function() { 
              deferred.resolve(); 
            });
            return deferred.promise;
        }]
    }
};