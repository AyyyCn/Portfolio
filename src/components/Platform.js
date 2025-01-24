import * as THREE from 'three';

export function Platform(radius = 3, color = 0x111111,model=null) {
  if(model){
    console.log("model")
    return model
  }
  const geo = new THREE.CircleGeometry(radius, 64);
  const mat = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}