angular.module('tp.map',[])

.controller('MapCtrl', function($scope, $http, $stateParams, Map, Item){
  // makes properties on scope/map/item accessible within html
  angular.extend($scope, Map, Item);

  $scope.scale =  14.5;
  $scope.userLoc;
  $scope.items;
  $scope.selectedItem = '';
  $scope.floorPlan;

  // fetches items from database
  // [refactor] this will need to be moved to a factory and imported into the controller
  // $scope.getItems = function(retailer){
  //   $http.get('/api/items/' + retailer). // this will need to be updated to whatever the actual retailer is...
  //     success(function(items){
  //       $scope.items = items;
  //     }).
  //     error(function(){
  //       console.error('[getItems]: could not get items for ' + retailer);
  //     });
  // };
  $scope.drawItem = function(d){
    $scope.drawItems([$scope.selectedItem],$scope.scale, $scope.svg, false);
  }

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

  if ($stateParams.retailer) {
    var retailer = $stateParams.retailer;
    Map.fetch($stateParams.retailer)
      .then(function(data){
        console.log('retailer data', data);
        $scope.data = data;
        Map.drawFloorPlan($scope.data.floorPlan, $scope.scale, $scope.svg);
        Map.drawShelves($scope.data.shelves, $scope.scale, $scope.svg);
      })
    Item.fetchItems($stateParams.retailer)
      .then(function(items){
        $scope.items = items;
        console.log(items);
      })
  }
})

// this directive will be for rendering the svg map using d3 and updating it as needed
.directive('tpMap', function($window){

  // Defines linker function to be referenced in the directives return object
  var linker = function(scope, element, attrs) {
    // appends SVG
    scope.svg  = 
      d3.select('.map-main').append('svg')
        .attr('id', 'user-map')
        .attr('width', 30 * scope.scale + 'px' ) // [Warning]: 30 is a hardcoded width for this particular map, this is has to be changed to accomodate different maps
        .attr('height', 20 * scope.scale + 'px') // [Warning]: 20 is a hardcoded height for this particular map, this is has to be changed to accomodate different maps
        .on('click', addUserToMap); // [Note]: We are using d3 to handle this event, not angular
 
    // defines the drag behavior
    var drag = d3.behavior.drag()
      .on("drag", dragmove);

    // for readability
    function updateUserLoc(userLoc){
      scope.userLoc = userLoc;
    };

    // callback to be invoked on the 'drag' event
    function dragmove(d) {
      var x = d3.event.x;
      var y = d3.event.y;
      d3.select(this).attr('cx',x).attr('cy', y);
      updateUserLoc({x:x, y:y});
    };

    // adds user circle to the map
    function addUserToMap(event, scope, element){
      // Ignore the click event if it was suppressed
      if (d3.event.defaultPrevented) return;
      
      // if there already is a user don't add another..
      if (d3.selectAll('.user')[0].length > 0) return;

      // Extract the click location
      var point = d3.mouse(this), 
      p = {x: point[0], y: point[1] };

      // grabs svg element from the parent element
      var svg = d3.select('svg');
      
      // Append a new point
      svg.append('circle')
        .data([{x: p.x, y: p.y}])
        .attr('r', 10)
        .attr('cx', function(d){return d.x})
        .attr('cy', function(d){return d.y})
        .attr('class', 'user')
        .call(drag);

      updateUserLoc(p);
    };
  };

  return {
    restrict: 'AE',
    link: linker,
    templateUrl: '../app/map/map.html', // not sure if this is the correct relative path? (don't understand why we are going up a level?)
    scope: false,
    replace: true
  };

});

