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
import { RendererStats } from './RendererStats.js';
import { detectDeviceTier } from './devicedetector.js'; 
export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Renderer setup
    this.tier = detectDeviceTier();
    console.log('Detected device tier:', this.tier);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  
    this.renderer.info.autoReset = false;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.tier === 'low' ? 1 : window.devicePixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.shadowMap.enabled = this.tier !== 'low';
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.toneMapping = this.tier === 'high' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    this.renderer.toneMappingExposure = this.tier === 'high' ? 1 : 0.5;


    this.renderer.setClearColor(0xffe6d0);
    
    this.currentScene = null;
    this.composer = null;
    this.renderPass = null;
    this.effectPass = null;

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.stats = new RendererStats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.bottom = '0px';
    document.body.appendChild(this.stats.domElement);

    
  }

  loadScene(sceneObj) {
    this.currentScene = sceneObj;

    // Setup postprocessing composer
    this.composer = new EffectComposer(this.renderer, {
      multisampling : this.tier === 'high' ? 8 : 2, // Enable multisampling for high tier
    });
    this.renderPass = new RenderPass(
      this.currentScene.getScene(),
      this.currentScene.getCamera()
    );
    this.composer.addPass(this.renderPass);
    let bloom = null;
    let vignette = null;
    let colorAdjust = null;

    if (this.tier === 'high') {
      bloom = new BloomEffect({
        intensity: 0.2,
        luminanceThreshold: 0.6,
        luminanceSmoothing: 0.3,
        mipmapBlur: false
      });
    
      vignette = new VignetteEffect({
        eskil: false,
        offset: 0.3,
        darkness: 0.6
      });
    
      colorAdjust = new BrightnessContrastEffect({
        brightness: 0.02,
        contrast: 0.1
      });
    
    } else if (this.tier === 'mid') {
      bloom = new BloomEffect({
        intensity: 0.2,
        luminanceThreshold: 0.7,
        luminanceSmoothing: 0.2,
        mipmapBlur: false
      });
    
       vignette = new VignetteEffect({
        eskil: true,
        offset: 0.25,
        darkness: 0.5
      });
    
      colorAdjust = new BrightnessContrastEffect({
        brightness: 0.01,
        contrast: 0.05
      });
    
    } else {
      // Low tier: skip postprocessing entirely
      return;
    }
    
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
    this.stats.update(this.renderer);
    this.renderer.info.reset(); // call after update
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
