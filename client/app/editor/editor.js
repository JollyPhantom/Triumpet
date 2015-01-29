angular.module('tp.editor',[])

.controller('EditorCtrl', function($scope, $stateParams, $http, Map){
  $scope.data = {};
  $scope.scale = 1.5;

  $scope.fetch = function(username){
    $http({
      method: 'GET',
      url: '/api/retailers/'+username
    })
    .then(function(retailer){
      $scope.data = retailer.data;
      $scope.drawFloorPlan();
    });
  };

  $scope.getFloorPlanString = function(){
   // converts coordinates to strings to be used with d3
    var coors = $scope.data.floorPlan;
    var result = '';
    for(var i = 0; i < coors.length; i++){
      var x = coors[i].x*$scope.scale;
      var y = coors[i].y*$scope.scale;
      result = result+x+','+y+' ';
    }
    return result;
  };

  $scope.drawFloorPlan = function(){
    var fp = $scope.svg.selectAll('polygon').data([0]);
    fp.enter().append('polygon');
    fp.attr('points',$scope.getFloorPlanString())
      .attr('fill','white')
      .attr('stroke','blue');
  };

  $scope.updateFloorPlan = function(){
    Map.update($scope.data.username, {floorPlan:$scope.data.floorPlan});
  };

  $scope.deleteFloorPlan = function(index){
    $scope.data.floorPlan.splice(index,1);
    Map.update($scope.data.username, {floorPlan:$scope.data.floorPlan});
  };

  $scope.fetch($stateParams.retailer);
  // $scope.device = navigator.userAgent;
})

//Editor
.directive('tpEditor',function($window){
  return {
    restrict: 'EA',
    scope: false,
    replace: true,
    templateUrl:'../app/editor/editor.html',
    link: function(scope, el, attr){
      var width = $window.innerWidth;
      var height = $window.innerHeight;
      scope.svg = d3.select('#map-main').append('svg')
        .attr('id','map-svg')
    }
  }
})

//Floor Plan
.directive('tpFloorPlan',function($window){
  return {
    restrict: 'EA',
    scope: false,
    templateUrl:'../app/editor/floorplan.html',
    link: function(scope, el, attr){
      var width = $window.innerWidth;
      var height = $window.innerHeight;
      scope.svg.on('click',function(){
          var x = d3.mouse(this)[0]/scope.scale;
          var y = d3.mouse(this)[1]/scope.scale;
          scope.coor = {
            x:x,
            y:y
          };
          scope.data.floorPlan.push({
            x:x,
            y:y
          });
          scope.drawFloorPlan();
          scope.$apply();
        });
    }
  }
})