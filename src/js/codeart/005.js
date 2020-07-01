import * as THREE from 'three';

const container = document.getElementById("codeArt");

let amount = 50;
let sceneArray = [];
let cubeArray = [];
let lightArray = [];
let opacity = 0.075;

let codeArtrenderer, codeArtcamera, codeArtanimation;

let windowHalfX005 = window.innerWidth / 2;
let windowHalfY005 = window.innerHeight / 2;
let mouseX005 = 0;
let mouseY005 = 0;

let geometry005, material005;

export const codeArt005 = () => {
    codeArtcamera = new THREE.PerspectiveCamera(-75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    codeArtcamera.position.z = 18.95;

    for(let i = 0; i < amount; i++) {
    sceneArray[i] = new THREE.Scene();
    
    var light = new THREE.AmbientLight(0x999999);
    sceneArray[i].add(light);
    lightArray[i] = new THREE.DirectionalLight(0xffffff, 0.85);
    sceneArray[i].add(lightArray[i]);
    
    geometry005 = new THREE.TorusGeometry();
    material005 = new THREE.MeshPhongMaterial({ 
        color: 0x00d62f,
        opacity: opacity,
        transparent: true,
    });
    
    opacity += 0.001;

    cubeArray[i] = new THREE.Mesh(geometry005, material005);
    sceneArray[i].add(cubeArray[i]);
    }

    codeArtrenderer = new THREE.WebGLRenderer();
    codeArtrenderer.setSize(container.offsetWidth, container.offsetHeight);
    codeArtrenderer.setClearColor(0x1e1e1e);
    codeArtrenderer.domElement.id = "005";
    container.appendChild(codeArtrenderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    function onDocumentMouseMove(event) {
        mouseX005 = (event.clientX - windowHalfX005);
        mouseY005 = (event.clientY - windowHalfY005) * 0.3;        
    }

    let animateCodeArt = function () {        
        codeArtanimation = requestAnimationFrame(animateCodeArt);
        codeArtrenderer.autoClear = true;

        for(let i = 0; i < amount; i++) {      
            cubeArray[i].position.x = 1 / amount;
            cubeArray[i].position.z = i / 3;
            lightArray[i].position.set(i / 100, 0, i * 100);
            codeArtrenderer.render(sceneArray[i], codeArtcamera);
            codeArtrenderer.autoClear = false;
        }
  
        codeArtcamera.position.x += (mouseX005 / 1000 - codeArtcamera.position.x) * 1.995;
        codeArtcamera.position.y += (-mouseY005 / 400 - codeArtcamera.position.y) * 1.05;
        codeArtcamera.lookAt(sceneArray[0].position);
    };
    animateCodeArt();
}

export const removeCodeArt005 = () => {
    amount = 50;
    sceneArray = [];
    cubeArray = [];
    lightArray = [];
    opacity = 0.075;
    codeArtrenderer = null;
    codeArtcamera = null;
    geometry005.dispose();
    material005.dispose();
    cancelAnimationFrame(codeArtanimation);
  }