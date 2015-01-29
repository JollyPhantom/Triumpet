angular.module('tp.map',[])

.controller('MapCtrl', function($scope, $http){
  $scope.serverSettings = serverSettings = {
    // this will need to be updated to be production ready
    url: 'http://localhost:8080'
  };
  $scope.userLoc;
  $scope.items;

  //needs to be able to fetch the items from the database and cache them in items
  $scope.getItems = function(){
    $http.get(serverSettings.url + '/api/items/:retailer'). // this will need to be updated to whatever the actual retailer is...
      success(function(data, status){
        $scope.items = data;
      }).
      error(function(data, status){
        console.error('[Error]: While Attempting to Fetch Items');
      });
  };

  $scope.addUserToMap = function(event){
    // firefox/chrome event properties differ??
    
  };

});

