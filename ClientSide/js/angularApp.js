/**
 * Created by Chris on 4/10/2015.
 */

/// CONTROLLER DEFINITIONS

function splashController($scope){
	$scope.hello = "world";
	console.log("splash controller loaded");
}

// todo add more controller definitions here

// APP DEFINITION
var app = angular.module(
	'hackathonApp',
	['ngRoute']
);

/// CONTROLLERS

app.controller('splashController',
[
	'$scope',
	splashController
]);

// todo add more controllers here

/// ROUTING
app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/',{
				templateUrl:'/templates/splash.html',
				controller:'splashController'
			});// todo add more routing here
	}
]);

