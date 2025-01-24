import py from '../../public/assets/skybox/py.png';
import px from '../../public/assets/skybox/px.png';
import nx from '../../public/assets/skybox/nx.png';
import ny from '../../public/assets/skybox/ny.png';
import pz from '../../public/assets/skybox/pz.png';
import nz from '../../public/assets/skybox/nz.png';import * as THREE from 'three';
import { Lighting } from '../components/Lighting.js';
import { InputHandler } from '../utils/InputHandler.js';
import { HubIsland } from '../components/HubIsland.js';
import { gsap } from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Example: use a single or separate CameraPath file if preferred
// import { moveCameraAlongCurve } from '../utils/CameraPath.js';

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

    // Store island references by name for quick lookups
    this.islandMap = new Map();
    this.islands = [];

    this.init();
  }

  init() {
    Lighting(this.scene);
    this.loadBackground(this.scene);

    const modelURL = new URL('../../public/assets/models/platform.gltf', import.meta.url);

    // Create a promise to load the platform model
    const loadModel = (url) => {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                url,
                (gltf) => resolve(gltf.scene),
                undefined, // Optional progress callback
                (error) => reject(error) // Reject the promise on error
            );
        });
    };

    // Wait for the model to load before proceeding
    loadModel(modelURL.href)
        .then((platform) => {
            // 1) Create Main Hub
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

            // 2) Define sub-island data
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

            // 3) Dynamically place sub-islands in a circle around the main hub
            const distanceFromMain = 12;
            subIslandData.forEach((info, i) => {
                const angle = (i / subIslandData.length) * Math.PI * 2;
                const island = new HubIsland({
                    name: info.name,
                    radius: info.radius,
                    color: info.color,
                    categories: info.categories,
                });
                island.platform.position.set(
                    Math.cos(angle) * distanceFromMain,
                    0,
                    Math.sin(angle) * distanceFromMain
                );
                island.addTo(this.scene);
                this.registerIsland(island);
            });

            // 4) Create OrbitControls-based input handler
            this.inputHandler = new InputHandler(this.camera, mainIsland.platform);
        })
        .catch((error) => {
            console.error('Error loading model:', error);
        });
}


  update() {
    this.inputHandler.update();
  }

  registerIsland(island) {
    this.islands.push(island);
    this.islandMap.set(island.name, island);
  }

  onPointerDown(intersect) {
    if (!intersect) return;

    // Identify which island we clicked
    // We compare the intersected object's parent to see if it matches 
    // the island's platform or its text group
    for (let island of this.islands) {
      const isIslandPlatform = (intersect.object.parent === island.platform);
      const isIslandText = (intersect.object.parent === island.categoryGroup);

      if (isIslandPlatform || isIslandText) {
        const categoryClicked = intersect.object.name; // The text label
        // If the category is 'MainHub', go back to 'MainHub' island
        if (categoryClicked === 'MainHub') {
          this.moveToIsland('MainHub');
          return;
        }

        // If we're on the MainHub and we clicked a category that has an island
        if (island.name === 'MainHub') {
          const subIslandName = categoryClicked + 'Island';
          if (this.islandMap.has(subIslandName)) {
            this.moveToIsland(subIslandName);
            return;
          }
        }

        // If we're on some sub-island and we clicked a category that also has an island
        const subIslandName = categoryClicked + 'Island';
        if (this.islandMap.has(subIslandName)) {
          this.moveToIsland(subIslandName);
          return;
        }

        // Otherwise handle it as a normal category with no sub-island
        // For example, you can open a menu, show info, etc.
      }
    }
  }

  // Smooth camera travel between islands with improved orbit target on arrival
  moveToIsland(islandName) {
    console.log('Moving to:', islandName);
    const targetIsland = this.islandMap.get(islandName);
    if (!targetIsland) return;

    // Start, mid, end for camera curve
    const startPos = this.camera.position.clone();
    const islandPos = targetIsland.platform.position.clone();

    // Midpoint is higher, center between camera and island
    const midPos = new THREE.Vector3(
      (startPos.x + islandPos.x) * 0.5,
      Math.max(startPos.y, islandPos.y) + 8,
      (startPos.z + islandPos.z) * 0.5
    );
    // End slightly above & offset from the island center
    const endPos = islandPos.clone().add(new THREE.Vector3(0, 5, 8));

    // Use CatmullRomCurve3 to create a smooth path
    const curve = new THREE.CatmullRomCurve3([startPos, midPos, endPos]);
    const obj = { t: 0 };

    gsap.to(obj, {
      t: 1,
      duration: 5,
      ease: 'power1.out',
      onUpdate: () => {
        const pos = curve.getPointAt(obj.t);
        this.camera.position.copy(pos);
        // Smoothly update the OrbitControls target during the move
        // so it keeps looking toward the destination
        this.inputHandler.controls.target.lerp(islandPos, 0.1);
      },
      onComplete: () => {
        // Snap final camera look at the island
        this.inputHandler.controls.target.copy(islandPos);
      }
    });
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  // Simple skybox / background loader
  loadBackground(scene) {
    const loader = new THREE.CubeTextureLoader()
      .setPath('') // Adjust if needed; we're loading direct from imports
      .load(
        [ 
          px, nx, py, ny, pz, nz
        ],
        (texture) => {
          scene.background = texture;
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('CubeTexture error:', error);
        }
      );

    console.log('CubeTextureLoader initialized:', loader);
  }
}
