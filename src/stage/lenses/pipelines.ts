import * as THREE from 'three';
import { C, basic, box, front, labelAt, lit, sceneRoot } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { clamp01, easeOut, rng } from '../world';

const X0 = -5.8, X1 = 4.6;
const ROWS = { model: 6.5, sound: 3.9, vfx: 1.3 } as const;

/**
 * Three production lines, each checking its own output: image → 3D → grip
 * contract, sound candidates → scoring → clean-up, and a VFX loop of render →
 * critique → revise.
 */
export function pipelines(ctx: Ctx): Lens {
  const root = sceneRoot();
  const rand = rng(11);
  const belt = (y: number, title: string): void => {
    const b = box(X1 - X0 + 1, 0.06, 0.9, lit(C.slab));
    b.position.set((X0 + X1) / 2, y - 0.45, 0);
    root.add(b);
    labelAt(root, title, X0 + title.length * 0.085, y + 1.05, 0, '#9aa7b4', 0.28);
  };
  belt(ROWS.model, 'image → 3D → grip contract');
  belt(ROWS.sound, 'sound: generate → score → clean');
  belt(ROWS.vfx, 'vfx: render → critique → revise');

  // --- line 1: image → mesh → aligned ------------------------------------------------
  const palette = [C.grey, C.orange, C.sun, C.violet];
  const models = palette.map((color, i) => {
    const g = new THREE.Group();
    const card = box(0.75, 0.75, 0.04, basic(color, 0.85));
    const prop = new THREE.Group();
    const len = 0.7 + rand() * 0.3;
    const body = box(0.16, 0.2, len, lit(color));
    body.position.set(0, 0.1, len * 0.2);
    const grip = box(0.13, 0.34, 0.16, lit(0x2a313b));
    grip.position.set(0, -0.16, 0);
    grip.rotation.x = 0.25;
    const barrel = box(0.07, 0.07, 0.4, lit(0x2a313b));
    barrel.position.set(0, 0.12, len * 0.7 + 0.1);
    prop.add(body, grip, barrel);
    g.add(card, prop);
    root.add(g);
    return { g, card, prop, tumble: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6, rand() * 6, rand() * 6)), phase: i / palette.length };
  });
  const yawSide = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
  const gizmo = new THREE.Group();
  gizmo.position.set(1.6, ROWS.model + 0.75, 0);
  for (const [axis, col] of [['x', C.red], ['y', C.teal], ['z', C.blue]] as const) {
    const s = box(axis === 'x' ? 0.5 : 0.03, axis === 'y' ? 0.5 : 0.03, axis === 'z' ? 0.5 : 0.03, basic(col));
    s.position[axis] = 0.25;
    gizmo.add(s);
  }
  root.add(gizmo);
  labelAt(root, 'grip contract', 1.6, ROWS.model + 1.5, 0, '#6f7c8a', 0.22);
  const out1 = labelAt(root, '42 models aligned', X1 - 1.3, ROWS.model + 1.05, 0, '#5dcaa5', 0.28);

  // --- line 2: sound candidates -----------------------------------------------------------
  const BARS = 14;
  const sounds = [0.42, 0.91, 0.55, 0.78].map((score, i) => {
    const g = new THREE.Group();
    const mat = basic(C.grey);
    const bars = Array.from({ length: BARS }, (_, k) => {
      const edge = k < 3 || k > BARS - 4;
      const h = edge ? 0.06 + rand() * 0.1 : 0.15 + rand() * 0.6;
      const m = box(0.05, h, 0.05, mat);
      m.position.set((k - BARS / 2) * 0.075, 0, 0);
      g.add(m);
      return { m, edge };
    });
    root.add(g);
    return { g, bars, mat, score, phase: i / 4 };
  });
  labelAt(root, 'score', 0.2, ROWS.sound + 0.95, 0, '#6f7c8a', 0.22);
  const scoreGate = box(0.04, 1.3, 0.9, basic(C.teal, 0.35));
  scoreGate.position.set(0.2, ROWS.sound + 0.1, 0);
  root.add(scoreGate);
  const out2 = labelAt(root, '97 cues kept', X1 - 1.0, ROWS.sound + 1.05, 0, '#5dcaa5', 0.28);

  // --- line 3: vfx revisions -------------------------------------------------------------------
  const REV = [
    { x: -3.8, color: C.grey, size: 0.07, spread: 0.3, speed: 0.9, n: 24 },
    { x: -0.4, color: C.orange, size: 0.1, spread: 0.7, speed: 1.5, n: 50 },
    { x: 3.0, color: C.teal, size: 0.12, spread: 1.1, speed: 2.1, n: 90 },
  ];
  const bursts = REV.map((r, i) => {
    const pos = new Float32Array(r.n * 3), vel = new Float32Array(r.n * 3), life = new Float32Array(r.n);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: r.color, size: r.size, transparent: true, opacity: 0.95, depthWrite: false }));
    pts.frustumCulled = false;
    pts.position.set(r.x, ROWS.vfx - 0.3, 0);
    root.add(pts);
    labelAt(root, `v${i + 1}`, r.x, ROWS.vfx - 0.75, 0.5, '#6f7c8a', 0.22);
    return { r, pos, vel, life, geo, pts };
  });
  const critics = [-2.1, 1.3].map((x) => {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), lit(C.violet));
    m.position.set(x, ROWS.vfx + 0.2, 0);
    root.add(m);
    labelAt(root, 'critique', x, ROWS.vfx - 0.3, 0.5, '#6f7c8a', 0.2);
    return m;
  });

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const running = p >= 0.5;
      const checking = p >= 1.5;
      const speed = running ? 0.085 : 0;
      gizmo.visible = scoreGate.visible = checking;
      out1.visible = out2.visible = p >= 2.5;

      let aligned = 0;
      for (const m of models) {
        m.phase = (m.phase + speed * dt) % 1;
        const x = X0 + m.phase * (X1 - X0);
        m.g.position.set(x, ROWS.model + 0.3, 0);
        const is3d = x > -2.2;
        m.card.visible = !is3d;
        m.prop.visible = is3d;
        m.card.rotation.y = Math.sin(time + x) * 0.2;
        const k = checking ? easeOut((x - 1.0) / 1.2) : 0;
        if (is3d && k >= 1) aligned++;
        m.prop.quaternion.slerpQuaternions(m.tumble, yawSide, k);
        if (k === 0) m.prop.rotateY(time * 0.6);
      }

      let kept = 0;
      for (const s of sounds) {
        s.phase = (s.phase + speed * dt) % 1;
        const x = X0 + s.phase * (X1 - X0);
        const scored = checking && x > 0.2;
        const good = s.score >= 0.7;
        const drop = scored && !good ? clamp01((x - 0.2) / 1.6) : 0;
        s.g.position.set(x, ROWS.sound + 0.05 - drop * drop * 3, 0);
        s.g.rotation.z = -drop * 1.2;
        s.g.visible = drop < 1;
        s.mat.color.setHex(!scored ? C.grey : good ? C.teal : C.orange);
        const clean = scored && good ? easeOut((x - 1.6) / 1.0) : 0;
        if (clean >= 1) kept++;
        for (const b of s.bars) b.m.scale.y = b.edge ? Math.max(0.02, 1 - clean) : 1;
      }

      bursts.forEach((b, i) => {
        const on = i === 0 || p >= i * 0.9 + 0.4;
        b.pts.visible = on;
        if (!on) return;
        for (let k = 0; k < b.r.n; k++) {
          b.life[k] -= dt;
          if (b.life[k] <= 0) {
            b.life[k] = 0.5 + Math.random() * 0.7;
            b.pos[k * 3] = b.pos[k * 3 + 2] = 0;
            b.pos[k * 3 + 1] = 0;
            b.vel[k * 3] = (Math.random() - 0.5) * b.r.spread;
            b.vel[k * 3 + 1] = b.r.speed * (0.6 + Math.random() * 0.6);
            b.vel[k * 3 + 2] = (Math.random() - 0.5) * b.r.spread;
          }
          b.vel[k * 3 + 1] -= 2.4 * dt;
          b.pos[k * 3] += b.vel[k * 3] * dt;
          b.pos[k * 3 + 1] += b.vel[k * 3 + 1] * dt;
          b.pos[k * 3 + 2] += b.vel[k * 3 + 2] * dt;
        }
        b.geo.attributes.position.needsUpdate = true;
      });
      critics.forEach((m, i) => {
        m.visible = p >= (i + 1) * 0.9 + 0.1;
        m.rotation.y = time * 1.5;
        m.scale.setScalar(1 + Math.sin(time * 4 + i) * 0.12);
      });
      const revision = p >= 2.2 ? 3 : p >= 1.3 ? 2 : 1;

      front(cam, -0.6, 4.2, 13.4, time, 0.6);

      ctx.hud(
        row(ctx.t.aligned, checking ? `${aligned} ✓` : '—', checking ? 'ok' : '') +
          row('cues kept / dropped', checking ? `${kept} / ${sounds.filter((s) => s.score < 0.7).length}` : '—') +
          row(ctx.t.revision, `${revision}/3`, revision === 3 ? 'ok' : ''),
      );
    },
  };
}
