import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import offGcenterPath from '../assets/models/og.glb';
import julianPath from '../assets/models/cross.glb';
import globePath from '../assets/models/globe.glb';
import mutualismPath from '../assets/models/mutualism.glb';
import radPath from '../assets/models/rad.glb';
import applePath from '../assets/models/apple.glb';

let container = document.getElementById("canvas-element");
let camera, scene, renderer, effect;

let og, ogPivot;
let cross, crossPivot;
let globe, globePivot;
let mutualism, mutualismPivot;
let rad, radPivot;
let apple, applePivot;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let mouseX = 0;
let mouseY = 0;

const changeTheme = (theme) => {
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
 
    var light = new THREE.PointLight(0xffffff, 0.75);
    light.position.set(-500, -500, -500);
    scene.add(light);

    // obj = new THREE.Mesh( new THREE.SphereBufferGeometry( 2, 32, 32 ), new THREE.MeshPhongMaterial( { flatShading: true } ) );
    // scene.add( obj );

    // const loader = new GLTFLoader();
    // loader.load(julianPath, gltf => {
    //     gltf.scene.scale.set(1.5, 1.5, 1.5); // scale here
    //     cross = gltf.scene;
    //     gltf.scene.traverse(function(child) { });

    //     var box = new THREE.Box3().setFromObject( cross );
    //     box.center( cross.position ); 
    //     cross.position.multiplyScalar( - 1 );

    //     crossPivot = new THREE.Group();
    //     scene.add( crossPivot );
    //     crossPivot.add( cross );
    // },
    //     (xhr) => {
    //         console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
    //     },
    //     (error) => {
    //         console.error('An error happened', error);
    //     }
    // );
    
    // const ogLoader = new GLTFLoader();
    // ogLoader.load(offGcenterPath, gltf => {
    //     gltf.scene.scale.set(2, 2, 2); // scale here
    //     og = gltf.scene;
    //     gltf.scene.traverse(function(child) { });

    //     var box = new THREE.Box3().setFromObject( og );
    //     box.center( og.position ); 
    //     og.position.multiplyScalar( - 1 );

    //     ogPivot = new THREE.Group();
    //     scene.add( ogPivot );
    //     ogPivot.add( og );
    // },
    //     (xhr) => {
    //         console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
    //     },
    //     (error) => {
    //         console.error('An error happened', error);
    //     }
    // );

    // const globeLoader = new GLTFLoader();
    // globeLoader.load(globePath, gltf => {
    //     gltf.scene.scale.set(3.5, 3.5, 3.5); // scale here
    //     globe = gltf.scene;
    //     gltf.scene.traverse(function(child) { });

    //     var box = new THREE.Box3().setFromObject( globe );
    //     box.center( globe.position ); 
    //     globe.position.multiplyScalar( - 1 );

    //     globePivot = new THREE.Group();
    //     scene.add( globePivot );
    //     globePivot.add( globe );
    // },
    //     (xhr) => {
    //         console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
    //     },
    //     (error) => {
    //         console.error('An error happened', error);
    //     }
    // );

    // const radLoader = new GLTFLoader();
    // radLoader.load(radPath, gltf => {
    //     gltf.scene.scale.set(3, 3, 3); // scale here
    //     rad = gltf.scene;
    //     gltf.scene.traverse(function(child) { });

    //     var box = new THREE.Box3().setFromObject( rad );
    //     box.center( rad.position ); 
    //     rad.position.multiplyScalar( - 1 );

    //     radPivot = new THREE.Group();
    //     scene.add( radPivot );
    //     radPivot.add( rad );
    // },
    //     (xhr) => {
    //         console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
    //     },
    //     (error) => {
    //         console.error('An error happened', error);
    //     }
    // );

    const appleLoader = new GLTFLoader();
    appleLoader.load(applePath, gltf => {
        gltf.scene.scale.set(0.085, 0.085, 0.085); // scale here
        apple = gltf.scene;
        gltf.scene.traverse(function(child) { });

        var box = new THREE.Box3().setFromObject( apple );
        box.center( apple.position ); 
        apple.position.multiplyScalar( - 1 );

        applePivot = new THREE.Group();
        scene.add( applePivot );
        applePivot.add( apple );
    },
        (xhr) => {
            console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
        },
        (error) => {
            console.error('An error happened', error);
        }
    );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    effect = new AsciiEffect(renderer, ' .:-+*joeqj=%@#', { invert: true });
    effect.setSize(container.offsetWidth, container.offsetHeight);
    
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

    // if (obj) {
    //     obj.rotation.y += 0.01;
    // }

    if (crossPivot) {
        crossPivot.rotation.y += 0.01;
    }

    if (ogPivot) {
        ogPivot.rotation.y += 0.01;
    }

    if (globePivot) {
        globePivot.rotation.y += 0.01;
    }

    if (mutualismPivot) {
        mutualismPivot.rotation.y += 0.01;
    }

    if (radPivot) {
        radPivot.rotation.y += 0.01;
    }

    if (apple) {
        apple.rotation.y += 0.01;
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

    // renderer.setSize( container.offsetWidth, container.offsetHeight );
    effect.setSize(window.innerWidth, window.innerHeight);
}

export default changeTheme;