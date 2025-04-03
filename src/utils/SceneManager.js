import * as THREE from 'three';
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  VignetteEffect,
  BrightnessContrastEffect,
  GodRaysEffect
} from 'postprocessing';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffe6d0);

    this.currentScene = null;
    this.composer = null;
    this.renderPass = null;
    this.effectPass = null;

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  loadScene(sceneObj) {
    this.currentScene = sceneObj;

    // Setup postprocessing composer
    this.composer = new EffectComposer(this.renderer, {
      multisampling: 4  // optionnel, si rendu à haute résolution
    });
    this.renderPass = new RenderPass(
      this.currentScene.getScene(),
      this.currentScene.getCamera()
    );
    this.composer.addPass(this.renderPass);

    const bloom = new BloomEffect({
      intensity: 0.3,             // plus doux
      luminanceThreshold: 0.6,   // évite d'englober des surfaces trop larges
      luminanceSmoothing: 0.1,   // moins de blur
      mipmapBlur: false          // désactive le flou mipmap
    });

    const vignette = new VignetteEffect({
      eskil: false,
      offset: 0.3,
      darkness: 0.6
    });

    const colorAdjust = new BrightnessContrastEffect({
      brightness: 0.02,
      contrast: 0.1
    });


    this.effectPass = new EffectPass(
      this.currentScene.getCamera(),
      bloom,
      vignette,
      colorAdjust,
    );
    this.effectPass.renderToScreen = true;
    this.composer.addPass(this.effectPass);
  }

  update(delta) {
    if (!this.currentScene || !this.composer) return;

    this.currentScene.update(delta);
    this.composer.render(delta);
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
    if (this.composer) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
