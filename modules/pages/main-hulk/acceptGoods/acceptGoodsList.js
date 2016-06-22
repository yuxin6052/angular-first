require('service');

module.exports = {
    url: '/acceptGoodsList',
    template: __inline('./acceptGoodsList.html'),
     //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'acceptGoodsList',
    resolve: {
        loadCtrl: ["$q", function($q) { 
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'acceptGoodsList.async' 
            ], function() { 
              deferred.resolve(); 
            });
            return deferred.promise;
        }]
    }
};