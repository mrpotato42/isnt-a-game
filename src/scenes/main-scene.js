import * as THREE from 'three';
import * as CANNON from 'cannon';
import Player from '../entities/player.js';
import Physics from '../systems/physics.js';
import Renderer from '../systems/renderer.js';

export default class MainScene extends THREE.Scene {
  constructor() {
    super();

    // Renderizador
    this.renderer = new Renderer();
    document.getElementById('app').appendChild(this.renderer.domElement);

    // Cámara
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-5, 5, 10);
    this.camera.lookAt(0, 2, 0);

    // Luz
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    this.add(light);

    // Físicas
    this.world = new Physics().world;

    // Jugador
    this.player = new Player(this.world);
    this.add(this.player.mesh);

    // Suelo
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    this.add(groundMesh);

    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.world.addBody(groundBody);
  }

  update() {
    this.world.step(1 / 60);
    this.player.update();
  }
}