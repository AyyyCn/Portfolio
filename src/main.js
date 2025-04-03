import { SceneManager } from './utils/SceneManager.js';
import { MainScene } from './scenes/MainScene.js';
import * as THREE from 'three';
const canvas = document.getElementById('portfolio-canvas');
const sceneManager = new SceneManager(canvas);
sceneManager.loadScene(new MainScene(sceneManager));

// Create a clock to manage delta time for animations
const clock = new THREE.Clock();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // Get the time elapsed since the last frame
  sceneManager.update(delta); // Pass delta time to the scene manager update method
  // animate function
  stats.begin();

// end of animate
  stats.end();
}

animate();
import Stats from "three/examples/jsm/libs/stats.module.js";


