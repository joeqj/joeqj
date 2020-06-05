import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { log } from 'three';

let container = document.getElementById("canvas-element");
let camera, scene, renderer, effect;

let obj, objPivot;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let mouseX = 0;
let mouseY = 0;

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

    scene = new THREE.Scene();

    var light = new THREE.PointLight(0xffffff);
    light.position.set(500, 500, 500);
    scene.add(light);
 
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    effect = new AsciiEffect(renderer, ' .:-+*joeqj=(){}/%@#', { invert: true });
    effect.setSize(container.offsetWidth, container.offsetHeight);
    effect.domElement.style.fontSize = "5";
    var currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        changeTheme(currentTheme);
    } else {
        effect.domElement.style.color = '#999999';
        effect.domElement.style.backgroundColor = '#1e1e1e';
    }
    
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
        objPivot.rotation.y += 0.01;   
    }

    if(scene.children.length > 2) {
        scene.remove(scene.children[1]);
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

    camera.updateProjectionMatrix();

    effect.setSize(container.offsetWidth, container.offsetHeight);
    // renderer.setSize( container.offsetWidth, container.offsetHeight );
}

export const removeObject = (path) => {
    for (let i = 1; i < 10; i++) {
        scene.remove(scene.children[i]);
    }
}

export const addObject = (path, scale) => {
    handleObject(path, scale);
}

export const updateObject = (path, scale) => {
    removeObject(path);
    if (obj) {
        if (obj.name != path) {
            handleObject(path, scale);
        }
    }
}

const handleObject = (path, scale) => {
    let loader = new GLTFLoader();
    loader.load(path, gltf => {
        gltf.scene.scale.set(scale, scale, scale);

        obj = gltf.scene;
        obj.name = String(path);

        gltf.scene.traverse(function(child) {

        });

        let box = new THREE.Box3().setFromObject(obj);
        box.getCenter(obj.position); 
        obj.position.multiplyScalar(- 1);

        // var helper = new THREE.Box3Helper( box, 0xffff00 );
        // scene.add( helper );

        objPivot = new THREE.Group();
        scene.add(objPivot);
        objPivot.add(obj);

        console.log(scene);
        
    },
        (xhr) => {
            // console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
        },
        (error) => {
            console.error('An error occured when trying to load 3d Models', error);
        }
    );    
}