let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
let renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geometry = new THREE.BoxGeometry(1, 1, 1);
let geometry2 = new THREE.CircleGeometry(0.5, 100);
let material1 = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  reflectivity: 2,
});
let material2 = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  reflectivity: 2,
});

let cube = new THREE.Mesh(geometry, material1);

let circle = new THREE.Mesh(geometry2, material2);

// Set initial positions
cube.position.set(1, 0, 0); // Change as needed
circle.position.set(-1, 0, 0); // Change as needed

scene.add(cube);
scene.add(circle);
camera.position.z = 5;

let controls = new (function () {
  this.cubeRotationSpeed = 0.02;
  this.cubeColor = "#ffffff";
  this.cubeScale = 1;
  this.cubePositionX = 1;
  this.cubePositionY = 0;
  this.cubePositionZ = 0;
  this.circleRotationSpeed = 0.02;
  this.circleColor = "#ffffff";
  this.circleScale = 1;
  this.circlePositionX = -1;
  this.circlePositionY = 0;
  this.circlePositionZ = 0;
})();

let gui = new dat.GUI();

gui.add(controls, "cubeRotationSpeed", 0, 0.1);
gui.addColor(controls, "cubeColor").onChange(function (colorValue) {
  cube.material.color.set(colorValue);
});
gui.add(controls, "cubeScale", 0.1, 3).onChange(function (scaleValue) {
  cube.scale.set(scaleValue, scaleValue, scaleValue);
});
gui.add(controls, "cubePositionX", -10, 10).onChange(function (xValue) {
  cube.position.x = xValue;
});
gui.add(controls, "cubePositionY", -10, 10).onChange(function (yValue) {
  cube.position.y = yValue;
});
gui.add(controls, "cubePositionZ", -10, 10).onChange(function (zValue) {
  cube.position.z = zValue;
});

gui.add(controls, "circleRotationSpeed", 0, 0.1);
gui.addColor(controls, "circleColor").onChange(function (colorValue) {
  circle.material.color.set(colorValue);
});
gui.add(controls, "circleScale", 0.1, 3).onChange(function (scaleValue) {
  circle.scale.set(scaleValue, scaleValue, scaleValue);
});
gui.add(controls, "circlePositionX", -10, 10).onChange(function (xValue) {
  circle.position.x = xValue;
});
gui.add(controls, "circlePositionY", -10, 10).onChange(function (yValue) {
  circle.position.y = yValue;
});
gui.add(controls, "circlePositionZ", -10, 10).onChange(function (zValue) {
  circle.position.z = zValue;
});

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += controls.cubeRotationSpeed;
  cube.rotation.y += controls.cubeRotationSpeed;
  circle.rotation.x += controls.circleRotationSpeed;
  circle.rotation.y += controls.circleRotationSpeed;
  renderer.render(scene, camera);
}

animate();
