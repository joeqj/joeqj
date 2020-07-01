import $ from 'jquery';

import './styles/main.scss';

import "./js/three.js";
import { handleObject, removeObject, addVideoBox, spotLightIn, spotLightOut } from "./js/three.js";

import { codeArt004, removeCodeArt004 } from "./js/codeart/004.js";
import { codeArt005, removeCodeArt005 } from "./js/codeart/005.js";

import 'waypoints/lib/noframework.waypoints.js';
// import "./js/devtools.js";

import joeqj from './assets/models/joeqj.glb';

let modelArray = {
	"joeqj": joeqj
};

let modelQueue = [];

let isOpen = false;
let isAlerted = false;

window.mobileCheck = function() {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

$(document).ready(function() {

	// Devtools
    window.addEventListener('devtoolschange', event => {
		isOpen = !isOpen;
		if (isOpen === true && isAlerted === false) {
			$("#devtools-msg").fadeIn(1000, function() {
				var that = this;
				setTimeout(function() {
					$(that).fadeOut(1000);
				}, 500);
			})
			isAlerted = true;
		} else {
			isAlerted = false;
		}
	});

	// Waypoint
	var music = document.getElementsByClassName("music");
	for (var i = 0; i < music.length; i++) {
		var waypoint = new Waypoint({
			element: music[i],
			handler: function(direction) {
				if (direction == 'down') {					
					if ($(".projects .title.active").length > 0) {
						removeObject();
						handleObject(joeqj);
						$(".projects .title.active").toggleClass("active").next(".info").toggleClass("visible").slideToggle();
					}
				}
			},
			offset: 125 
		});
	}

	// Projects Accordion
	$(".projects .title").on("click", function() {
		$(this).toggleClass("active").next(".info").toggleClass("visible").slideToggle();
		$(".main .title").not($(this)).removeClass("active");
		$(".projects .title").not($(this)).next().removeClass("visible").slideUp();

		if ($("#canvas-element #codeArt").find("canvas").length > 0) {
			var id = $("#canvas-element #codeArt").find("canvas").attr("id");
			switch (id) {
				case "004":
					removeCodeArt004();
					$("#canvas-element #codeArt").find("canvas").remove();
					break;
				case "005":
					removeCodeArt005();
					$("#canvas-element #codeArt").find("canvas").remove();
					break;
			}			
		}

		removeObject();

		var video = $(this).next(".visible").find("video");

		if($(this).hasClass("active")) {
			if (video) {
				video[0].play();
				removeObject();
				var url = video.data("url");
				addVideoBox(video[0], url);	
			}
		} else {
			removeObject();
			handleObject(joeqj);
		}
	});

	$("#privacy, .privacy .wrap").on("click", function(event) {
		if (event.target === this) {
			event.preventDefault();
			$(".privacy").toggleClass("visible");
		}		
	})

	// Code Art
	$(".codeart .title").on("click", function() {
		$(".main .title").not($(this)).removeClass("active");
		$(".projects .title").not($(this)).next().removeClass("visible").slideUp();	
		if ($("#canvas-element #codeArt").find("canvas").length > 0) {
			var id = $("#canvas-element #codeArt").find("canvas").attr("id");
			switch (id) {
				case "004":
					removeCodeArt004();
					$("#canvas-element #codeArt").find("canvas").remove();
					break;
				case "005":
					removeCodeArt005();
					$("#canvas-element #codeArt").find("canvas").remove();
					break;
			}			
		}
		if($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
			if ($(this).data("art")) {
				switch($(this).data("art")) {
					case "004":
						codeArt004();
						break;
					case "005":
						codeArt005();
						break;
				}
				removeObject();
				handleObject(joeqj);
			}
		}
	});
});