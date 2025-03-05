import * as THREE from 'three';
import * as CANNON from 'cannon';

export default class Player {
  constructor(world) {
    this.world = world;

    // Mesh de Three.js
    this.geometry = new THREE.SphereGeometry(2, 8, 8);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 5, 0);

    // Cuerpo físico de Cannon.js
    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(1.8),
    });
    this.body.position.set(0, 5, 0);
    this.world.addBody(this.body);

    // Controles
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    // Configurar eventos de teclado
    this.setupControls();
  }

  setupControls() {
    // Capturar eventos de teclado
    window.addEventListener('keydown', (event) => {
      if (this.keys.hasOwnProperty(event.key)) {
        this.keys[event.key] = true;
      }
    });

    window.addEventListener('keyup', (event) => {
      if (this.keys.hasOwnProperty(event.key)) {
        this.keys[event.key] = false;
      }
    });
  }

  applyForces() {
    const forceStrength = 5; // Fuerza aplicada al mover la esfera

    if (this.keys.ArrowUp) {
      this.body.applyForce(new CANNON.Vec3(0, 0, -forceStrength), this.body.position);
    }
    if (this.keys.ArrowDown) {
      this.body.applyForce(new CANNON.Vec3(0, 0, forceStrength), this.body.position);
    }
    if (this.keys.ArrowLeft) {
      this.body.applyForce(new CANNON.Vec3(-forceStrength, 0, 0), this.body.position);
    }
    if (this.keys.ArrowRight) {
      this.body.applyForce(new CANNON.Vec3(forceStrength, 0, 0), this.body.position);
    }
  }

  update() {
    // Aplicar fuerzas según las teclas presionadas
    this.applyForces();

    // Sincronizar el mesh con el cuerpo físico
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}