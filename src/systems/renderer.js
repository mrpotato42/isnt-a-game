import * as THREE from 'three';

export default class Renderer extends THREE.WebGLRenderer {
  constructor() {
    super();
    this.setSize(window.innerWidth, window.innerHeight);
  }
}