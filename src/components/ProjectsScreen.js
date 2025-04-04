import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { gsap } from 'gsap';
import { makeTextLabel } from '../utils/textHelper.js';

export class ProjectScreen {
  constructor(scene) {
    this.scene = scene;
    this.projectScreenPanel = null;
    this.projectIcons = [];
    this.projectCards = [];
    this.activeCategory = null;
    this.projectData = {
        games: [
          { title: 'The Boiz', image: 'img/games_boiz.jpg' },
          { title: 'Pencil Sharpner', image: 'img/games_pencil.jpg' },
          { title: 'Faysa', image: 'img/games_faysa.jpg' },
          { title: 'Nos', image: 'img/games_nos.jpg' },
          { title: 'Fruit Slicer', image: 'img/games_fruit.jpg' }
        ],
        ai: [
          { title: 'Parki', image: 'projects/parki.png' },
          { title: 'GameDB', image: 'projects/gamedb.png' }
        ],
        web: [
          { title: 'InnovaBank', image: 'projects/innovabank.png' },
          { title: 'Elmarchi', image: 'projects/elmarchi.png' },
          { title: 'Tuniscape', image: 'projects/tuniscape.png' },
          
          { title: 'Portfolio', image: 'img/web_portfolio.jpg' }
        ],
        tools: [
          { title: 'Gurobi Wrapper', image: 'projects/gurobi.png' },
          //{ title: 'Installer', image: 'img/tools_installer.jpg' }
        ]
      };
      
    }
  
  

  attachToScreen(screenPanel) {
    this.projectScreenPanel = screenPanel;
    if (!this.projectScreenPanel) {
      console.error('❌ No ProjectScreenPanel found in model.');
      return;
    }
    console.log('✅ Attached to ProjectScreenPanel:', this.projectScreenPanel.name);
  }

  handleClick(name) {
    const iconNames = ["icon_games", "icon_ai", "icon_web", "icon_tools"];


      if (iconNames.includes(name)) {
        const category = name.replace('icon_', '');
        console.log('✅ Clicked category icon:', category);
        this.displayProjectCards(category);
      }
      
    
  }

  displayProjectCards(category) {
    if (!this.projectScreenPanel) return;
  
    this.projectCards.forEach(card => this.scene.remove(card));
    this.projectCards = [];
  
    const panelPos = new THREE.Vector3();
    this.projectScreenPanel.getWorldPosition(panelPos);
    const panelQuat = new THREE.Quaternion();
    this.projectScreenPanel.getWorldQuaternion(panelQuat);
    const panelScale = new THREE.Vector3();
    this.projectScreenPanel.getWorldScale(panelScale);
  
    const projects = this.projectData[category];
    const cardWidth = 1;
    const cardHeight = 1;
    const maxCardsPerRow = 3;
  
    const horizontalSpacing = 0.5;
    const verticalSpacing = 0;
  
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
  
    projects.forEach((proj, i) => {
      const tex = new THREE.TextureLoader().load(proj.image);
      tex.encoding = THREE.sRGBEncoding;
      tex.flipX = true;
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: false,
        toneMapped: false
      });
  
      loader.load('/assets/models/border.glb', (gltf) => {
        const card = gltf.scene.clone(true);
        card.traverse((child) => {
          if (child.isMesh) {
            child.material = mat;
          }
        });
  
        const row = Math.floor(i / maxCardsPerRow);
        const col = i % maxCardsPerRow;
  
        const totalWidth = cardWidth * maxCardsPerRow + horizontalSpacing * (maxCardsPerRow - 1);
        const startX = -totalWidth / 2 + cardWidth / 2;
  
        const localPos = new THREE.Vector3(
          startX + col * (cardWidth + horizontalSpacing),
          -((row - 1) * (cardHeight + verticalSpacing)+cardHeight /2),
          0.05
        );
        localPos.applyQuaternion(panelQuat);
  
        card.position.copy(panelPos.clone().add(localPos));
        card.quaternion.copy(panelQuat);
        card.scale.set(cardWidth, cardHeight, 1);
  
        this.scene.add(card);
        this.projectCards.push(card);
      });
    });
  
    this.activeCategory = category;
  }
  
  
  
  

  goBack() {
    if (!this.projectScreenPanel) return;

    this.projectCards.forEach(card => this.scene.remove(card));
    this.projectCards = [];
    this.activeCategory = null;
    console.log('↩️ Returned to icon view');
  }
}
