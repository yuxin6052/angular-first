  var exingcai_captain_web = angular.module('exingcai_captain_web');

  function captainInterceptor() {

      this.config = {
          securityToken: 'Security-Token',
          rejectedApis: []
      };

      this.$get = ['$log', '$cookieStore', '$q', '$location', function($log, $cookieStore, $q, $location) {
          var self = this;
          return {
              request: function(request) {
                  var security = $cookieStore.get(self.config.securityToken);
                  request.headers["Security-Token"] = JSON.stringify(security);
                  return request;
              },
              requestError: function(error) {
                  return $q.reject(error);
              },
              response: function(response) {
                  if (response.headers) {
                      var headers = response.headers();
                      var security = $cookieStore.get(self.config.securityToken);
                      if (security) {
                          security = headers[self.config.securityToken];
                      }
                  }
                  return response;
              },
              responseError: function(response) {
                  if (response.status == 401 ) {
                      if ((typeof $location.port()) === 'number') {
                          window.location.href = 'http://' + $location.host() + ':' + $location.port() + "/login";
                      } else {
                          window.location.href = 'http://' + $location.host() + "/login";
                      }
                  } else if (response.status === 404) {
                      alert("找不到页面");
                  } else if (response.status === 405) {
                      alert("方法错误 请检查POST GET PUT ");
                  } else if (response.status === 500) {
                      alert("系统内部错误");
                  }
                  return $q.reject(response);
              }
          };
      }];
  }

  exingcai_captain_web.provider('captainInterceptor', captainInterceptor);

  exingcai_captain_web.config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('captainInterceptor');
  }]);
