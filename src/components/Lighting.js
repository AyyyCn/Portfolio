import * as THREE from 'three';

export function Lighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  const dir = new THREE.DirectionalLight(0xffffff, 0.5);
  dir.position.set(10, 10, 5);
  scene.add(ambient, dir);
}