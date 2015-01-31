angular.module('tp.map',[])

.controller('MapCtrl', function($scope, $http, $stateParams, Map, Item){

  $scope.scale = 15;
  $scope.userLoc;
  $scope.items;
  $scope.selectedItem = '';
  $scope.floorPlan;
  // fetches items from database
  // [refactor] this will need to be moved to a factory and imported into the controller
  $scope.getItems = function(retailer){
    $http.get('/api/items/' + retailer). // this will need to be updated to whatever the actual retailer is...
      success(function(items){
        // console.log(data);
        $scope.items = items;
      }).
      error(function(){
        console.error('[getItems]: could not get items for ' + retailer);
      });
  };

  // [refactor] this will need to be moved to a factory and imported into the controller
  $scope.getMap = function(retailer){
    $http.get('/api/retailers/' + retailer).
      success(function(data){
        $scope.floorPlan = data.floorPlan; // [refactor] we don't actually need to store the floor plan data, we can just render...
        console.log('retailer data: ', data);
      }).
      error(function(){
        console.error('[getMap]: could not get map for retailer - ' + retailer);
      });
  };

  // renders the map on page load
  // this data will be in the form of [{x: 0, y:10}, {x:10, y:20}]
  $scope.renderMap = function(floorplan){

  };

  // renders shelves after rendering the map on page load
  // this data will be in the form of [{x: 0, y:10}, {x:10, y:20}]
  $scope.renderShelves = function(shelves){

  };

  // renders items when user selects an item
  $scope.renderItem = function(item){

  };

  if ($stateParams.retailer) {
    var retailer = $stateParams.retailer;
    Map.fetch($stateParams.retailer)
      .then(function(data){
        $scope.data = data;
        Map.drawFloorPlan($scope.data.floorPlan, $scope.scale, $scope.svg);
        Map.drawShelves($scope.data.shelves, $scope.scale, $scope.svg);
      })
    Item.fetchItems($stateParams.retailer)
      .then(function(items){
        $scope.items = items;
        // Item.drawItems($scope.items, $scope.scale, $scope.svg);
      })
  }

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
  // var addEventListeners = function(scope, element, attrs){
  //   element.bind('click', function(e){
  //     console.log('click event occurred');
  //     addUserToMap(e, scope, element);
  //   });
  // };

  var linker = function(scope, element, attrs) {
    var width  = $window.innerWidth;
    var height = $window.innerHeight;
    
    scope.svg  = 
      d3.select('.map-main').append('svg')
        // .attr('id','map-svg')
        .attr('id', 'user-map')
        .on('click', addUserToMap); // [Question: Should event handler be added here or should we use the directives element.bind]

    // wires up event handlers
    // addEventListeners(scope, element, attrs);

    // var feetToPixel = function(ft){
    //   var foot = width/scale;
    //   return ft*foot;
    // };

    // // converts coordinates to strings to be used with d3
    // var coorsToString = function(coors, convertToPixel){
    //   var result = '';
    //   for(var i = 0; i < coors.length; i++){
    //     var x = coors[i][0];
    //     var y = coors[i][1];
    //     if(convertToPixel){
    //       x = feetToPixel(x);
    //       y = feetToPixel(y);
    //     }
    //     result = result+x+','+y+' ';
    //   }
    //   return result;
    // };

    // // shelf constructor
    // var createShelves = function(x,y,w,h){
    //   return {
    //     x:feetToPixel(x),
    //     y:feetToPixel(y),
    //     width:feetToPixel(w),
    //     height:feetToPixel(h)
    //   }
    // }

    // // appends svg with pre-defined attribtues
    // var svg = d3.select('.map-container')
    //             .append('svg')
    //             .attr('width', feetToPixel(roomWidth))
    //             .attr('height', feetToPixel(roomHeight))
    //             .on('click', addUserToMap); // [Question: Should event handler be added here or should we use the directives element.bind]

    // // caches the scope element and makes it available on the parent scope of the ctrl
    // scope.svg = d3.select('svg');

    // // adds floorplan polygon to svg
    // var floorplan = svg.append('polygon')
    //               .attr('points',coorsToString([
    //                 [0,0],
    //                 [20,0],
    //                 [20,36],
    //                 [0,36]
    //                 ],true))
    //               .attr('fill','white');

    // var shelf1 = createShelves(5,0,15,1);
    // var shelf2 = createShelves(19,0,1,36);
    // var shelf3 = createShelves(5,35,15,1);
    // var shelf4 = createShelves(0,9,1,18);
    // var shelf5 = createShelves(5,17,10,1);
    // var shelf6 = createShelves(5,18,10,1);

    // var shelves = [shelf1, shelf2, shelf3, shelf4, shelf5, shelf6];

    // svg.selectAll('rect').data(shelves)
    //    .enter().append('rect')
    //    .attr('x',function(d){return d.x})
    //    .attr('y',function(d){return d.y})
    //    .attr('width',function(d){return d.width})
    //    .attr('height',function(d){return d.height})
    //    .attr('fill','#bbb');
  };

  return {
    restrict: 'AE',
    link: linker,
    templateUrl: '../app/map/map.html', // not sure if this is the correct relative path? (don't understand why we are going up a level?)
    scope: false,
    replace: true
  };

})

