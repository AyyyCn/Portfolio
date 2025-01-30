import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
export function Platform(radius = 3, color = 0x111111,model=null,position = new THREE.Vector3(0,0,0), animations = []) {
  if (model) {
    const clonedModel = SkeletonUtils.clone(model); // Properly clone model with animations
    console.log('Cloned Model Nodes:', clonedModel.children);

    clonedModel.position.copy(position); // Set the position of the cloned model
    //clonedModel.rotation.x = -Math.PI / 2; // Rotate to match circular platform orientation
    clonedModel.scale.set(radius / 2, radius / 2, radius / 2); // Scale the cloned model to fit the radius
        // Handle animations if available
        if (animations.length > 0) {
          console.log('Creating AnimationMixer for platform');
          const mixer = new THREE.AnimationMixer(clonedModel);
          animations.forEach((clip) => {
            console.log('Clip:', clip.name);
            if(clip.name=="Armature|Idle"){
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat);
            action.play();
            }
          });
          clonedModel.mixer = mixer;
          
        }
        
    return clonedModel;
  }
  const geo = new THREE.CircleGeometry(radius, 64);
  const mat = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}