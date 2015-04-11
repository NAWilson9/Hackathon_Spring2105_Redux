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
            soundObject.start();
        });
    })
};

//Takes in a SoundCloud link and sends it to the server
var queueItem = function(link){
    socket.emit('/queueSoundCloudItem', link);
};

//Controls the SoundCloud player
var mediaControl = function(command) {
    switch(command){
        case 'play':
            soundObject.play();
            break;
        case 'pause':
            soundObject.pause();
            break;
        case 'stop':
            soundObject.stop();
            break;
        /*case 'next':
            soundObject.next();
            break;
        case 'previous':
            soundObject.previous();
            break;*/
    }
};





