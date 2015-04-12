/**
 * Created by Nick on 4/11/2015.
 */
var soundObject;

//Initializes SoundCloud stuff
var scInit = function(){
    //Authenticates the user
    SC.initialize({
        client_id: '81fad9a6e3aa2a4f6d78589080285728'
    });

    //Monitors for songs to play and plays them
    socket.on('loadSoundCloudItem', function(data){
        SC.stream('/' + data.kind + '/' + data.id, function(sound){
            soundObject = sound;
            soundObject.play({
                onfinish: function() {
                    socket.emit('loadNextSong', 'omfgThisAppSucks');
                }});
        });
    });
};

//Takes in a SoundCloud link and sends it to the server
var queueItem = function(link){
    socket.emit('queueSoundCloudItem', link);
};

//Toggles the mute status of the SoundCloud player
var toggleMute = function() {
    soundObject.toggleMute();
};

//Sets the volume of the SoundCloud player
var setVolume = function(value){
    soundObject.setVolume(value);
}







