import $ from "jquery";
import * as SC from "soundcloud";

let isPlaying = false;
let audio;

SC.initialize({
	client_id: '95120076095e4ba1b85141eb6cc034bf'
});

// stream track id 293
SC.get('/users/1483840/tracks').then(function(tracks){
	console.table(tracks);
});

$('.soundcloud-player .controls .play').on('click', function() {
    if($(this).hasClass("pause")) {
        pause();
    } 
    else if (!$(this).hasClass("pause") && $(this).hasClass("running")) {
        play();
    }
    else {
        // Get Track ID
        let id = $(this).data('id');


        // Stream Track
        SC.stream('/tracks/533443446').then(function(player){
            startAudio(player);
        });
    }

	$(this).toggleClass('pause');    
  });
  
let startAudio = function(player) {
    audio = player;
    audio.play().then(function(){
        isPlaying = true;
    }).catch(function(e){
      
    });
}

let pause = function() {
    console.log("pause");
    audio.pause();
}

let play = function() {
    console.log("pause");
    audio.play();
}