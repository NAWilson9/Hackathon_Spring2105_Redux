//Link dependencies
var express = require('express');
//var bodyParser = require('body-parser');
var fs = require("fs");

//Create server
var path = require('path');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);
server.use(express.static('../ClientSide/'));

//Start server
server.listen(1337, function() {
    console.log('Hackathon server running on port ' + 1337);
});
