//Link dependencies
var express = require('express');

//Setup server
var app = express();
app.use(express.static('../ClientSide/'));

//Start web server
var server = app.listen(1337, function() {
    console.log('Hackathon server running on port ' + 1337);
});

/*
Express routes
 */
//server.get('/nah, function(req, res){};

/*
Websocket stuff
 */

//Start websocket server
var io = require('socket.io').listen(server);

//Socket routes
io.on('connection', function (socket) {
    socket.emit('noob', "rick");


	socket.on('say', function(data){
		// so trash, I'm sorry
		socket.broadcast.emit('hear', data);
		socket.emit('hear', data);
	});
});