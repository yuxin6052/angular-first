require('service');

module.exports = {
    url: '/deliverList',
    template: __inline('./deliverList.html'),
     //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'DeliverList',
    resolve: {
        loadCtrl: ["$q", function($q) { 
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'deliverList.async' 
            ], function() { 
              deferred.resolve(); 
            });
            return deferred.promise;
        }]
    }
};