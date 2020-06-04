import $ from 'jquery';
import './styles/skeleton.scss';
import './styles/main.scss';

import "./js/three.js";
import '../node_modules/waypoints/lib/noframework.waypoints.js';
import "./js/devtools.js";


let isOpen = false;
let isAlerted = false;
let video;

$(document).ready(function() {
	// Resizing
	pushRight();
	window.addEventListener('resize', pushRight);

	// Devtools
    window.addEventListener('devtoolschange', event => {
		console.log('Is DevTools open:', event.detail.isOpen);
		isOpen = !isOpen;
		console.log('DevTools orientation:', event.detail.orientation);

		if (isOpen === true && isAlerted === false) {
			console.log("cheers");
			isAlerted = true;
		} else {
			isAlerted = false;
		}
	});

	// Three JS Video
	video = document.getElementById('video');

	// Waypoints
	var projects = document.getElementsByClassName("project");
	for (var i = 0; i < projects.length; i++) {
		if(projects[i].dataset.title) {
			console.log(projects[i].dataset.title);
			var waypoint = new Waypoint({
				element: projects[i],
				handler: function(direction) {
					console.log(this.element.dataset.title + ' hit');
				},
				offset: 70 
			});
		}
	}

	$('#theme').on('change', function() {
		if ($(this).val() == "light") {
			$('body').addClass("light");
		} else {
			$('body').removeClass("light");
		}
		
	})
	  
});

const pushRight = () => {
	if (window.innerWidth < 768) {
		$(".app").css("padding-left", "0px");
	} else {
		$(".app").css("padding-left", window.innerWidth / 20 + "px");
	}
}