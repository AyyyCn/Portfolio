import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export class BaseIsland {
  constructor({ name, model, animations = [], position = new THREE.Vector3(0, 0, 0) },mainHub) {
    this.name = name;
    // Clone the model so multiple islands don’t share skeleton data
    if(model!==null)
    {this.mesh = SkeletonUtils.clone(model);
    this.mesh.position.copy(position);

    // Animation mixer if we have animations
    this.mixer = null;
    if (animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.mesh);
      animations.forEach((clip) => {
        // Example: automatically play all clips or filter by name
        const action = this.mixer.clipAction(clip);
        action.play();
      });}
    }
  }

  addTo(scene) {
    scene.add(this.mesh);
  }

  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}
