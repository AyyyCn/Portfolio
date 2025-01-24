import py from '../../public/assets/skybox/py.png';
import px from '../../public/assets/skybox/px.png';
import nx from '../../public/assets/skybox/nx.png';
import ny from '../../public/assets/skybox/ny.png';
import pz from '../../public/assets/skybox/pz.png';
import nz from '../../public/assets/skybox/nz.png';
import * as THREE from 'three';
import { Lighting } from '../components/Lighting.js';
import { InputHandler } from '../utils/InputHandler.js';
import { HubIsland } from '../components/HubIsland.js';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class MainScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);
    this.renderer = sceneManager.renderer;
    this.islandMap = new Map();
    this.islands = [];

    this.init();
  }

  async init() {
    Lighting(this.scene);
    this.loadBackground(this.scene);

    const modelURL = new URL('../../public/assets/models/platform.gltf', import.meta.url);
    const platform = await this.loadModel(modelURL.href);

    const mainIsland = new HubIsland({
      name: 'MainHub',
      radius: 3,
      color: 0x333333,
      categories: ['Contact', 'Projects', 'Experiences', 'Education', 'Extras'],
      model: platform,
    });
    mainIsland.platform.position.set(0, 0, 0);
    mainIsland.addTo(this.scene);
    this.registerIsland(mainIsland);

    const subIslandData = [
      {
        baseName: 'Projects',
        name: 'ProjectsIsland',
        radius: 2.5,
        color: 0x112233,
        categories: ['Games', 'WebDev', 'Art', 'MainHub'],
      },
      {
        baseName: 'Experiences',
        name: 'ExperienceIsland',
        radius: 2.5,
        color: 0x331122,
        categories: ['Company1', 'Company2', 'Company3', 'MainHub'],
      },
      {
        baseName: 'Education',
        name: 'EducationIsland',
        radius: 2.5,
        color: 0x222244,
        categories: ['School1', 'School2', 'MainHub'],
      },
      {
        baseName: 'Extras',
        name: 'ExtrasIsland',
        radius: 2.5,
        color: 0x224422,
        categories: ['Bonus1', 'Bonus2', 'MainHub'],
      },
      {
        baseName: 'Contact',
        name: 'ContactIsland',
        radius: 2.5,
        color: 0x224422,
        categories: ['Github', 'LinkedIn', 'MainHub'],
      },
    ];

    const distanceFromMain = 12;
    subIslandData.forEach((info, i) => {
      const angle = (i / subIslandData.length) * Math.PI * 2;
      const island = new HubIsland({
        name: info.name,
        radius: info.radius,
        color: info.color,
        categories: info.categories,
        model: platform,
      });
      island.platform.position.set(
        Math.cos(angle) * distanceFromMain,
        0,
        Math.sin(angle) * distanceFromMain
      );
      island.addTo(this.scene);
      this.registerIsland(island);
    });

    this.inputHandler = new InputHandler(this.camera, mainIsland.platform);
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
      );
    });
  }

  update() {
    if (this.inputHandler) {
      this.inputHandler.update();
    }
  }

  registerIsland(island) {
    this.islands.push(island);
    this.islandMap.set(island.name, island);
  }

  onPointerDown(intersect) {
    if (!intersect) return;

    for (let island of this.islands) {
      const isIslandPlatform = intersect.object.parent === island.platform;
      const isIslandText = intersect.object.parent === island.categoryGroup;

      if (isIslandPlatform || isIslandText) {
        const categoryClicked = intersect.object.name;
        if (categoryClicked === 'MainHub') {
          this.moveToIsland('MainHub');
          return;
        }

        if (island.name === 'MainHub') {
          const subIslandName = categoryClicked + 'Island';
          if (this.islandMap.has(subIslandName)) {
            this.moveToIsland(subIslandName);
            return;
          }
        }

        const subIslandName = categoryClicked + 'Island';
        if (this.islandMap.has(subIslandName)) {
          this.moveToIsland(subIslandName);
          return;
        }
      }
    }
  }

  moveToIsland(islandName) {
    console.log('Moving to:', islandName);
    const targetIsland = this.islandMap.get(islandName);
    if (!targetIsland) return;

    const startPos = this.camera.position.clone();
    const islandPos = targetIsland.platform.position.clone();

    const midPos = new THREE.Vector3(
      (startPos.x + islandPos.x) * 0.5,
      Math.max(startPos.y, islandPos.y) + 8,
      (startPos.z + islandPos.z) * 0.5
    );
    const endPos = islandPos.clone().add(new THREE.Vector3(0, 5, 8));

    const curve = new THREE.CatmullRomCurve3([startPos, midPos, endPos]);
    const obj = { t: 0 };

    gsap.to(obj, {
      t: 1,
      duration: 5,
      ease: 'power1.out',
      onUpdate: () => {
        const pos = curve.getPointAt(obj.t);
        this.camera.position.copy(pos);
        this.inputHandler.controls.target.lerp(islandPos, 0.1);
      },
      onComplete: () => {
        this.inputHandler.controls.target.copy(islandPos);
      },
    });
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  loadBackground(scene) {
    const loader = new THREE.CubeTextureLoader()
      .setPath('')
      .load(
        [px, nx, py, ny, pz, nz],
        (texture) => {
          scene.background = texture;
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('CubeTexture error:', error);
        }
      );

    console.log('CubeTextureLoader initialized:', loader);
  }
}
