var captainService = angular.module('exingcai_captain_web');




captainService.config(function ($provide) {

  $provide.factory('listService', function ($http, $rootScope) {

    var doRequest = function (url, params) {
      if (params&&!params.warehouseId) {
        params.warehouseId = $rootScope.warehouseId;
      } else if(!params) {
        params = { warehouseId: $rootScope.warehouseId };
      }
      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'text/plain'
        },
        params: params

      });
    };
    var sessionService = function ($cookieStore) {
      return {
        token: $cookieStore.get("person").uuid
      }
    };




    var pager = {
      "currentPage": 1,
      "maxSize": 5
    };



    return {
      events: function (url, params) { return doRequest(url, params); },
      sessionService: sessionService,
      pager: pager
    };



  });

  $provide.factory('formService', function ($http, $rootScope) {

    var doRequest = function (method, url, data, params) {
      if (params) {
        params.warehouseId = $rootScope.warehouseId;
      } else {
        params = { warehouseId: $rootScope.warehouseId };
      }

      return $http({
        method: method,
        url: url,
        data: JSON.stringify(data),  // pass in data as strings
        params: params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    };

    return {
      post: function (url, data, params) { return doRequest('post', url, data, params); },
      put: function (url, data, params) { return doRequest('put', url, data, params); }
    };

  });
});



  // $provide.value('listService', function(){

  //     var doRequest = function(username, path) {
  //     return $http({
  //       method: 'GET',
  //       url: 'http://localhost:9000/exingcai/captain/product/findAll'
  //     });
  //   }
  //   return {
  //     events: function(url) { return doRequest(username, 'events'); },
  //   };



  // });
