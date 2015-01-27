angular.module('tp.factories',[])

.factory('Map', function($http){

})

.factory('Auth',function($http, $location, $window){
	var auth = {};

	auth.signin = function(){

	};

	auth.signup = function(user){
		return $http({
			method: 'POST',
			url: '/api/users/signup',
			data: user
		})
		.then(function(resp){
			return resp.data.token;
		})
	};

	auth.isAuth = function(){

	};

	auth.signout = function(){

	};

	return auth;

})