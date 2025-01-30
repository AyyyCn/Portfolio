import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export function Lighting(scene, renderer) {

  // Optional: make renderer physically correct and set output encoding
  //renderer.physicallyCorrectLights = true;
 // renderer.outputEncoding = THREE.sRGBEncoding;
  
  // Optionally load an HDR environment (place HDR in /public/assets/ folder)
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('assets/yourHDRFile.hdr', (hdrMap) => {
    hdrMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdrMap;  // For PBR reflections
  });

  // Hemisphere light for ambient environment
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // Directional light for stronger shadows
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 50;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);
  const beamGeometry = new THREE.ConeGeometry(1.5, 5, 32, 32, true);
  const beamMaterial = new THREE.ShaderMaterial({
      uniforms: {
          color: { value: new THREE.Color(0xffffff) },
          opacity: { value: 0.2 }
      },
      vertexShader: `
          varying vec3 vPosition;
          void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          varying vec3 vPosition;
          uniform vec3 color;
          uniform float opacity;
          void main() {
              float intensity = smoothstep(1.0, 0.0, length(vPosition));
              gl_FragColor = vec4(color, intensity * opacity);
          }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
  });
  
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.set(0, 2, -1);
  beam.rotation.x = Math.PI / 2;
  scene.add(beam);
  // Optional point light or spotlight
  // const spotLight = new THREE.SpotLight(0xffffff, 0.8);
  // spotLight.position.set(5, 15, 5);
  // spotLight.castShadow = true;
  // scene.add(spotLight);
}
