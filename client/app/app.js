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
      controller  : 'EditorCtrl',
      retailerAuth: true
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

  var dragmove = function(d) {
    var x = d3.event.x;
    var y = d3.event.y;
    console.log(this);
    d3.select(this).attr('cx',x).attr('cy', y);
  };

  var drag = d3.behavior.drag()
    .on("drag", dragmove);


  var addUserToMap = function(event, scope, element){
    // Ignore the click event if it was suppressed
    if (d3.event.defaultPrevented) return;
    
    // if there already is a user don't add another..
    if (d3.selectAll('circle')[0].length > 0) return;

    // Extract the click location
    var point = d3.mouse(this), 
    p = {x: point[0], y: point[1] };

    // grabs svg element from the parent element
    var svg = d3.select('svg');
    
    console.log('circle placed @', p.x, p.y);
    // Append a new point
    svg.append('circle')
      .data([{x: p.x, y: p.y}])
      .attr('r', 10)
      .attr('cx', function(d){return d.x})
      .attr('cy', function(d){return d.y})
      // .on('click', function(d){
      //   console.log('d', d);
      // });
      .call(drag);
  };

  // function to be called in linker which binds all event handlers to the element
  // how do we integrate d3's and angulars eventing systems??
  var addEventListeners = function(scope, element, attrs){
    element.bind('click', function(e){
      console.log('click event occurred');
      addUserToMap(e, scope, element);
    });
  };

  var linker = function(scope, element, attrs) {

    // wires up event handlers
    // addEventListeners(scope, element, attrs);

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
                .attr('width', feetToPixel(roomWidth))
                .attr('height', feetToPixel(roomHeight))
                .on('click', addUserToMap); // [Question: Should event handler be added here or should we use the directives element.bind]

    // adds floorplan polygon to svg
    var floorplan = svg.append('polygon')
                  .attr('points',coorsToString([
                    [0,0],
                    [20,0],
                    [20,36],
                    [0,36]
                    ],true))
                  .attr('fill','white');

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
       .attr('fill','#bbb');
  };

  return {
    restrict: 'AE',
    link: linker
  };

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
