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
    templateUrl: 'statics/modules/pages/main/common/driverList.tpl.html',
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
    templateUrl: 'statics/modules/pages/main/common/productList.tpl.html',
    controller: function($scope, $element){
      
    },
    link: function(scope, el, attr) {
      
    }
  }
})