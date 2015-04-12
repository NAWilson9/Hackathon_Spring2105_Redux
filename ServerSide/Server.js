//Link dependencies
var express = require('express');
var request = require('request');

//Setup server
var app = express();
app.use(express.static('../ClientSide/'));
var songQueue = [];

//Start web server
var server = app.listen(1337, function () {
    console.log('Hackathon server running on port ' + 1337);
});


//Takes in a link to get the SoundCloud JSON object. Can be either song or playlist.
var soundCloudParser = function (link, callback) {
    //For testing
    //var link = "https://soundcloud.com/misanthropnsgnl/phace-misanthrop-sex-sells-friction-bbc-radio-1-premier?in=nawilson9/sets/filth";
    //var link = "https://soundcloud.com/nawilson9/sets/filth";

    //The SoundCloud url to resolve object.
    var requestUrl = "https://api.soundcloud.com/resolve.json?url=" + link + "&client_id=81fad9a6e3aa2a4f6d78589080285728";

    //Makes request to SoundCloud server.
    request(requestUrl, function (error, response, html) {
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

var connection_map = {};

//Socket routes
io.on('connection', function (socket) {
    var random;
    var count = 0;
    while (!random || connection_map[random]) {
        random = Math.random() * (2e20 - 1);
        count++;
        if (count > 50) {
            console.error("IT BROKE, GEE GEE!");
            return;
        }
    }

    // init

	getGameTallies(function(data){
		socket.emit('updateGameTallies',data);
	});
	socket.emit('updateOnlineNames',JSON.stringify(getOnlineNames()));

    //User add item to queue
    socket.on('/queueSoundCloudItem', function (link) {
        //Callback function
        var callback = function (data) {
            //Song object factory
            var songFactory = function(song) {
                //Song items returned to user
                var itemInfo = {
                    'kind': 'tracks',
                    'id': song.id,
                    'title': song.title,
                    'user': song.user.username,
                    'artwork':song.artwork_url
                };
                //Add song to queue
                songQueue.push(itemInfo);
            };
            //If object is a playlist, need to extract each song.
            if(data.kind == 'playlist'){
                for(var i = 0; i < data.tracks.length; i++) {
                    songFactory(data.tracks[i]);
                }
            } else {
                songFactory(data);
            }
            //Check for automatic startup
            if (songQueue.length == 1) {
                socket.broadcast.emit('loadSoundCloudItem', songQueue[0]);
                socket.emit('loadSoundCloudItem', songQueue[0]);
            }
        };
        soundCloudParser(link, callback);
    });

    //Is hit when a song finishes playing. Returns the next song
    socket.on('loadNextSong', function () {
        //Checks if the request originates form the localhost
        if (socket.request.headers.host == "localhost:1337") {
            //Removes the first (previously played) song
            songQueue.push(songQueue.shift());
        }
        //Returns the info of the next song to play
        socket.broadcast.emit('loadSoundCloudItem', songQueue[0]);
        socket.emit('loadSoundCloudItem', songQueue[0]);
    });

    socket.on('say', function (data) {
        // so trash, I'm sorry
        socket.broadcast.emit('hear', data);
        socket.emit('hear', data);
    });

	function getOnlineIds(){
		var list = [];
		for(var key in connection_map){
			if(connection_map.hasOwnProperty(key)){
				var el = connection_map[key];
				if(el){
					list.push(el.id);
				}
			}
		}
		return list;
	}

	function getOnlineNames(){
		var list = [];
		for(var key in connection_map){
			if(connection_map.hasOwnProperty(key)){
				var el = connection_map[key];
				if(el){
					list.push(el.name);
				}
			}
		}
		return list;
	}

	function getGameTallies(cb){
		var list = getOnlineIds();
		var map = {};
		var count = 0;
		var len = list.length;
		for(var i=0;i<len;i++){
			var id = list[i];
			var url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=46E787DD72E329DAA831E4422883B5DE&include_played_free_games=1&format=json&include_appinfo=1&steamid="+id;
			request(url, function(err, res, html){
				if(html.indexOf("<")==0){
					return;
				}
				var json = JSON.parse(html);
				var games = json.response.games;
				if(games){
					for (var j = 0; j < games.length; j++){
						var name = games[j].name;
						if (map[name]){
							map[name]++;
						}
						else{
							map[name] = 1;
						}
					}
				}

				//console.log("Getting number "+count+" out of "+len);
				count++;
				if(count == len){
					//console.log("Finished");
					cb(JSON.stringify(map));
				}
			});

		}
	}
	
    socket.on('steamInfo', function (data) {
        var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=46E787DD72E329DAA831E4422883B5DE&steamids=" + data;

        request(url, function (error, response, html) {
            try {
                // 76561198044825221
				var json = JSON.parse(html).response.players[0];
                var id = json.steamid;
				var name = json.personaname;

                connection_map[random] = {
					id:id,
					name:name
				};

				var str = JSON.stringify(getOnlineNames());
                socket.broadcast.emit('updateOnlineNames', str);
                socket.emit('updateOnlineNames', str);
                getGameTallies(function (data) {
                    socket.broadcast.emit('updateGameTallies', data);
                    socket.emit('updateGameTallies', data);
                });
            }
            catch (ignored) {
            }
            socket.emit('steamInfoReturn', html);
        });
    });

    socket.on('disconnect', function () {
        connection_map[random] = null;
    });

});

