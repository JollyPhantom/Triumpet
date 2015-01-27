'ues strict';

angular.module('triumpet', [
  'tp.factories',
  'tp.auth',
  'tp.editor',
  'tp.map',
  'ui.router'
])

// configures routes for the app
.config(function($stateProvider, $httpProvider){
  $stateProvider
    .state('signup',{
      url         : '/signup',
      template    : '<tp-sign-up></tp-sign-up>',
      controller  : 'AuthCtrl'
    })
    .state('home',{
      url         : '/',
      templateUrl : "",
      controller  : ""
    });

    $httpProvider.interceptors.push('AttachTokens');
})

// this directive will be for rendering the svg map using d3 and updating it as needed
.directive('tpMapViz', function(){
  // define svg constants here, width/height 
  return {
    restrict: 'AE',
    link: function(scope, element, attrs) {

    }
  }
})

.factory('AttachTokens',function($window){
  var attach = {
    request: function(object){
      var jwt = $window.localStorage.getItem('com.triumpet.token');
      if(jwt){
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function($rootScope, $location, Auth){
  //TODO: Code to verify token. Uncomment after signin page is complete.

  // $rootscope.on($routeChangeStart, function(evt, next, current){
  //   if(next.$$route && next.$$route.authenticate && !Auth.isAuth()){
  //     $location.path('/signin');
  //   }
  // })
})
