import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class InputHandler {
  constructor(camera, position, domElement) {
    this.controls = new OrbitControls(camera, domElement); // ✅ Use canvas not body
    this.controls.autoRotate = false;
    this.controls.target.copy(position);
    this.controls.enableDamping = true;
    this.controls.enablePan = true;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 15;
  }

  update() {
    this.controls.update();
  }
}
