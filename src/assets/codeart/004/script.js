let amount = 50;
let sceneArray = [];
let cubeArray = [];
let lightArray = [];
let opacity = 0.075;
let options = {
  shape: new THREE.BoxGeometry() };


let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let mouseX = 0;
let mouseY = 0;

let camera, renderer, material;

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  for (let i = 0; i < amount; i++) {
    sceneArray[i] = new THREE.Scene();

    var light = new THREE.AmbientLight(0x999999);
    sceneArray[i].add(light);
    lightArray[i] = new THREE.DirectionalLight(0xffffff, 0.85);
    sceneArray[i].add(lightArray[i]);

    geometry = options.shape;
    geometry.verticesNeedUpdate = true;
    material = new THREE.MeshPhongMaterial({
      color: 0x2194CE,
      opacity: opacity,
      transparent: true });

    opacity += 0.001;
    cubeArray[i] = new THREE.Mesh(geometry, material);
    sceneArray[i].add(cubeArray[i]);
  }


  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 17.75;
}

init();

let animate = function () {
  requestAnimationFrame(animate);
  renderer.autoClear = true;

  for (let i = 0; i < amount; i++) {
    cubeArray[i].rotation.x += 0.0025;
    cubeArray[i].rotation.y += i / 750;

    cubeArray[i].position.x = 1 / amount;
    cubeArray[i].position.z = i / 3;

    lightArray[i].position.set(i / 100, 0, i * 100);

    renderer.render(sceneArray[i], camera);
    renderer.autoClear = false;
  }
};

animate();

// GUI Controls
// var gui = new dat.GUI();
// let shapeSelect = gui.add(options, 'shape', { 
//   Square: new THREE.BoxGeometry(), 
//   Sphere: new THREE.SphereGeometry()
// }).name('Shape');

// shapeSelect.onChange(function (value) {
//     changeShape();
// });