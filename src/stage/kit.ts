import * as THREE from 'three';
import type { CamPose } from './types';

// Small building blocks shared by the dedicated case-study scenes.

// Light scenes, to sit on the glass page: a pale sky, white slabs, ink lines and labels.
export const C = {
  teal: 0x2fb38a,
  blue: 0x5b7fd6,
  orange: 0xe8774f,
  violet: 0x8b78e0,
  sun: 0xe3b23c,
  red: 0xe0544a,
  white: 0xffffff,
  ink: 0x1d1d1f,
  grey: 0x9097a3,
  dim: 0xc4cad3,
  line: 0xd6dbe2,
  slab: 0xfffffe,
} as const;

/** Scene labels were authored for a dark scene; map them to ink tones that read on the light sky. */
const LABEL: Record<string, string> = {
  '#eef0f5': '#1d1d1f',
  '#a3a9b8': '#3c3f47',
  '#7a8296': '#6e7380',
  '#5dcaa5': '#138a63',
  '#e0795a': '#c94a26',
  '#d9b86a': '#a77b0c',
};

export const basic = (color: number, opacity = 1): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });

/** Shaded material; flat panels (C.slab) stay pure white so they read as cards on the pale sky. */
export const lit = (color: number): THREE.MeshBasicMaterial | THREE.MeshLambertMaterial =>
  color === C.slab ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshLambertMaterial({ color, flatShading: true });

export const box = (w: number, h: number, d: number, mat: THREE.Material): THREE.Mesh => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

/** Text as a camera-facing sprite. */
export function label(text: string, color = '#a3a9b8', height = 0.32): THREE.Sprite {
  color = LABEL[color.toLowerCase()] ?? color;
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
  root.add(new THREE.GridHelper(60, 60, 0xc9cfd8, 0xdde2e8));
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

/** A flat rounded rectangle in the XY plane, for cards and screens. */
export function roundedRect(w: number, h: number, r: number): THREE.ShapeGeometry {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 8);
}

/** A white card with a soft drop edge, so it reads as a panel on the pale sky. */
export function card(w: number, h: number, r = 0.18): THREE.Group {
  const g = new THREE.Group();
  const shade = new THREE.Mesh(roundedRect(w, h, r), basic(0xd5dbe3));
  shade.position.set(0.04, -0.06, -0.02);
  const face = new THREE.Mesh(roundedRect(w, h, r), basic(C.slab));
  g.add(shade, face);
  return g;
}

/** A soft glass chip behind scene text: rounded, see-through, with a thin outline. */
export function chip(w: number, h: number, r = Math.min(0.3, h / 2)): THREE.Group {
  const g = new THREE.Group();
  const fill = new THREE.Mesh(roundedRect(w, h, r), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, depthWrite: false }));
  const pts = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  pts.moveTo(x + r, y);
  pts.lineTo(x + w - r, y);
  pts.quadraticCurveTo(x + w, y, x + w, y + r);
  pts.lineTo(x + w, y + h - r);
  pts.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  pts.lineTo(x + r, y + h);
  pts.quadraticCurveTo(x, y + h, x, y + h - r);
  pts.lineTo(x, y + r);
  pts.quadraticCurveTo(x, y, x + r, y);
  const edge = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts.getPoints(8)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));
  edge.position.z = 0.005;
  g.add(fill, edge);
  return g;
}

/** The case scenes' sky: a soft vertical gradient with faint colour washes, drawn once. */
export function skyTexture(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const g = cv.getContext('2d')!;
  const lin = g.createLinearGradient(0, 0, 0, 256);
  lin.addColorStop(0, '#dde4ef');
  lin.addColorStop(0.55, '#ebeef3');
  lin.addColorStop(1, '#f2f0ee');
  g.fillStyle = lin;
  g.fillRect(0, 0, 256, 256);
  const wash = (x: number, y: number, rad: number, rgb: string, a: number): void => {
    const r = g.createRadialGradient(x, y, 0, x, y, rad);
    r.addColorStop(0, `rgba(${rgb},${a})`);
    r.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
  };
  wash(215, 30, 150, '150,180,235', 0.28);
  wash(30, 70, 130, '150,215,200', 0.18);
  wash(60, 250, 150, '245,205,180', 0.2);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A small standing character, feet at the origin. A ghost is a see-through copy. */
export function figure(color: number, ghost = false): THREE.Group {
  const g = new THREE.Group();
  const mat = ghost ? basic(color, 0.28) : lit(color);
  if (ghost) mat.depthWrite = false;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.32, 4, 12), mat);
  body.position.y = 0.34;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), mat);
  head.position.y = 0.8;
  g.add(body, head);
  return g;
}

