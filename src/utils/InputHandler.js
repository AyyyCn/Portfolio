import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class InputHandler {
  constructor(camera, target) {
    this.controls = new OrbitControls(camera, document.body);
    this.controls.target.copy(target.position);
    this.controls.enableDamping = true;
    this.controls.enablePan = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 30;
  }
  update() {
    this.controls.update();
  }
}