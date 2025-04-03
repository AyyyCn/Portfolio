import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export function Lighting(scene, renderer) {


  // Directional light for stronger shadows
  const sunLight = new THREE.DirectionalLight(0xffd1a4, 1.5); // warm sunset color
  sunLight.position.set(-5, 10, -5);
  sunLight.castShadow = true;
  
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -20;
  sunLight.shadow.camera.right = 20;
  sunLight.shadow.camera.top = 20;
  sunLight.shadow.camera.bottom = -20;
  sunLight.shadow.bias = -0.0005;
sunLight.shadow.normalBias = 0.02;

  scene.add(sunLight);
// couleur plus subtile
//scene.fog = new THREE.Fog(0xffe6d0, 200, 300); 


  //scene.add(dirLight);
}
