require('service');

module.exports = {
    url: '/deliverDt/:deliveryId',
    template: __inline('./deliverDt.html'),
    params : { delivery:null },
     //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'DeliverDt',
    resolve: {
        loadCtrl: ["$q", function($q) { 
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'deliverDt.async' 
            ], function() { 
              deferred.resolve(); 
            });
            return deferred.promise;
        }]
    }
};