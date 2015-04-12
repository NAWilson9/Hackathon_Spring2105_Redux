/**
 * Created by Chris on 4/10/2015.
 */

/// CONTROLLER DEFINITIONS
function chatController($scope){
	function updateSteamInfo(){
		socket.emit('steamInfo', $scope.steamID);
	}
	socket.on('steamInfoReturn', function(data){
		data = JSON.parse(data);
		var url = data.response.players[0].avatar;
		var name = data.response.players[0].personaname;
		$scope.avatarUrl = url?url:"";
		$scope.username = name?name:"Anon";
		$scope.$apply();
	});

	$scope.$watch('steamID', function(){
		updateSteamInfo();
	});

	function Message(name, avatar, msg){
		return {name:name, avatar:avatar, msg:msg};
	}
	$scope.messages = [];
	$scope.username = 'Inigo Montoya';
	$scope.steamID = "";

	var oldname = $scope.username;

	$scope.sendChat = function(){
		var cmsg = $scope.chatMessage;
		if(cmsg.length < 1){
			return;
		}

		var msg = Message($scope.username, $scope.avatarUrl, cmsg);
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
	//$scope.playerNames = playerNames;
	socket.on("updateOnlineNames", function(listStr){
		$scope.playerNames = JSON.parse(listStr);
		$scope.$apply();
	});
}

function gameStatisticsController($scope){
	socket.on("updateGameTallies", function(listStr){
		$scope.gameData = JSON.parse(listStr);
	});
}


function musicController($scope){
	// todo
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
default_registerController('gameStatisticsController', gameStatisticsController);
default_registerController('musicController', musicController);

// todo add more controllers here

/// ROUTING
app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/',{
				templateUrl:'/templates/splash.html',
				controller:'splashController'
			}).when('/music',{
				templateUrl:'/templates/music.html',
				controller:'musicController'
			}
			).when('/chart',{
				templateUrl:'/templates/chart.html',
				controller:'gameStatisticsController'
			});// todo add more routing here
	}
]);

