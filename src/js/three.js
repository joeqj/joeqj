import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import gltfPath from '../assets/models/Cross/cross.glb';

let container = document.getElementById("canvas-element");
let camera, scene, renderer, effect;

let obj;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let mouseX = 0;
let mouseY = 0;

init();

function init() {
    camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    scene = new THREE.Scene();

    var light = new THREE.PointLight(0xffffff);
    light.position.set(500, 500, 500);
    scene.add(light);

    var light = new THREE.PointLight(0xffffff, 0.75);
    light.position.set(-500, -500, -500);
    scene.add(light);

    // obj = new THREE.Mesh( new THREE.SphereBufferGeometry( 2, 32, 32 ), new THREE.MeshPhongMaterial( { flatShading: true } ) );

    const loader = new GLTFLoader();
    loader.load(gltfPath, gltf => {
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.geometry.center(); // center here
            }
        });

        gltf.scene.scale.set(1.5, 1.5, 1.5); // scale here
        obj = gltf.scene;

        scene.add(obj);
        },
        (xhr) => {
            console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
        },
        (error) => {
            console.error('An error happened', error);
        },
    );

    // scene.add( obj );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    effect = new AsciiEffect(renderer, ' .:-+*joeqj joeqj joeqj joeqj joeqj joeqj joeqj joeqj joeqj=%@#', { invert: true });
    effect.setSize(container.offsetWidth, container.offsetHeight);
    effect.domElement.style.color = '#dddddd';
    effect.domElement.style.backgroundColor = '#1e1e1e';

    container.appendChild(effect.domElement);
    // container.appendChild(renderer.domElement);

    animate();

    // Events
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY) * 0.3;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var time = Date.now() * 0.00005;

    if (obj) {
        obj.rotation.y += 0.01;
    }

    camera.position.x += (mouseX / 300 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY / 50 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    effect.render(scene, camera);
    // renderer.render( scene, camera );
}

function onWindowResize() {
    windowHalfX = container.offsetWidth / 2;
    windowHalfY = container.offsetHeight / 2;

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( container.offsetWidth, container.offsetHeight );
    effect.setSize(window.innerWidth, window.innerHeight);
}