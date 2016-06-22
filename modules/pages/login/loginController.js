var app=angular.module('exingcai_captain_web');
app.register.controller('LoginCtrl', function ($scope) {
  $scope.item=0;
  
  $scope.show = function (a) {

    $scope.item=!$scope.item;
    console.log("show");

  };
});