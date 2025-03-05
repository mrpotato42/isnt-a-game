import * as CANNON from 'cannon';

export default class Physics {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
  }
}