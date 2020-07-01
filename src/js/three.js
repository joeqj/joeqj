import $ from 'jquery';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js';

import joeqj from '../assets/models/joeqj.glb';

const container = document.getElementById("canvas-element");

let camera, renderer, scene;
let light, spotlight;
let obj, objGroup, objMesh, objBox;
let videoBox, videoBoxTexture, videoBoxParameters, videoBoxGeometry, videoBoxMaterial;
let tweenIn, tweenOut, spotlightTweenIn, spotlightTweenOut;

let isZoomed = false;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let windowBreakPoint = 1100;
let mouseX = 0;
let mouseY = 0;
let raycaster, pickingMouse;

export const handleObject = (path, scale) => {
    let loader = new GLTFLoader();
    loader.load(path, gltf => {
        obj = gltf.scene;
        obj.name = String(path);

        objMesh = new THREE.MeshPhongMaterial({ 
            color: 0x2194CE,
            opacity: 0.75,
            transparent: true,
        });

        obj.traverse((o) => {
            if (o.isMesh) o.material = objMesh;
        });

        var box = new THREE.BoxHelper( obj, 0xffff00 );

        objBox = new THREE.Box3().setFromObject(box);
        objBox.getCenter(obj.position); 
        obj.position.multiplyScalar(- 1);

        objGroup = new THREE.Group();
        
        if(scale) {
            objGroup.scale.set(scale, scale, scale);
        } else {
            var size = container.offsetWidth / 1777;
            objGroup.scale.set(size, size, size);
        }
        
        scene.add(objGroup);
        objGroup.add(obj);
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

    spotlight = new THREE.SpotLight( 0xff8787, 1 );
    spotlight.position.set( 15, 200, 35 );
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 1;
    spotlight.decay = 1;
    spotlight.distance = 200;

    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 10;
    spotlight.shadow.camera.far = 200;
    scene.add(spotlight);

    spotlightTweenIn = new TWEEN.Tween(spotlight.position);
    spotlightTweenIn.easing(TWEEN.Easing.Cubic.InOut);

    spotlightTweenOut = new TWEEN.Tween(spotlight.position);
    spotlightTweenOut.easing(TWEEN.Easing.Cubic.InOut);

    handleObject(joeqj);
 
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
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && window.innerWidth > windowBreakPoint) {
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

    raycaster.setFromCamera( pickingMouse, camera );
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        // camera.position.z = 3.6;
        if (window.innerWidth > windowBreakPoint) {
            $('html, body').css('cursor', 'pointer');
        }
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

    renderer.autoClear = true;
    renderer.render(scene, camera);
}

function onWindowResize() {
    windowHalfX = container.offsetWidth / 2;
    windowHalfY = container.offsetHeight / 2;
    camera.updateProjectionMatrix();
    if(objGroup != null) {
        fitCameraToObject(camera, objGroup, 0.5);
    }
    renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function fitCameraToObject( camera, object, offset ) {

    offset = offset || 1.5;
    
    const boundingBox = new THREE.Box3();
    
    boundingBox.setFromObject( object );
    
    const center = boundingBox.getCenter( new THREE.Vector3() );
    const size = boundingBox.getSize( new THREE.Vector3() );
    
    const startDistance = center.distanceTo(camera.position);
    // here we must check if the screen is horizontal or vertical, because camera.fov is
    // based on the vertical direction.
    const endDistance = camera.aspect > 1 ?
                        ((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) :
                        ((size.y/2)+offset) / Math.abs(Math.tan(camera.fov/2)) / camera.aspect ;
    
    
    camera.position.set(
        camera.position.x * endDistance / startDistance,
        camera.position.y * endDistance / startDistance,
        camera.position.z * endDistance / startDistance,
        );
    camera.lookAt(center);
}

export const removeObject = () => {
    if(objGroup != null) {
        scene.remove(objGroup);
        objGroup = null;
    }
    if (videoBox != null) {
        scene.remove(videoBox);
        videoBoxTexture.dispose();
        videoBoxGeometry.dispose();
        videoBoxMaterial.dispose();
        videoBox = null;
    }
}

export const addVideoBox = (video, url) => {
    videoBoxTexture = new THREE.VideoTexture(video);
    videoBoxParameters = { color: 0xffffff, map: videoBoxTexture };
    videoBoxGeometry = new THREE.BoxGeometry(3, 1.75, 3);
    videoBoxMaterial = new THREE.MeshBasicMaterial(videoBoxParameters);
    videoBox = new THREE.Mesh(videoBoxGeometry, videoBoxMaterial);
    videoBox.name = url;
    scene.add(videoBox);    
}