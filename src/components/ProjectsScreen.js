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
          { title: 'Fruit Sclicer', image: 'img/games_fruit.jpg' }
        ],
        ai: [
          { title: 'Parki', image: 'img/ai_parki.jpg' },
          { title: 'GameDB', image: 'img/ai_gamedb.jpg' }
        ],
        web: [
          { title: 'Web', image: 'img/web_web.jpg' },
          { title: 'InnovaBank', image: 'img/web_innova.jpg' },
          { title: 'Tuniscape', image: 'img/web_tuniscape.jpg' },
          { title: 'Rankr', image: 'img/web_rankr.jpg' },
          { title: 'Elmarchi', image: 'img/web_elmarchi.jpg' },
          { title: 'Portfolio', image: 'img/web_portfolio.jpg' }
        ],
        tools: [
          { title: 'Gurobi Wrapper', image: 'img/tools_gurobi.jpg' },
          { title: 'Installer', image: 'img/tools_installer.jpg' }
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

    console.log(`📂 Displaying projects for: ${category}`);
    this.projectCards.forEach(card => this.scene.remove(card));
    this.projectCards = [];

    const panelPos = new THREE.Vector3();
    this.projectScreenPanel.getWorldPosition(panelPos);
    const panelQuat = new THREE.Quaternion();
    this.projectScreenPanel.getWorldQuaternion(panelQuat);
    const panelScale = new THREE.Vector3();
    this.projectScreenPanel.getWorldScale(panelScale);
    const projects = this.projectData[category];
    //spacing should be take in consideration panek scale x and number of cards and their width
    
    const cardWidth = 0.5; // Width of each card
    const cardHeight = 0.8; // Height of each card
    const spacing = (panelScale.x * 2) / (projects.length + 1); // Space between cards
    projects.forEach((proj, i) => {
      const tex = new THREE.TextureLoader().load(proj.image);
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const geo = new THREE.PlaneGeometry(cardWidth, cardHeight);
      const card = new THREE.Mesh(geo, mat);
      card.position.set((i-1) * spacing, 0, 0.05);
      card.position.applyQuaternion(panelQuat);
      card.position.add(panelPos);
      this.scene.add(card);
      this.projectCards.push(card);
      console.log(`🧩 Added project card: ${proj.title}`);
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
