import * as THREE from 'three';
import { gsap } from 'gsap';

export function moveCameraAlongCurve(camera, points, duration = 2, onComplete = () => {}) {
  const curve = new THREE.CatmullRomCurve3(points);
  const obj = { t: 0 };

  gsap.to(obj, {
    t: 1,
    duration,
    onUpdate: () => {
      const pos = curve.getPointAt(obj.t); // Get the current position on the curve
      camera.position.copy(pos); // Move the camera to this position

      // Make the camera look at the end position (last point in the array)
      const endPos = points[points.length - 1];
      console.log(endPos);
      camera.lookAt(endPos);
    },
    onComplete
  });
}
