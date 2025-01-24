import { SceneManager } from './utils/SceneManager.js';
import { MainScene } from './scenes/MainScene.js';

const canvas = document.getElementById('portfolio-canvas');
const sceneManager = new SceneManager(canvas);
sceneManager.loadScene(new MainScene(sceneManager));

function animate() {
  requestAnimationFrame(animate);
  sceneManager.update();
}
animate();