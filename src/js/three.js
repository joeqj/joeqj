import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import joeqj from '../assets/models/joeqj.glb';

let container = document.getElementById("canvas-element");
let camera, scene, renderer, effect, interaction;

let obj, objPivot;
let videoBox;
let light, pointLight;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let mouseX = 0;
let mouseY = 0;

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

        // var helper = new THREE.Box3Helper( box, 0xffff00 );
        // scene.add( helper );

        objPivot = new THREE.Group();
        scene.add(objPivot);
        objPivot.add(obj);
    },
        (xhr) => {
            // console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
        },
        (error) => {
            console.error('An error occured when trying to load 3d Models', error);
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

    scene = new THREE.Scene();

    light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add(light);

    handleObject(joeqj, 0.65);
 
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    container.appendChild(renderer.domElement);

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

    if(scene.children.length > 2) {
        scene.remove(scene.children[1]);
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

export const addVideoBox = (video) => {
    let texture = new THREE.VideoTexture(video);
    let parameters = { color: 0xffffff, map: texture };
    let geometry = new THREE.BoxGeometry(3, 1.75, 3);
    let material = new THREE.MeshBasicMaterial(parameters);
    videoBox = new THREE.Mesh(geometry, material);
    scene.add(videoBox);    
}