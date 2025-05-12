
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
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
        {
          title: 'The Boiz',
          image: 'projects/theboiz.png',
          description: 'A collaborative escape room game full of inside jokes with my friends. Mostly chaotic, unserious fun built for laughs.'
        },
        {
          title: 'Pencil Sharpner',
          image: 'projects/pencil.png',
          description: 'A simple hypercasual game where your only job is to sharpen pencils fast. Built for mobile-like quick play.'
        },
        {
          title: 'Faysa',
          image: 'projects/faysa.png',
          description: '🏆 Winner of DroidDay Game Jam — a time-travel puzzle game where you interact with past versions of yourself to solve platforming challenges.'
        },
        {
          title: 'Nos',
          image: 'projects/nos.png',
          description: `🥉 3rd Place Game Jam Project — DreamScape: The Lucid Mission is a surreal dream-based adventure game where you play a lucid dreamer on a mission to save the dream world from collapsing. Guided by a mysterious genie, each dream mission introduces new gameplay styles across dynamic dream phases.`
        },
        {
          title: 'Fruit Slicer',
          image: 'projects/fruit.png',
          description: 'A VR fruit slicing game built in Unity using real-time physics and blade collision. Inspired by Fruit Ninja, made for immersive fun.',
          link : 'https://github.com/AyyyCn/FruitSlicerVR'
        },
              {
        title: 'EchoMIDI',
        image: 'projects/echomidi.png',
        description: 'A rhythm memory game built in Unity URP with MIDI support. Players listen to an ever-growing sequence of notes and replay them using a MIDI keyboard or virtual piano. Features guided mode, velocity sensitivity, dynamic difficulty, and stylish feedback animations.'
        ,link : ' https://github.com/AyyyCn/EchoMIDI'
      }

      ],
      ai: [
        {
          title: 'Parki',
          image: 'projects/parki.png',
          description: 'A smart AI-powered parking system with license plate recognition (LPR) and mobile tracking. Built with Python, Flutter, and YOLO.'
        , link : 'https://github.com/AyyyCn/Parki'
        },
        {
          title: 'GameDB',
          image: 'projects/gamedb.png',
          description: 'A lightweight AI tool that scrapes Reddit and YouTube comments to analyze what people love or hate about a game. Stack: Python, BERT, web scraping.'
        , link : 'https://github.com/AyyyCn/Game-DB'
        },
        {
    title: 'Formation Recommender(Junior Rush)',
    image: 'projects/junior.png',
    description: 'An AI-driven multi-label recommendation system that suggests up to 3 personalized training programs per user based on academic and demographic features. Includes confidence thresholds, model calibration, and XGBoost. Built with Python, pandas, and scikit-learn.'
  , link : 'https://github.com/AyyyCn/JuniorRush_ML'
  },
      ],
      web: [
        {
          title: 'InnovaBank',
          image: 'projects/innovabank.png',
          description: 'My first university web project — a simulated bank UI using pure HTML, CSS, and vanilla JavaScript. Definitely not secure, just functional.'
        },
        {
          title: 'Elmarchi',
          image: 'projects/elmarchi.png',
          description: 'A university group project: Elmarchi is an online marketplace for items, built using Angular',
          link : 'https://github.com/RaedAddala/El-Marchi'
        },
        {
          title: 'Tuniscape',
          image: 'projects/tuniscape.png',
          description: 'A fictional travel agency website built with Symfony PHP framework. Includes booking modules, form handling, and server-side rendering.'
        , link : 'https://github.com/ElyesBelgouthi/Tuniscape'
        }
      ],
      tools: [
        {
          title: 'Gurobi Wrapper',
          image: 'projects/gurobi.png',
          description: 'A tkinter-based tool to solve LP/ILP optimization problems using Gurobi, with a custom GUI for inputs, outputs, and config settings.'
        },
        {
          title: 'Img2Gerber',
          image: 'projects/gerber.png',
          description: 'A Python-based automation pipeline that converts layered image designs (PNG/SVG) into production-ready KiCad Gerber files. The system processes multiple projects in batch, handling image-to-SVG conversion, PCB generation, Gerber plotting, and final archiving. Stack: Python, KiCad API, Inkscape CLI, PIL, OpenCV, lxml, shell scripting'
        }
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
    this.removeInfoPanel();
    this.projectCards = [];
  
    const panelPos = new THREE.Vector3();
    this.projectScreenPanel.getWorldPosition(panelPos);
    const panelQuat = new THREE.Quaternion();
    this.projectScreenPanel.getWorldQuaternion(panelQuat);
  
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
  
        // ✅ Rename every mesh so raycasting works
        card.traverse((child) => {
          if (child.isMesh) {
            child.material = mat;
            child.name = `project_card_${i}`;
            child.userData.project = proj;
          }
        });
  
        card.name = `project_card_${i}`;
        card.userData.project = proj;
  
        const row = Math.floor(i / maxCardsPerRow);
        const col = i % maxCardsPerRow;
        const totalWidth = cardWidth * maxCardsPerRow + horizontalSpacing * (maxCardsPerRow - 1);
        const startX = -totalWidth / 2 + cardWidth / 2;
  
        const localPos = new THREE.Vector3(
          startX + col * (cardWidth + horizontalSpacing),
          -((row - 1) * (cardHeight + verticalSpacing) + cardHeight / 2),
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
  

displayProjectInfo(project) {
    const panel = document.getElementById('project-panel');
    const content = document.getElementById('project-panel-content');
    if (!panel || !content) return;
  
    const desc = project.description || 'No description available yet.';
    const link = project.link ? `<br><a href="${project.link}" target="_blank">GitHub</a>` : '';
  
    content.innerHTML = `
      <strong>${project.title}</strong><br>
      ${desc}
      ${link}
      <br>
      <img src="${project.image}" alt="${project.title}" />
    `;
  
    panel.style.display = 'block';
    panel.style.opacity = '1';
}

  
  
  
  

  removeInfoPanel() {
    const panel = this.scene.getObjectByName('infoPanel');
    if (panel) this.scene.remove(panel);
  }

  goBack() {
    if (!this.projectScreenPanel) return;
    this.projectCards.forEach(card => this.scene.remove(card));
    this.removeInfoPanel();
    this.projectCards = [];
    this.activeCategory = null;
    console.log('↩️ Returned to icon view');
  }
}
