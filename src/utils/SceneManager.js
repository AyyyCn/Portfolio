import * as THREE from 'three';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    // Enable anti-aliasing and advanced shadow settings
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Use ACES tone mapping for more cinematic color response
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    // Enable physically correct lighting/shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;

    this.currentScene = null;
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }
  loadScene(sceneObj) {
    this.currentScene = sceneObj;
  }

  update(delta) {
    if (!this.currentScene) return;
    this.currentScene.update(delta);
    this.renderer.render(
      this.currentScene.getScene(),
      this.currentScene.getCamera()
    );
  }

  onPointerDown(e) {
    if (!this.currentScene) return;
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.currentScene.getCamera());
    const intersects = raycaster.intersectObjects(
      this.currentScene.getScene().children,
      true
    );
    if (intersects.length > 0 && this.currentScene.onPointerDown) {
      this.currentScene.onPointerDown(intersects[0]);
    }
  }

  handleResize() {
    if (!this.currentScene) return;
    const camera = this.currentScene.getCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}