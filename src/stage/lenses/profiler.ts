import * as THREE from 'three';
import { C, basic, box, front, labelAt, lit, sceneRoot } from '../kit';
import { foot, row, slider, type CamPose, type Ctx, type Lens, type Slider } from '../types';
import { easeOut, rng } from '../world';

const MAX = 400;
const KINDS = { model: C.white, tool: C.grey, agent: C.violet, gate: C.teal, retry: C.orange } as const;
type Kind = keyof typeof KINDS;

/**
 * Two instruments. Above: an agent run as a trace of nested spans with a
 * playhead. Below: a horde on a bench, with one bar per engine system showing
 * the frame cost measured on this page.
 */
export function profiler(ctx: Ctx): Lens {
  const root = sceneRoot();
  const rand = rng(31);

  // --- trace -------------------------------------------------------------------
  const trace = new THREE.Group();
  trace.position.set(-0.6, 4.9, -1);
  root.add(trace);
  const W = 11, X0 = -W / 2;
  const spans: { mesh: THREE.Mesh; x0: number; x1: number; base: THREE.Color }[] = [];
  const addSpan = (rowIdx: number, a: number, b: number, kind: Kind): void => {
    const mesh = box((b - a) * W - 0.06, 0.34, 0.12, basic(KINDS[kind]));
    mesh.position.set(X0 + ((a + b) / 2) * W, 2.1 - rowIdx * 0.5, 0);
    trace.add(mesh);
    spans.push({ mesh, x0: a, x1: b, base: new THREE.Color(KINDS[kind]) });
  };
  addSpan(0, 0, 1, 'agent');
  let t = 0.01;
  for (let i = 0; i < 7; i++) {
    const len = 0.09 + rand() * 0.06;
    const end = Math.min(0.99, t + len);
    addSpan(1, t, t + (end - t) * 0.45, 'model');
    const kind: Kind = i === 3 ? 'retry' : 'tool';
    addSpan(2, t + (end - t) * 0.47, end - 0.012, kind);
    addSpan(3, end - 0.01, end, 'gate');
    if (i === 3) addSpan(4, t + (end - t) * 0.6, end - 0.012, 'retry');
    t = end + 0.006;
    if (t > 0.95) break;
  }
  const playhead = box(0.04, 2.9, 0.16, basic(0xffffff, 0.9));
  playhead.position.y = 1.0;
  trace.add(playhead);
  labelAt(trace, 'agent trace', X0 + W - 1.2, 2.75, 0, '#9aa7b4', 0.3);
  for (const [i, name] of ['run', 'model', 'tool', 'gate'].entries()) labelAt(trace, name, X0 - 0.75, 2.1 - i * 0.5, 0, '#6f7c8a', 0.26);
  const dimColor = new THREE.Color(C.dim);

  // --- horde bench -------------------------------------------------------------------
  const bench = new THREE.Group();
  bench.position.set(-2.8, 0, 2.2);
  root.add(bench);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.5, 0.24, 40), lit(C.slab));
  disc.position.y = 0.12;
  bench.add(disc);
  const npcs = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.07, 0.16, 2, 6), new THREE.MeshLambertMaterial({ flatShading: true }), MAX);
  npcs.frustumCulled = false;
  bench.add(npcs);
  const lure = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), basic(C.white));
  bench.add(lure);
  const px = new Float32Array(MAX), pz = new Float32Array(MAX), vx = new Float32Array(MAX), vz = new Float32Array(MAX);
  const ox = new Float32Array(MAX), oz = new Float32Array(MAX);
  const col = new THREE.Color();
  for (let i = 0; i < MAX; i++) {
    const a = rand() * 6.28, r = Math.sqrt(rand()) * 2.9;
    px[i] = Math.cos(a) * r;
    pz[i] = Math.sin(a) * r;
    ox[i] = Math.cos(a * 3.1) * (0.3 + rand() * 1.1);
    oz[i] = Math.sin(a * 3.1) * (0.3 + rand() * 1.1);
    npcs.setColorAt(i, col.setHSL(0.02 + rand() * 0.07, 0.75, 0.5 + rand() * 0.15));
  }
  const o = new THREE.Object3D();

  // --- frame-cost bars -----------------------------------------------------------------
  const meter = new THREE.Group();
  meter.position.set(2.3, 0, 2.2);
  root.add(meter);
  const SCALE_MS = 2, FULL = 3.2;
  const barNames = ['ai', 'xform', 'render'];
  const barMeshes = barNames.map((name, i) => {
    const m = box(0.5, 1, 0.5, lit([C.teal, C.blue, C.violet][i]));
    m.position.set(i * 1.3, 0, 0);
    meter.add(m);
    labelAt(meter, name, i * 1.3, -0.3, 0.6, '#6f7c8a', 0.2);
    return m;
  });
  const budget = box(3.4, 0.03, 0.03, basic(C.orange));
  budget.position.set(1.3, FULL, 0);
  meter.add(budget);
  labelAt(meter, `${SCALE_MS} ms`, 1.3, FULL + 0.3, 0, '#f08a5d', 0.22);
  labelAt(meter, 'cost per system', 1.3, FULL + 0.75, 0, '#9aa7b4', 0.26);

  let aiMs = 0, xfMs = 0, count = 30;
  let ctl: Slider | null = null;

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      ctl = slider(ctx.controls, ctx.t.npcs, 0, MAX, 30, '');
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
      ctl = null;
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const instruments = easeOut((p - 0.5) / 0.35);
      trace.visible = meter.visible = instruments > 0;
      trace.scale.setScalar(Math.max(0.001, instruments));
      meter.scale.set(1, Math.max(0.001, instruments), 1);

      // Trace playhead
      const head = (time * 0.12) % 1;
      playhead.position.x = X0 + head * W;
      for (const s of spans) (s.mesh.material as THREE.MeshBasicMaterial).color.copy(s.x0 <= head ? s.base : dimColor);

      // Horde
      const auto = p < 1.5 ? 30 : p < 2.5 ? 30 + (p - 1.5) * (MAX - 30) : 100;
      if (ctl && !ctl.touched) ctl.set(auto);
      count = ctl ? ctl.value : Math.round(auto);
      const lx = Math.cos(time * 0.7) * 2.1, lz = Math.sin(time * 1.1) * 2.1;
      lure.position.set(lx, 0.45, lz);

      let t0 = performance.now();
      for (let i = 0; i < count; i++) {
        let ax = (lx + ox[i] - px[i]) * 2.2, az = (lz + oz[i] - pz[i]) * 2.2;
        for (let j = 0; j < count; j++) {
          if (j === i) continue;
          const dx = px[i] - px[j], dz = pz[i] - pz[j];
          const d2 = dx * dx + dz * dz;
          if (d2 < 0.05 && d2 > 1e-7) {
            ax += (dx / d2) * 0.12;
            az += (dz / d2) * 0.12;
          }
        }
        vx[i] = (vx[i] + ax * dt) * (1 - 2 * dt);
        vz[i] = (vz[i] + az * dt) * (1 - 2 * dt);
        px[i] += vx[i] * dt;
        pz[i] += vz[i] * dt;
      }
      let t1 = performance.now();
      aiMs += (t1 - t0 - aiMs) * 0.08;
      t0 = t1;
      for (let i = 0; i < count; i++) {
        const r = Math.hypot(px[i], pz[i]);
        if (r > 3.1) {
          px[i] *= 3.1 / r;
          pz[i] *= 3.1 / r;
        }
        o.position.set(px[i], 0.39, pz[i]);
        o.rotation.y = Math.atan2(vx[i], vz[i]);
        o.updateMatrix();
        npcs.setMatrixAt(i, o.matrix);
      }
      npcs.count = count;
      npcs.instanceMatrix.needsUpdate = true;
      t1 = performance.now();
      xfMs += (t1 - t0 - xfMs) * 0.08;

      const values = [aiMs, xfMs, ctx.stats.renderMs];
      barMeshes.forEach((m, i) => {
        const h = Math.max(0.02, Math.min(1.25, values[i] / SCALE_MS) * FULL);
        m.scale.y = h;
        m.position.y = h / 2;
      });

      front(cam, -0.4, 4.1, p < 0.5 ? 11.5 : 13.4, time);
      if (p < 0.5) cam.target.set(-2.8, 1.2, 2.2);

      const t = ctx.t;
      ctx.hud(
        p < 0.5
          ? row(t.npcs, count) + row(t.fps, '?', 'bad') + row(t.frame, '?', 'bad')
          : row(t.npcs, count) +
              row(t.fps, Math.round(1000 / Math.max(1, ctx.stats.frameMs))) +
              row('ai', `${aiMs.toFixed(2)} ms`) +
              row('transforms', `${xfMs.toFixed(2)} ms`) +
              row('render', `${ctx.stats.renderMs.toFixed(2)} ms`) +
              foot(t.live),
      );
    },
  };
}
