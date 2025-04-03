import { gsap } from 'gsap';

export function fadeInOut(object, duration = 1, onComplete = () => {}) {
  gsap.fromTo(
    object.material,
    { opacity: 0 },
    { opacity: 1, duration, onComplete }
  );
}