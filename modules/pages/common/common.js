var app = angular.module('exingcai_captain_web');
/*
app.run(function($templateCache) {
  $templateCache.put('directiveList.html', '');
});
*/
var scripts = document.getElementsByTagName("script")
var currentScriptPath = scripts[scripts.length-1].src;

app.directive('driverTable', function() {
  return {
    scope:{
      driverList:'='
    },
    restrict: 'AE',
    template: __inline('./driverList.tpl.html'),
    controller: function($scope, $element){

    },
    link: function(scope, el, attr) {

    }
  }
})

app.directive('productTable', function() {
  return {
    scope:{
      productList:'='
    },
    restrict: 'AE',
    template: __inline('./productList.tpl.html'),
    controller: function($scope, $element){

    },
    link: function(scope, el, attr) {

    }
  }
})

app.directive('downFile', ['$http',function ($http) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            var ele = $(element);
            ele.on('click', function (e) {
                ele.prop('disabled', true);
                e.preventDefault();
                $http({
                    url: attr.downFile,
                    method: 'get',
                    responseType: 'arraybuffer'
                }).success(function (data, status, headers) {
                    ele.prop('disabled', false);
                    var type;
                    switch (attr.downFileType) {
                        case 'xlsx':
                            type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                            break;
                    }
                    if (!type) throw '无效类型';
                    saveAs(new Blob([data], { type: type }), decodeURI(attr.fileName));  // 中文乱码
                }).error(function (data, status) {
                    alert(data);
                    ele.prop('disabled', false);
                });
            });
        }
    };
}]);
