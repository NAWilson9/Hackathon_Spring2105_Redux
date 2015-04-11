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
	$scope.messages = [];

	//$scope.username = "Inigo Montoya";
	//$scope.chatMessage = "";

	$scope.sendChat = function(){
		var name = $scope.username;
		var cmsg = $scope.chatMessage;
		if(cmsg.length < 1){
			return;
		}

		var msg = Message(name, cmsg);
		socket.emit("say", JSON.stringify(msg));
		$scope.chatMessage = "";
	};

	socket.on("hear", function(data){
		$scope.messages.unshift(JSON.parse(data));
		$scope.$apply();
	});
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