// --- portal ------------------------------------------------------------------------

const PORTAL_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const PORTAL_FRAG = /* glsl */ `
uniform float uTime;
uniform float uQuality;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  float r = length(vUv);
  if (r > 1.0) discard;
  float a = atan(vUv.y, vUv.x);
  // A spiral that tightens towards the centre; low quality = noisy and loose.
  float swirl = sin(a * 3.0 + log(r + 0.04) * 6.0 * uQuality - uTime * (1.0 + 2.5 * uQuality));
  float n = noise(vUv * 5.0 + uTime * 0.6);
  float bands = mix(n, swirl * 0.5 + 0.5, uQuality);
  vec3 deep = vec3(0.04, 0.09, 0.28);
  vec3 cyan = vec3(0.25, 0.75, 1.0);
  vec3 col = mix(deep, cyan, bands * smoothstep(0.0, 0.9, r));
  col += vec3(0.8, 0.95, 1.0) * pow(smoothstep(0.75, 1.0, r), 3.0) * (0.4 + 0.8 * uQuality);
  col += vec3(0.6, 0.85, 1.0) * pow(1.0 - r, 6.0) * uQuality;
  float alpha = mix(0.55, 1.0, uQuality) * smoothstep(1.0, 0.94, r);
  gl_FragColor = vec4(col, alpha);
}`;

export interface Portal {
  group: THREE.Group;
  /** quality 0..1: from a vague smudge to a clean vortex; arcs: how many electric arcs crackle. */
  update(dt: number, time: number, quality: number, arcs: number): void;
}

/** A crackling blue portal: a swirling vortex surface, a bright rim and flickering electric arcs. */
export function portal(radius = 1.4): Portal {
  const group = new THREE.Group();
  const uniforms = { uTime: { value: 0 }, uQuality: { value: 1 } };
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 64),
    new THREE.ShaderMaterial({ uniforms, vertexShader: PORTAL_VERT, fragmentShader: PORTAL_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  );
  const rimMat = new THREE.MeshBasicMaterial({ color: 0x7fd8ff });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, radius * 0.045, 10, 80), rimMat);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.04, radius * 0.11, 8, 80), new THREE.MeshBasicMaterial({ color: 0xbfeaff, transparent: true, opacity: 0.35, depthWrite: false }));
  group.add(disc, halo, rim);

  const SEG = 9, MAX = 8;
  const arcMat = new THREE.LineBasicMaterial({ color: 0xffffff });
  const arcGlowMat = new THREE.LineBasicMaterial({ color: 0x5cc8ff });
  const arcList = Array.from({ length: MAX }, () => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SEG * 3), 3));
    const line = new THREE.Line(geo, arcMat);
    const glow = new THREE.Line(geo, arcGlowMat);
    glow.position.z = -0.01;
    glow.scale.setScalar(1.015);
    group.add(glow, line);
    return { geo, line, glow };
  });
  let flicker = 0;

  const zap = (geo: THREE.BufferGeometry): void => {
    // An arc jumps along the rim and bends towards the centre, jagged.
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const a0 = Math.random() * Math.PI * 2, span = 0.5 + Math.random() * 0.9;
    for (let k = 0; k < SEG; k++) {
      const t = k / (SEG - 1);
      const a = a0 + span * t;
      const inward = Math.sin(t * Math.PI) * (0.25 + Math.random() * 0.25);
      const r = radius * (1.02 - inward) + (Math.random() - 0.5) * radius * 0.08;
      pos.setXYZ(k, Math.cos(a) * r, Math.sin(a) * r, 0.02);
    }
    pos.needsUpdate = true;
  };

  return {
    group,
    update(dt, time, quality, arcs) {
      uniforms.uTime.value = time;
      uniforms.uQuality.value = quality;
      rim.visible = quality > 0.15;
      halo.visible = quality > 0.4;
      (halo.material as THREE.MeshBasicMaterial).opacity = 0.25 + 0.15 * Math.sin(time * 9);
      rim.scale.setScalar(1 + Math.sin(time * 11) * 0.006 * quality);
      flicker -= dt;
      const refresh = flicker <= 0;
      if (refresh) flicker = 0.06 + Math.random() * 0.05;
      arcList.forEach((arc, i) => {
        const on = i < arcs && (refresh ? Math.random() > 0.25 : arc.line.visible);
        arc.line.visible = arc.glow.visible = on;
        if (on && refresh) zap(arc.geo);
      });
    },
  };
}
