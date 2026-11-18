import * as THREE from 'three';
import type { CamPose } from './types';

// Small building blocks shared by the dedicated case-study scenes.

export const C = {
  teal: 0x5dcaa5,
  blue: 0x7d93c4,
  orange: 0xe0795a,
  violet: 0x9a8fd0,
  sun: 0xd9b86a,
  red: 0xd9706a,
  white: 0xeef0f5,
  grey: 0x7a8296,
  dim: 0x2a3040,
  line: 0x1a1e28,
  slab: 0x11141c,
} as const;

export const basic = (color: number, opacity = 1): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });

export const lit = (color: number): THREE.MeshLambertMaterial => new THREE.MeshLambertMaterial({ color, flatShading: true });

export const box = (w: number, h: number, d: number, mat: THREE.Material): THREE.Mesh => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

/** Text as a camera-facing sprite. */
export function label(text: string, color = '#a3a9b8', height = 0.32): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const g = canvas.getContext('2d')!;
  const font = '500 44px "Geist Mono Variable", ui-monospace, Menlo, Consolas, monospace';
  g.font = font;
  canvas.width = Math.ceil(g.measureText(text).width) + 16;
  canvas.height = 60;
  g.font = font;
  g.fillStyle = color;
  g.textBaseline = 'middle';
  g.fillText(text, 8, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  const h = height * 1.22;
  sprite.scale.set((canvas.width / canvas.height) * h, h, 1);
  return sprite;
}

export function labelAt(parent: THREE.Object3D, text: string, x: number, y: number, z = 0, color = '#a3a9b8', height = 0.32): THREE.Sprite {
  const l = label(text, color, height);
  l.position.set(x, y, z);
  parent.add(l);
  return l;
}

/** A scene root with the shared floor grid. */
export function sceneRoot(): THREE.Group {
  const root = new THREE.Group();
  root.add(new THREE.GridHelper(60, 60, C.line, 0x11141c));
  return root;
}

/** A straight line between two points. */
export function line(a: THREE.Vector3, b: THREE.Vector3, color: number = C.dim): THREE.Line {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineBasicMaterial({ color }));
}

/** Front-on camera. */
export function front(cam: CamPose, x: number, y: number, dist: number, _time = 0, _sway = 0): void {
  cam.pos.set(x, y + 0.4, dist);
  cam.target.set(x, y, 0);
}
