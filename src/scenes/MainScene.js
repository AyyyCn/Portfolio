import * as THREE from 'three';
import { Lighting } from '../components/Lighting.js';
import { InputHandler } from '../utils/InputHandler.js';
import { HubIsland } from '../components/HubIsland.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { gsap } from 'gsap';
import { makeTextLabel } from '../utils/textHelper.js';
import { links } from '../links.js';
import { educationLabels } from '../education.js';
import { ProjectScreen } from '../components/ProjectsScreen.js'; // adapte le chemin si besoin

import * as dat from 'dat.gui';
// ✅ Vite handles assets inside `public/` automatically
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { PMREMGenerator } from 'three';
export class MainScene {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-3.61, 1.83, 6.65);
    this.renderer = sceneManager.renderer;

    this.islands = [];
    this.islandMap = new Map();
    this.loader = new GLTFLoader();

    // 🔹 Define raycaster and mouse here
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.init();
  }

  async init() {
    try {
      Lighting(this.scene,this.tier);
      this.loadBackground(this.scene);

      // ✅ Load the Main Hub safely
      const mainHubGLTF = await this.loadModel('/assets/models/output.glb');
      console.log("📌 Loaded MainHub Model:", mainHubGLTF);
      
      
      if (!mainHubGLTF || !mainHubGLTF.scene) {
        console.error("❌ ERROR: MainHub GLTF Scene is missing!");
        return;
      }

      const mainHub = new HubIsland({
        name: 'MainHub',
        model: mainHubGLTF.scene,
        animations: mainHubGLTF.animations,
        position: new THREE.Vector3(0, 0, 0)
      });
      this.projectScreen = new ProjectScreen(this.scene);

      // Trouver et connecter le panneau de l'écran
      const screenPanel = mainHubGLTF.scene.getObjectByName('ProjectScreenPanel');
      if (screenPanel) {
        this.projectScreen.attachToScreen(screenPanel);
        console.log('✅ Found ProjectScreenPanel:', screenPanel);

      } else {
        console.warn('⚠️ ProjectScreenPanel not found in GLTF!');
      }

      mainHub.addTo(this.scene);
      this.registerIsland(mainHub);

      if (!mainHub.mesh) {
        console.error("❌ ERROR: MainHub Mesh is missing!");
        return;
      }
      // const cameraBtn = document.createElement('img');
      // cameraBtn.src = 'icons/reset.png'; // chemin vers ton icône
      // cameraBtn.style.position = 'fixed';
      // cameraBtn.style.bottom = '20px';
      // cameraBtn.style.left = '20px';
      // cameraBtn.style.width = '40px';
      // cameraBtn.style.height = '40px';
      // cameraBtn.style.zIndex = '9999';
      // cameraBtn.style.cursor = 'pointer';
      // cameraBtn.style.opacity = '0.8';
      // cameraBtn.style.transition = 'opacity 0.3s';
      
      // cameraBtn.addEventListener('mouseenter', () => cameraBtn.style.opacity = '1');
      // cameraBtn.addEventListener('mouseleave', () => cameraBtn.style.opacity = '0.8');
      
      // cameraBtn.addEventListener('click', () => {
      //   const newPos = { x: -3.61, y: 1.83, z: 6.65 };
      //   const newTarget = new THREE.Vector3(0.54, 0.55, 0.14);
      
      //   gsap.to(this.camera.position, {
      //     x: newPos.x,
      //     y: newPos.y,
      //     z: newPos.z,
      //     duration: 2,
      //     ease: "power2.inOut"
      //   });
      
      //   // Interpolation manuelle du target dans l'update GSAP
      //   const currentTarget = this.inputHandler.controls.target.clone();
      //   gsap.to(currentTarget, {
      //     x: newTarget.x,
      //     y: newTarget.y,
      //     z: newTarget.z,
      //     duration: 2,
      //     ease: "power2.inOut",
      //     onUpdate: () => {
      //       this.inputHandler.controls.target.copy(currentTarget);
      //     }
      //   });
      // });
      
      // document.body.appendChild(cameraBtn);
      const canvas = document.getElementById('portfolio-canvas'); //
      this.inputHandler = new InputHandler(this.camera, new THREE.Vector3(0.54,0.55,0.14), canvas);

      // ✅ Attach events
      window.addEventListener('pointerup', (e) => this.onPointerUp(e));
      window.addEventListener('mousemove', (event) => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      });
      

    } catch (error) {
      console.error("❌ ERROR in MainScene.init():", error);
    }

    const loadingDiv = document.getElementById('loading-screen');
    if (loadingDiv) {
      loadingDiv.classList.add('fade-out');
      setTimeout(() => loadingDiv.remove(), 2000);
    }
    const box = document.getElementById('announcement-box');
    box.textContent = `👋 Welcome to my 3D Portfolio! \n
    I'm Adam Ladhari, a creative developer passionate about gameDev, AI, and immersive tech.\n
    💡 Click on labels like "Projects" or "Skills" to explore. You can also move freely or reset the view anytime with the camera button.`;
    
    box.style.opacity = 1;

    const navBar = document.getElementById('navigation-bar');
    if (navBar) {
      navBar.querySelectorAll('span').forEach(el => {
        el.addEventListener('click', () => {
          const zoneName = el.dataset.zone;
          if (zoneName === 'main') {
            const newPos = { x: -3.61, y: 1.83, z: 6.65 };
            const newTarget = new THREE.Vector3(0.54, 0.55, 0.14);
    
            gsap.to(this.camera.position, {
              x: newPos.x,
              y: newPos.y,
              z: newPos.z,
              duration: 2,
              ease: "power2.inOut"
            });
    
            const currentTarget = this.inputHandler.controls.target.clone();
            gsap.to(currentTarget, {
              x: newTarget.x,
              y: newTarget.y,
              z: newTarget.z,
              duration: 2,
              ease: "power2.inOut",
              onUpdate: () => {
                this.inputHandler.controls.target.copy(currentTarget);
              }
            });
          } else {
            this.handleZoneClick(zoneName);
          }
        });
      });
    }
    

    
  }

  async loadModel(url) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        url,
        (gltf) => {
          if (!gltf || !gltf.scene) {
            console.error(`❌ Failed to load model: ${url}`);
            reject(new Error(`Failed to load model: ${url}`));
          }
          let meshCount = 0;
          let materialCount = new Set();
          
          gltf.scene.traverse(obj => {
            if (obj.isMesh) {
              meshCount++;
              materialCount.add(obj.material);
            }
          });
          
          console.log(`Meshes: ${meshCount}`);
          console.log(`Unique materials: ${materialCount.size}`);
          
          this.addTextLabelsFromMap(gltf.scene); // ✅ FIXED
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          gltf.scene.traverse((child) => {
            if (child.isMesh && child.material) {
              const mat = child.material;
          
              // If the material has an emissive texture (from GLTF extras)

            }
          });
          
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error(`❌ Error loading GLTF model: ${url}`, error);
          reject(error);
        }
      );
    });
  }
  

  update(delta) {
    if (this.skyboxMesh) {
      this.skyboxMesh.rotation.y = 0.9;
    }
    if (this.inputHandler) this.inputHandler.update();

    this.islands.forEach((island) => {
      if (island.update) {
        island.update(delta, this.raycaster, this.mouse, this.camera);
      }
    });

    
  }

  registerIsland(island) {
    this.islands.push(island);
    this.islandMap.set(island.name, island);
  }

  moveToIsland(islandName) {
    const targetIsland = this.islandMap.get(islandName);
    if (!targetIsland) return;

    const startPos = this.camera.position.clone();
    const islandPos = targetIsland.mesh.position.clone();

    gsap.to(this.camera.position, {
      x: islandPos.x,
      y: islandPos.y + 5,
      z: islandPos.z + 10,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.inputHandler.controls.target.lerp(islandPos, 0.1);
      },
      onComplete: () => {
        this.inputHandler.controls.target.copy(islandPos);
      },
    });
  }

  getPositionAroundHub(distance, angle) {
    return new THREE.Vector3(
      Math.cos(angle) * distance,
      0,
      Math.sin(angle) * distance
    );
  }

  loadBackground(scene) {
    const exrLoader = new EXRLoader();
    const pmremGenerator = new PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
  
    exrLoader.load('/assets/skybox/skybox2.exr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  
      // Create a large sphere to act as skybox
      const skyGeo = new THREE.SphereGeometry(500, 60, 40);
      const skyMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      });
      this.skyboxMesh = new THREE.Mesh(skyGeo, skyMat);
      scene.add(this.skyboxMesh);
  
      scene.environment = envMap;
      this.renderer.toneMappingExposure = 0.1;
      this.skyboxMesh.rotation.y = .9;

  
      texture.dispose();
      pmremGenerator.dispose();
    }, undefined, (err) => {
      console.error('❌ Failed to load EXR skybox:', err);
    });
  }
  
  

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  onPointerUp(event) {
    if (event.target.tagName !== 'CANVAS') {
      console.log('⛔ UI click ignored:', event.target);
      return;
    }

    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
  
    const intersects = raycaster.intersectObjects(this.scene.children, true);
  
    if (intersects.length > 0) {
      const clickedObj = intersects[0].object;
      const name = clickedObj.name;
      console.log('✅ Clicked Object:', name);
  
      if (name.startsWith('Zone_')) {
        this.handleZoneClick(name);
      } else if (name.startsWith('link_')) {
        this.handleLinkClick(name);
      }
      else if (name.startsWith('icon_')) {
        console.log('✅ Clicked Object:', );
        this.projectScreen.handleClick(name);
      }
      else if (name.startsWith('iconReturn'))
      {
        this.projectScreen.goBack();
      }
    }
    
    
  }
  addTextLabelsFromMap(scene) {
      Object.entries(educationLabels).forEach(([key, labelText]) => {
          const objName = `text_${key}`;
          const target = scene.getObjectByName(objName);
          
          if (target) {
              const label = makeTextLabel(labelText);

              // Place above object using its bounding box
              const box = new THREE.Box3().setFromObject(target);
              const height = box.max.y - box.min.y;
              label.position.set(0, height + 1.5, 0);

              target.add(label); // attaches so it follows movement
          } else {
              console.warn(`Object '${objName}' not found in scene.`);
          }
      });
      // add label just for artsation
      const target = scene.getObjectByName('link_artstation');
      if (target) {
        const label = makeTextLabel('Artstation', { fontSize: 48, color: 'black',scale : 0.001 });
        const box = new THREE.Box3().setFromObject(target);
        const height = box.max.y - box.min.y;
        label.position.set(0, 0 , -0.3);
        target.add(label); // attaches so it follows movement

      } else {
        console.warn(`Object 'link_Artstation' not found in scene.`);
      }
      

      
  }

    
  handleZoneClick(name) {
    if (this.isTransitioning) return; // ⛔ ignore if transition in progress
    this.isTransitioning = true;
  
    const match = name.match(/^Zone_([a-zA-Z0-9]+)_/);
    if (!match) {
      this.isTransitioning = false;
      return;
    }
  
    let offsetX = -0.5;
    let offsetZ = 0;
    if (name.includes('Art')) {
      offsetX = 0.5;
      offsetZ = 0.5;
    } else if (name.includes('Projects')) {
      offsetZ = 2;
      offsetX = 0;
    }
  
    const targetKey = match[1];
    const placeholder = this.scene.getObjectByName(`placeholder_${targetKey}`);
    if (!placeholder) {
      console.warn(`⚠️ placeholder_${targetKey} not found`);
      this.isTransitioning = false;
      return;
    }
  
    const targetPos = placeholder.getWorldPosition(new THREE.Vector3());
  
    gsap.to(this.camera.position, {
      x: targetPos.x + offsetX,
      y: targetPos.y,
      z: targetPos.z + offsetZ,
      duration: 3,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.inputHandler.controls.target.lerp(targetPos, 0.1);
      },
      onComplete: () => {
        this.inputHandler.controls.target.copy(targetPos);
        this.isTransitioning = false;
      },
    });
  }
  
  handleLinkClick(name) {
    const match = name.match(/^link_([a-zA-Z]+)(?:_\d+)?$/);
    if (!match) return;
  
    const linkKey = match[1]; // This captures only the word part
    const url = links[linkKey];
    if (url) {
      console.log(`🌐 Opening link: ${url}`);
      window.open(url, '_blank');
    } else {
      console.warn(`⚠️ No URL found for key: ${linkKey}`);
    }
  }
  
  

}