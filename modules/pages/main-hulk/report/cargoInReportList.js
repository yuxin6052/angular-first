require('service');

module.exports = {
    url: '/cargoInReportList',
    template: __inline('./cargoInReportList.html'),
     //注意如果开启压缩，应采取此方式注入对象，否则压缩后将找不到
    controller : 'cargoInReportList',
    resolve: {
        loadCtrl: ["$q", function($q) {
            var deferred = $q.defer();
            //异步加载controller／directive/filter/service
            require([
                'cargoInReportList.async'
            ], function() {
              deferred.resolve();
            });
            return deferred.promise;
        }]
    }
};
