import * as THREE from 'three';
import { C, chip, front, labelAt, sceneRoot } from '../kit';
import { row, slider, type CamPose, type Ctx, type Lens, type Slider } from '../types';
import { easeOut } from '../world';

// Authorable shaders: a prompt becomes a procedural shader with exposed
// parameters. A blind generation can render nothing; each shader is rendered
// offscreen and checked before use, its parameters are tuned live, and one
// material model covers standard PBR and shaders.

const VERT = /* glsl */ `
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vPos = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
uniform float uTime;
uniform float uScale;
uniform float uSpeed;
uniform float uGlow;
varying vec3 vPos;
varying vec3 vNormal;
float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float noise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
void main() {
  vec3 p = vPos * uScale * 0.6 + vec3(0.0, uTime * uSpeed * 0.25, 0.0);
  float n = fbm(p + fbm(p * 0.7));
  float cracks = smoothstep(0.42, 0.5, n) - smoothstep(0.5, 0.6, n);
  vec3 rock = mix(vec3(0.10, 0.09, 0.10), vec3(0.24, 0.20, 0.19), n);
  vec3 lava = mix(vec3(0.85, 0.25, 0.05), vec3(1.0, 0.75, 0.3), cracks);
  float light = 0.35 + 0.65 * max(dot(vNormal, normalize(vec3(0.5, 0.8, 0.6))), 0.0);
  vec3 col = rock * light + lava * cracks * (0.4 + uGlow * 1.6);
  gl_FragColor = vec4(col, 1.0);
}`;

export function shaders(ctx: Ctx): Lens {
  const t = ctx.t;
  const root = sceneRoot();
  const uniforms = { uTime: { value: 0 }, uScale: { value: 3 }, uSpeed: { value: 0.6 }, uGlow: { value: 0.5 } };
  const shaderMat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
  const blankMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
  const pbrMat = new THREE.MeshStandardMaterial({ color: 0x5a4a44, roughness: 0.85, metalness: 0.05, flatShading: true });
  const geo = new THREE.IcosahedronGeometry(1.7, 5);

  labelAt(root, 'prompt', -6.2, 7.55, 0, '#7a8296', 0.22);
  const card = chip(3.1, 0.66);
  card.position.set(-6.2, 6.9, 0);
  root.add(card);
  labelAt(root, '"molten lava rock"', -6.2, 6.9, 0.1, '#eef0f5', 0.24);

  const main = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(geo, blankMat);
  main.position.set(0, 3.9, 0);
  const outline = new THREE.Mesh(new THREE.IcosahedronGeometry(1.74, 2), new THREE.MeshBasicMaterial({ color: C.red, wireframe: true, transparent: true, opacity: 0.35 }));
  main.add(outline);
  root.add(main);
  const blankTag = labelAt(root, '✗ renders nothing', 0, 1.6, 0.5, '#e0795a', 0.26);
  const shaderTag = labelAt(root, 'shader', 0, 1.6, 0.5, '#eef0f5', 0.26);

  // The parameters the generated shader exposes
  const params = new THREE.Group();
  params.position.set(-6.2, 4.6, 0);
  labelAt(params, 'exposed parameters', 0, 0.9, 0, '#7a8296', 0.22);
  const paramLabels = ['scale', 'speed', 'glow'].map((n, i) => labelAt(params, n, 0, 0.25 - i * 0.55, 0, '#a3a9b8', 0.24));
  root.add(params);

  // Offscreen check: a thumbnail of the same shader, rendered out of view first
  const check = new THREE.Group();
  check.position.set(5.4, 5.6, 0);
  check.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 1.8, 0.05)), new THREE.LineBasicMaterial({ color: C.teal })));
  const thumb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 3), shaderMat);
  check.add(thumb);
  labelAt(check, 'offscreen check ✓', 0, -1.25, 0, '#5dcaa5', 0.22);
  root.add(check);

  // One material model: the same rock as PBR and as a shader
  const pbr = new THREE.Mesh(geo, pbrMat);
  pbr.position.set(-2.4, 3.9, 0);
  root.add(pbr);
  const pbrTag = labelAt(root, 'PBR', -2.4, 1.6, 0.5, '#eef0f5', 0.26);
  const modelTag = labelAt(root, 'one material model', 0, 6.6, 0, '#5dcaa5', 0.3);

  let host: HTMLElement | null = null;
  let sliders: Slider[] = [];

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      host = document.createElement('div');
      host.className = 'ctl-group';
      ctx.controls.append(host);
      sliders = [slider(host, t.scale, 1, 8, 3, ''), slider(host, t.speed, 0, 20, 6, ''), slider(host, t.glow, 0, 100, 50, '%')];
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
      host = null;
      sliders = [];
    },
    update(_dt: number, p: number, time: number, cam: CamPose) {
      const generated = p >= 1;
      const tuning = p >= 1.5;
      if (host) host.hidden = !tuning;

      // Until the visitor touches a slider, the glow breathes to show live tuning.
      const [sScale, sSpeed, sGlow] = sliders;
      if (sGlow && tuning && !sGlow.touched) sGlow.set(50 + Math.sin(time * 0.9) * 45);
      uniforms.uTime.value = time;
      uniforms.uScale.value = sScale ? sScale.value : 3;
      uniforms.uSpeed.value = sSpeed ? sSpeed.value / 10 : 0.6;
      uniforms.uGlow.value = sGlow ? sGlow.value / 100 : 0.5;

      main.material = generated ? shaderMat : blankMat;
      outline.visible = !generated;
      blankTag.visible = !generated;
      const showParams = easeOut((p - 1.0) / 0.3);
      params.visible = showParams > 0;
      params.scale.setScalar(Math.max(0.001, showParams));
      paramLabels.forEach((l, i) => (l.visible = generated && p >= 1 + i * 0.1));

      const showCheck = easeOut((p - 1.6) / 0.3);
      check.visible = showCheck > 0;
      check.scale.setScalar(Math.max(0.001, showCheck));
      thumb.rotation.y = time * 0.6;

      // Result: the shader object slides right and its PBR twin appears beside it.
      const split = easeOut((p - 2.5) / 0.4);
      main.position.x = split * 2.4;
      shaderTag.position.x = main.position.x;
      shaderTag.visible = generated && split > 0.5;
      pbr.visible = split > 0.01;
      pbr.scale.setScalar(Math.max(0.001, split));
      pbrTag.visible = modelTag.visible = split > 0.5;
      main.rotation.y = pbr.rotation.y = time * 0.25;

      front(cam, -0.4, 4.2, 13.6);

      ctx.hud(
        row(t.shader, generated ? t.generated : t.blank, generated ? 'ok' : 'bad') +
          row(t.offscreen, p >= 1.6 ? t.passed : '—', p >= 1.6 ? 'ok' : '') +
          (p >= 2.5 ? row(t.material, 'PBR · shader', 'ok') : ''),
      );
    },
  };
}
