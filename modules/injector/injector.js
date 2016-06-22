var captainService = angular.module('exingcai_captain_web');
// captainService.factory('sessionInjector', function($cookieStore) {
//   var sessionInjector = {
//     request: function(config) {
//       //if (!SessionService.isAnonymus) {
//         config.headers['x-session-token'] = $cookieStore.get('person').uuid;
//         console.log("injectors!");
//      // }
//       return config;
//     }
//   };
//   return sessionInjector;
// });
// captainService.config(['$httpProvider', function($httpProvider) {
//   $httpProvider.interceptors.push('sessionInjector');
// }]);