angular.module('tp.auth',[])

.controller('AuthCtrl', function($scope, $window, $location, Auth){
	//Create a user, invoke on click
	$scope.create = function(){
		var newUser = {
			username  : $scope.username,
			password  : $scope.password,
			firstName : $scope.firstName,
			lastName  : $scope.lastName,
			email     : $scope.email
		}
		Auth.signup(newUser)
		  .then(function(token){
		  	//Save token and username to localStorage when sign up is successful
		  	$window.localStorage.setItem('com.triumpet.token',token);
		  	$window.localStorage.setItem('com.triumpet.username',newUser.username);
		  	//TODO: add location.path to direct to main page
		  	$scope.message = 'Success';
		  	$scope.username = '';
		  	$scope.password = '';
		  	$scope.firstName = '';
		  	$scope.lastName = '';
		  	$scope.email = '';
		  })
		  .catch(function(error){
		  	$scope.message = 'Please re-try';
		  	$scope.username = '';
		  	$scope.password = '';
		  	$scope.firstName = '';
		  	$scope.lastName = '';
		  	$scope.email = '';
		  })
	}
})

.directive('tpSignUp',function(){
	return {
		restrict: 'EA',
		scope: '=',
		replace: true,
		templateUrl:'../app/auth/signup.html',
		link: function(scope, el, attr){
		}
	}
})
