//Main app factories
var app = angular.module('trumpet', []);


// configures routes for the app
app.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: "",
    controller: ""
  });
});


// app.config(function($routeProvider){
//   $routeProvider.when("/",
//     {
//       templateUrl: "app.html",
//       controller: "AppCtrl"
//     }
//   );
// });

