'use strict';

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
    .state('editor.test',{
      url         : '/:retailer/editor/floorplan',
      template    : '<tp-floor-plan></tp-floor-plan>',
      controller  : 'EditorCtrl'
    })
    .state('home',{
      url         : '/',
      templateUrl : "",
      controller  : ""
    });
    $httpProvider.interceptors.push('AttachTokens');
})

// this directive will be for rendering the svg map using d3 and updating it as needed
.directive('tpMap', function($window){
  // define svg constants here, width/height

  var roomHeight = 36;
  var roomWidth = 20;
  var width = $window.innerWidth;
  var height = $window.innerHeight;
  var scale = Math.max(height/roomHeight, width/roomWidth);

  return {
    restrict: 'AE',
    link: function(scope, element, attrs) { // the scope, element, and attrs are those that contain the directive tp-map

      var feetToPixel = function(ft){
        var foot = width/scale;
        return ft*foot;
      };

      // converts coordinates to strings to be used with d3
      var coorsToString = function(coors, convertToPixel){
        var result = '';
        for(var i = 0; i < coors.length; i++){
          var x = coors[i][0];
          var y = coors[i][1];
          if(convertToPixel){
            x = feetToPixel(x);
            y = feetToPixel(y);
          }
          result = result+x+','+y+' ';
        }
        return result;
      };

      // shelf constructor
      var createShelves = function(x,y,w,h){
        return {
          x:feetToPixel(x),
          y:feetToPixel(y),
          width:feetToPixel(w),
          height:feetToPixel(h)
        }
      }

      // appends svg with pre-defined attribtues
      var svg = d3.select(element[0])
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

      // adds floorplan polygon to svg
      var floorplan = svg.append('polygon')
                    .attr('points',coorsToString([
                      [0,0],
                      [20,0],
                      [20,36],
                      [0,36]
                      ],true))
                    .attr('fill','white')
                    .attr('stroke','blue');

      var shelf1 = createShelves(5,0,15,1);
      var shelf2 = createShelves(19,0,1,36);
      var shelf3 = createShelves(5,35,15,1);
      var shelf4 = createShelves(0,9,1,18);
      var shelf5 = createShelves(5,17,10,1);
      var shelf6 = createShelves(5,18,10,1);

      var shelves = [shelf1, shelf2, shelf3, shelf4, shelf5, shelf6];

      svg.selectAll('rect').data(shelves)
         .enter().append('rect')
         .attr('x',function(d){return d.x})
         .attr('y',function(d){return d.y})
         .attr('width',function(d){return d.width})
         .attr('height',function(d){return d.height})
         .attr('stroke','black')
         .attr('fill','red');
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
  //TODO: Code to verify token. Uncomment if any route needs to be authenticated.

  // $rootscope.on($routeChangeStart, function(evt, next, current){
  //   if(next.$$route && next.$$route.userAuth && !Auth.isAuth()){
  //     $location.path('/signin');
  //   } else if(next.$$route && next.$$route.retailerAuth && !Auth.isRetailerAuth()){
  //     $location.path('/signin');
  //   }
  // })


});
