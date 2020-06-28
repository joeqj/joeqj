import $ from 'jquery';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';

import joeqj from '../assets/models/joeqj.glb';

let container = document.getElementById("canvas-element");
let camera, scene, renderer, effect;
let tweenIn, tweenOut;

let obj, objPivot, light;
let videoBox;

let isZoomed = false;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let mouseX = 0;
let mouseY = 0;
let raycaster, pickingMouse;

export const handleObject = (path, scale) => {
    let loader = new GLTFLoader();
    loader.load(path, gltf => {
        gltf.scene.scale.set(scale, scale, scale);

        obj = gltf.scene;
        obj.name = String(path);

        var mesh = new THREE.MeshPhongMaterial({ 
            color: 0x2194CE,
            opacity: 0.75,
            transparent: true,
        });

        obj.traverse((o) => {
            if (o.isMesh) o.material = mesh;
        });

        let box = new THREE.Box3().setFromObject(obj);
        box.getCenter(obj.position); 
        obj.position.multiplyScalar(- 1);
        objPivot = new THREE.Group();
        scene.add(objPivot);
        objPivot.add(obj);
    },
        (xhr) => {
            // console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
        },
        (error) => {
            console.error('An error occured when trying to load 3d Model', error);
        }
    );    
}

export const changeTheme = (theme) => {
    if (!theme) {
        var currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    } else {
        
    }
    if (theme === "dark") {
        effect.domElement.style.color = '#999999';
        effect.domElement.style.backgroundColor = '#1e1e1e';
    } else {
        effect.domElement.style.color = '#222222';
        effect.domElement.style.backgroundColor = '#ffffff';
    }
}

init();

function init() {
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    tweenIn = new TWEEN.Tween(camera.position);
    tweenIn.easing(TWEEN.Easing.Cubic.Out);

    tweenOut = new TWEEN.Tween(camera.position);
    tweenOut.easing(TWEEN.Easing.Cubic.In);
    

    scene = new THREE.Scene();

    light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(light);

    handleObject(joeqj, 0.65);
 
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    raycaster = new THREE.Raycaster();
    pickingMouse = new THREE.Vector2();

    container.appendChild(renderer.domElement);

    animate();

    // Events
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    window.addEventListener('resize', onWindowResize, false);   
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY) * 0.3;

    pickingMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1.3;
	pickingMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseDown(event) {
    var intersects = raycaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        window.open(intersects[0].object.name, '_blank');        
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
    TWEEN.update();
}

function render() {
    var time = Date.now() * 0.00005;

    if(scene.children.length > 2) {
        scene.remove(scene.children[1]);
    }

    raycaster.setFromCamera( pickingMouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if (intersects.length > 0) {
        // camera.position.z = 3.6;
        $('html, body').css('cursor', 'pointer');
        if(isZoomed === false) {
            tweenIn.to({z: 3.6}, 420)
            .start()
            .onComplete(function() {
                isZoomed = !isZoomed;                
            });
        }
    } else {
        $('html, body').css('cursor', 'default');
        if(isZoomed === true) {
            tweenOut.to({z: 5}, 250)
            .start()
            .onComplete(function() {
                isZoomed = !isZoomed;
            });
        }
    }

    camera.position.x += (mouseX / 300 - camera.position.x) * 0.1;
    camera.position.y += (-mouseY / 50 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render( scene, camera );
}

function onWindowResize() {
    windowHalfX = container.offsetWidth / 2;
    windowHalfY = container.offsetHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
}

export const removeObject = () => {
    scene.remove(objPivot);
    scene.remove(videoBox);
}

export const addVideoBox = (video, url) => {
    let texture = new THREE.VideoTexture(video);
    let parameters = { color: 0xffffff, map: texture };
    let geometry = new THREE.BoxGeometry(3, 1.75, 3);
    let material = new THREE.MeshBasicMaterial(parameters);
    videoBox = new THREE.Mesh(geometry, material);
    videoBox.name = url;
    scene.add(videoBox);    
}