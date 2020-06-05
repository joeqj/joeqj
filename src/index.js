import $ from 'jquery';
import './styles/skeleton.scss';
import './styles/main.scss';

import "./js/three.js";
import { changeTheme, addObject, removeObject, updateObject } from "./js/three.js";
import '../node_modules/waypoints/lib/noframework.waypoints.js';
import "./js/devtools.js";

import offgrid from './assets/models/oganimation.glb';
import julianjaschke from './assets/models/cross.glb';
import todayssupply from './assets/models/globe.glb';
import reification from './assets/models/mutualism.glb';
import radunion from './assets/models/rad.glb';
import trjfp from './assets/models/apple.glb';

let isOpen = false;
let isAlerted = false;

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

	addObject(offgrid, 2);
	// Waypoints
	var projects = document.getElementsByClassName("project");
	for (var i = 0; i < projects.length; i++) {
		if(projects[i].dataset.project) {
			var waypoint = new Waypoint({
				element: projects[i],
				handler: function(direction) {
					if (direction === "down") {
						let scale = this.element.dataset.scale;
						if (this.element.dataset.project == "offgrid") {
							updateObject(offgrid, scale);
						}
						if (this.element.dataset.project == "julianjaschke") {
							updateObject(julianjaschke, scale);
						}
						if (this.element.dataset.project == "todayssupply") {
							updateObject(todayssupply, scale);
						}
						if (this.element.dataset.project == "reification") {
							updateObject(reification, scale);
						}
						if (this.element.dataset.project == "radunion") {
							updateObject(radunion, scale);
						}
						if (this.element.dataset.project == "trjfp") {
							updateObject(trjfp, scale);
						}
					}
				},
				offset: 70 
			});
			var waypoint = new Waypoint({
				element: projects[i],
				handler: function(direction) {
					if (direction === "up") {
						let scale = this.element.dataset.scale;
						if (this.element.dataset.project == "offgrid") {
							updateObject(offgrid, scale);
						}
						if (this.element.dataset.project == "julianjaschke") {
							updateObject(julianjaschke, scale);
						}
						if (this.element.dataset.project == "todayssupply") {
							updateObject(todayssupply, scale);
						}
						if (this.element.dataset.project == "reification") {
							updateObject(reification, scale);
						}
						if (this.element.dataset.project == "radunion") {
							updateObject(radunion, scale);
						}
						if (this.element.dataset.project == "trjfp") {
							updateObject(trjfp, scale);
						}
					}
				},
				offset: -150 
			});
		} else {
			
		}
	}

	$('#theme').on('change', function() {
		if ($(this).val() == "light") {
			document.documentElement.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');
			changeTheme("light");
		} else {
			document.documentElement.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');
			changeTheme("dark");
		}	
	});

	
	const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
	$('#theme').val(currentTheme);

	if (currentTheme) {
		document.documentElement.setAttribute('data-theme', currentTheme);
	}
	  
});

const pushRight = () => {
	if (window.innerWidth < 768) {
		$(".app").css("padding-left", "0px");
	} else {
		$(".app").css("padding-left", window.innerWidth / 20 + "px");
	}
}