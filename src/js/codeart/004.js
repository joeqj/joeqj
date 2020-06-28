import * as THREE from 'three';

const container = document.getElementById("codeArt");
let amount = 50;
let sceneArray = [];
let cubeArray = [];
let lightArray = [];
let opacity = 0.075;

let codeArtrenderer, codeArtcamera, codeArtanimation;

export const codeArt004 = () => {
  codeArtcamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);

  for (let i = 0; i < amount; i++) {
    sceneArray[i] = new THREE.Scene();

    var light = new THREE.AmbientLight(0x999999);
    sceneArray[i].add(light);
    lightArray[i] = new THREE.DirectionalLight(0xffffff, 0.85);
    sceneArray[i].add(lightArray[i]);

    let geometry = new THREE.BoxGeometry(container.offsetHeight / 1000, container.offsetHeight / 1000, container.offsetHeight / 1000);
    geometry.verticesNeedUpdate = true;
    let material = new THREE.MeshPhongMaterial({
      color: 0x2194CE,
      opacity: opacity,
      transparent: true });

    opacity += 0.001;
    cubeArray[i] = new THREE.Mesh(geometry, material);
    sceneArray[i].add(cubeArray[i]);
  }

  codeArtrenderer = new THREE.WebGLRenderer();
  codeArtrenderer.setClearColor(0x1e1e1e);
  codeArtrenderer.domElement.id = "004";
  codeArtrenderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(codeArtrenderer.domElement);

  codeArtcamera.position.z = 17.95;

  let animateCodeArt = function () {
    codeArtanimation = requestAnimationFrame(animateCodeArt);
    codeArtrenderer.autoClear = true;
  
    for (let i = 0; i < amount; i++) {
      cubeArray[i].rotation.x += 0.0025;
      cubeArray[i].rotation.y += i / 750;    
      cubeArray[i].position.z = i / 3;
      lightArray[i].position.set(i / 100, 0, i * 100);
      codeArtrenderer.render(sceneArray[i], codeArtcamera);
      codeArtrenderer.autoClear = false;
    }
  };
  animateCodeArt();
}

export const removeCodeArt004 = () => {
  amount = 50;
  sceneArray = [];
  cubeArray = [];
  lightArray = [];
  opacity = 0.075;
  codeArtrenderer = null;
  codeArtcamera = null;
  cancelAnimationFrame(codeArtanimation);  
}
