/**
 * Created by Chris on 4/10/2015.
 */

/// CONTROLLER DEFINITIONS

var chatArray = [];
function chatController($scope){
	function Message(name, msg){
		return {name:name,msg:msg};
	}
	// temp debug
	chatArray = [
		Message('hello','world'),
		Message('foo','bar'),
		Message('longcat','The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log. The quick lazy fox jumped over the brown log.')
	];
	// end
	$scope.messages = chatArray;
}

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

function default_registerController(name, cb){
	app.controller(name,
		[
			'$scope',
			cb
		]);
}

default_registerController('splashController', splashController);
default_registerController('chatController', chatController);

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

