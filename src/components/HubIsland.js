import * as THREE from 'three';
import { Platform } from './Platform.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'; // Import the font JSON

import * as THREE from 'three';
import { Platform } from './Platform.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'; // Import the font JSON

export class HubIsland {
  constructor({ name, radius, color, categories, model = null, position = new THREE.Vector3(0, 0, 0), animations = [] }) {
    this.name = name;
    this.radius = radius;
    this.categories = categories || [];
    this.platform = Platform(radius, color, model, position, animations); // Pass animations to the platform
    this.categoryGroup = new THREE.Group();
    this.createCategories();
    this.mixer = this.platform.mixer || null; // Store the mixer if it exists
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
        0.5, // Y position (height above the platform)
        Math.sin(angle) * radius // Z position
      );

      // Rotate the text to face outward
      mesh.rotation.z = 0;
      mesh.rotation.x = 0;
      mesh.rotation.y = 0;

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

  update(delta) {
    // Update the animation mixer if it exists
    if (this.mixer) {
      this.platform.mixer.update(delta);
    }
  }
}
