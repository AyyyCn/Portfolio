import * as THREE from 'three';
import { Platform } from './Platform.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'; // Import the font JSON

export class HubIsland {
  constructor({ name, radius, color, categories ,model=null}) {
    this.name = name;
    this.radius = radius; 
    this.platform = Platform(radius, color,model);
    this.categoryGroup = new THREE.Group();
    this.categories = categories || [];
    this.createCategories();
    this.model=model;
  }

  createCategories() {
    const radius = this.radius; // Adjust text distance from the center
    const loader = new FontLoader();
    const font = loader.parse(helvetiker);

    this.categories.forEach((txt, i) => {
        const angle = (i / this.categories.length) * Math.PI * 2; // Calculate angle for each category
        const geo = new TextGeometry(txt, {
            font: font,
            size: 0.25,
            height: 0.02,
        });
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = txt;

        // Position the text upright around the circle
        mesh.position.set(
            Math.cos(angle) * radius, // X position
            Math.sin(angle) * radius,  // Z position
            0.5,                      // Y position (height above the platform)
            
        );

        // Rotate the text to face outward
        mesh.rotation.z = 0; // Rotate text outward around the Y-axis
        mesh.rotation.x = Math.PI/2; // Rotate text outward around the Y-axis
        mesh.rotation.y = -angle/2; // Rotate text to face the center
        // Center the text geometry
        geo.computeBoundingBox();
        const textWidth = geo.boundingBox.max.x - geo.boundingBox.min.x;
        geo.translate(-textWidth / 2, 0, 0); // Center horizontally

        this.categoryGroup.add(mesh);
    });

    this.platform.add(this.categoryGroup);
}









  addTo(scene) {
    scene.add(this.platform);
  }
}