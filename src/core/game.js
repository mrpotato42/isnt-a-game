import MainScene from '../scenes/main-scene.js';

export default class Game {
  constructor() {
    this.scene = new MainScene();
    this.renderer = this.scene.renderer;
    this.camera = this.scene.camera;
    this.world = this.scene.world;
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.scene.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}