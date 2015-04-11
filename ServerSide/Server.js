//Link dependencies
var express = require('express');
var request = require('request');

//Setup server
var app = express();
app.use(express.static('../ClientSide/'));

//Start web server
var server = app.listen(1337, function() {
    console.log('Hackathon server running on port ' + 1337);
});


//Takes in a link to get the SoundCloud JSON object. Can be either song or playlist.
var soundCloudParser = function(link, callback){
    //For testing
    //var link = "https://soundcloud.com/misanthropnsgnl/phace-misanthrop-sex-sells-friction-bbc-radio-1-premier?in=nawilson9/sets/filth";
    //var link = "https://soundcloud.com/nawilson9/sets/filth";

    //The SoundCloud url to resolve object.
    var requestUrl = "https://api.soundcloud.com/resolve.json?url=" + link + "&client_id=81fad9a6e3aa2a4f6d78589080285728";

    //Makes request to SoundCloud server.
    request(requestUrl, function(error, response, html) {
        if (!error) {
            callback(JSON.parse(html));
        }
    });
};

/*
Websocket stuff
 */

//Start websocket server
var io = require('socket.io').listen(server);

//Socket routes
io.on('connection', function (socket) {
    //User add item to queue
    socket.on('/queueSoundCloudItem', function(link){
        //Callback function
        var callback = function(data){
            //Item returned to user
            var itemInfo = {
                'kind': (data.kind == 'track')? 'tracks' : data.kind,
                'id': data.id
            };

            //Returns the song info to play
            socket.emit('loadSoundCloudItem', itemInfo);
        };
        var item = soundCloudParser(link, callback);
    });
    socket.on('say', function(data){
        // so trash, I'm sorry
        socket.broadcast.emit('hear', data);
        socket.emit('hear', data);
    });
});

