'use strict';

angular.module('triumpet', [
  'tp.factories',
  'tp.auth',
  'tp.editor',
  'tp.map',
  'tp.main',
  'ui.router'
])

// configures routes for the app
.config(function($stateProvider, $httpProvider){
  $stateProvider
    .state('auth',{
      template    : '<tp-auth></tp-auth>'
    })
    .state('auth.signup',{
      url         : '/signup',
      template    : '<tp-sign-up></tp-sign-up>',
      controller  : 'AuthCtrl'
    })
    .state('auth.signin',{
      url         : '/signin',
      template    : '<tp-sign-in></tp-sign-in>',
      controller  : 'AuthCtrl'
    })
    .state('auth.retailerSignin',{
      url         : '/retailer/signin',
      template    : '<tp-retailer-signin></tp-retailer-signin>',
      controller  : 'AuthCtrl'
    })
    .state('auth.retailerSignup',{
      url         : '/retailer/signup',
      template    : '<tp-retailer-signup></tp-retailer-signup>',
      controller  : 'AuthCtrl'
    })
    .state('editor',{
      template    : '<tp-editor></tp-editor>',
      controller  : 'EditorCtrl'
    })
    .state('editor.floorplan',{
      url         : '/:retailer/editor/floorplan',
      template    : '<tp-floor-plan></tp-floor-plan>',
      controller  : 'EditorCtrl',
      retailerAuth: true // [Q][Devin] What is this doing??
    })
    .state('map', {
      url: '/map/:retailer',
      template: '<tp-map></tp-map>',
      controller: 'MapCtrl'
    })
    .state('editor.shelves',{
      url         : '/:retailer/editor/shelves',
      template    : '<tp-shelves></tp-shelves>',
      controller  : 'EditorCtrl',
      retailerAuth: true
    })
    .state('editor.items',{
      url         : '/:retailer/editor/items',
      template    : '<tp-items></tp-items>',
      controller  : 'EditorCtrl',
      retailerAuth: true
    })    
    .state('main',{
      url         : '',
      template    : "<tp-main></tp-main>",
      controller  : "MainCtrl"
    });

    
    $httpProvider.interceptors.push('AttachTokens');
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
  //TODO: Code to verify token. Uncomment if any route needs to be authenticated.

  $rootScope.$on('$stateChangeStart', function(evt, next, current) {
    if(next.userAuth && !Auth.isAuth()){
      $location.path('/signin');
    }
    if(next.retailerAuth && !Auth.isRetailerAuth()){
      $location.path('/signin');
    }
  })
});
