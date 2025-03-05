import * as THREE from 'three';
import * as CANNON from 'cannon';

// Escena Three.js
const scene = new THREE.Scene();

// Mundo Cannon.js
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravedad (en m/s²)

// Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-5, 5, 10);
camera.lookAt(0, 0, 0);

// Luz (opcional, para ver mejor los objetos)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Crear un plano (suelo)
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2; // Rotar el plano para que esté horizontal
scene.add(groundMesh);

// Crear un cuerpo físico para el suelo
const groundBody = new CANNON.Body({
  mass: 0, // Masa 0 = objeto estático
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Rotar el plano físico
world.addBody(groundBody);

// Crear una esfera (objeto que cae)
const sphereGeometry = new THREE.SphereGeometry(2, 8, 8);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 5, 0); // Posición inicial
scene.add(sphereMesh);

// Crear un cuerpo físico para la esfera
const sphereBody = new CANNON.Body({
  mass: 1, // Masa > 0 para que sea afectada por la gravedad
  shape: new CANNON.Sphere(1.8), // Radio de 1
});
sphereBody.position.set(0, 5, 0); // Posición inicial
world.addBody(sphereBody);

// Variables para controlar el movimiento
const forceStrength = 10; // Fuerza aplicada al mover la esfera
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

// Capturar eventos de teclado
window.addEventListener('keydown', (event) => {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
});

// Función para aplicar fuerzas según las teclas presionadas
function applyForces() {
  if (keys.ArrowUp) {
    sphereBody.applyForce(new CANNON.Vec3(0, 0, -forceStrength), sphereBody.position);
  }
  if (keys.ArrowDown) {
    sphereBody.applyForce(new CANNON.Vec3(0, 0, forceStrength), sphereBody.position);
  }
  if (keys.ArrowLeft) {
    sphereBody.applyForce(new CANNON.Vec3(-forceStrength, 0, 0), sphereBody.position);
  }
  if (keys.ArrowRight) {
    sphereBody.applyForce(new CANNON.Vec3(forceStrength, 0, 0), sphereBody.position);
  }
}

// Bucle de animación
function animate() {
  requestAnimationFrame(animate);

  // Aplicar fuerzas según las teclas presionadas
  applyForces();

  // Actualizar el mundo físico (simulación)
  world.step(1 / 60); // Paso de simulación (60 FPS)

  // Sincronizar los objetos visuales con los cuerpos físicos
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  // Renderizar la escena
  renderer.render(scene, camera);
}
animate();

// Manejo de redimensionamiento de ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});