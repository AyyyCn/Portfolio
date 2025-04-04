import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export function Lighting(scene, tier = 'high') {
  const sunLight = new THREE.DirectionalLight(0xffd1a4, tier === 'low' ? 1 : 1.5);
  sunLight.position.set(-5, 10, -5);
  sunLight.castShadow = tier !== 'low';

  if (tier !== 'low') {
    const res = tier === 'high' ? 2048 : 1024;
    sunLight.shadow.mapSize.width = res;
    sunLight.shadow.mapSize.height = res;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
  }

  scene.add(sunLight);
}

