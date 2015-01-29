angular.module('tp.factories',[])

.factory('Map', function($http){
	var map = {};

	map.update = function(username,data){
		return $http({
			method: 'PUT',
			url:'/api/retailers/'+username,
			data: data
		});
	};

	return map;
})

.factory('Auth',function($http, $location, $window){
	var auth = {};

	auth.signin = function(login){
		return $http({
			method: 'POST',
			url: '/api/users/signin',
			data: login
		})
		.then(function(resp){
			return resp.data.token;
		});
	};

	auth.signinRetailer = function(login){
		return $http({
			method: 'POST',
			url: '/api/retailers/signin',
			data: login
		})
		.then(function(resp){
			return resp.data.token;
		});
	};

	auth.signup = function(user){
		return $http({
			method: 'POST',
			url: '/api/users/signup',
			data: user
		})
		.then(function(resp){
			return resp.data.token;
		});
	};

	auth.signupRetailer = function(retailer){
		return $http({
			method: 'POST',
			url: '/api/retailers/signup',
			data: retailer
		})
		.then(function(resp){
			return resp.data.token;
		});
	};

	auth.isAuth = function(){
		return !!$window.localStroage.getItem('com.triumpet.token') && !!$window.localStroage.getItem('com.triumpet.username');
	};

	auth.isRetailerAuth = function(){
		return !!$window.localStroage.getItem('retailer.triumpet.token') && !!$window.localStroage.getItem('retailer.triumpet.username');
	};

	auth.signout = function(){
		$window.localStorage.removeItem('com.triumpet.token');
		$window.localStorage.removeItem('com.triumpet.username');
		$window.localStorage.removeItem('retailer.triumpet.token');
		$window.localStorage.removeItem('retailer.triumpet.username');
		//TODO: enter a redirect route
	};

	return auth;
})
