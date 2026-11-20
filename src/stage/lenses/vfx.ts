import * as THREE from 'three';
import { C, box, front, labelAt, lit, portal, sceneRoot } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut, rng } from '../world';

// Text to VFX: a description is compiled into a bounded specification of the
// phenomenon, rendered, critiqued by a model that reads the image, revised and
// rendered again until it reads right. Then the preset library and runtime API.

const N = 220;
const FX = new THREE.Vector3(0.6, 4.1, 0);

/** How each revision renders: naive burst (0), then three passes of the critique loop. */
const REVS = [
  { quality: 0, arcs: 0, sparks: 0 },
  { quality: 0.25, arcs: 0, sparks: 0 },
  { quality: 0.65, arcs: 3, sparks: 0.5 },
  { quality: 1, arcs: 7, sparks: 1 },
];
const NOTES = ['', '“no swirl, no crackle”', '“arcs too few, rim soft”', '“reads right ✓”'];

export function vfx(ctx: Ctx): Lens {
  const t = ctx.t;
  const root = sceneRoot();
  const rand = rng(23);

  // --- the description -------------------------------------------------------------------
  const card = box(3.1, 0.7, 0.06, lit(C.slab));
  card.position.set(-5.6, 6.9, 0);
  root.add(card);
  labelAt(root, '"a crackling blue portal"', -5.6, 6.9, 0.1, '#eef0f5', 0.24);
  labelAt(root, 'description', -5.6, 7.55, 0, '#7a8296', 0.22);

  // --- the phenomenon specification ---------------------------------------------------------
  const spec = new THREE.Group();
  spec.position.set(-5.6, 4.2, 0);
  spec.add(box(3.1, 2.6, 0.06, lit(C.slab)));
  labelAt(spec, 'phenomenon spec', 0, 1.65, 0, '#7a8296', 0.22);
  const specRows = ['simulates · electric vortex', 'bounds · radius, duration', 'palette · blue, white', 'revision · 1'];
  const specLabels = specRows.map((s, i) => labelAt(spec, s, 0, 0.85 - i * 0.55, 0.1, i === 3 ? '#5dcaa5' : '#a3a9b8', 0.2));
  root.add(spec);
  let shownRev = 1;

  // --- the render: a small viewport with the effect in it ----------------------------------------
  const screen = box(4.4, 4.4, 0.04, new THREE.MeshBasicMaterial({ color: 0x0d1424 }));
  screen.position.set(FX.x, FX.y, -0.3);
  root.add(screen);
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.4, 4.4, 0.05)), new THREE.LineBasicMaterial({ color: C.dim }));
  frame.position.set(FX.x, FX.y, -0.28);
  root.add(frame);
  const fx = portal(1.45);
  fx.group.position.copy(FX);
  root.add(fx.group);
  labelAt(root, 'render', FX.x, FX.y + 2.5, 0, '#7a8296', 0.22);

  const pos = new Float32Array(N * 3);
  const seeds = Array.from({ length: N }, () => ({ a: rand() * Math.PI * 2, r: rand(), z: rand() - 0.5, life: rand(), dir: rand() * Math.PI * 2, spd: 0.5 + rand() }));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0x9fb4d6, size: 0.1, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.position.copy(FX);
  root.add(points);

  // --- the critic --------------------------------------------------------------------------------
  const critic = new THREE.Group();
  critic.position.set(4.9, 5.0, 0);
  const eye = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), lit(C.violet));
  critic.add(eye);
  labelAt(critic, 'multimodal critique', 0, 0.75, 0, '#a3a9b8', 0.22);
  const notes = NOTES.map((n, i) => labelAt(critic, n, 0, -0.7, 0, i === 3 ? '#5dcaa5' : '#e0795a', 0.22));
  root.add(critic);
  const arrow = box(1.1, 0.04, 0.04, lit(C.violet));
  arrow.position.set(3.4, 5.0, 0);
  root.add(arrow);

  // --- what ships with it -------------------------------------------------------------------------
  const shelf = new THREE.Group();
  shelf.position.set(0.6, 0.7, 1);
  const presetColors = [C.orange, C.sun, C.grey, C.teal, C.violet];
  const presets = presetColors.map((c, i) => {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), new THREE.MeshBasicMaterial({ color: c, wireframe: true }));
    m.position.set((i - 2) * 0.9, 0, 0);
    shelf.add(m);
    return m;
  });
  labelAt(shelf, 'preset library', 0, -0.62, 0, '#a3a9b8', 0.22);
  labelAt(shelf, 'authoring workshop', -4.6, -0.1, 0, '#a3a9b8', 0.22);
  labelAt(shelf, 'runtime API · every game', 4.6, -0.1, 0, '#5dcaa5', 0.24);
  root.add(shelf);

  let clock = 0;

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
      clock += dt;
      // Revision on screen: naive burst, then revisions 1, 2, 3 of the loop.
      const rev = p < 1 ? 0 : p < 1.8 ? 1 : p < 2.35 ? 2 : 3;
      const R = REVS[rev];
      fx.group.visible = rev > 0;
      fx.update(dt, time, R.quality, R.arcs);

      // Revision 0 is particles spawned straight from the text: a vague fountain.
      // From revision 2, a few sparks spin off the rim.
      const radius = 1.45;
      let shown = 0;
      for (let i = 0; i < N; i++) {
        const s = seeds[i];
        let x = 0, y = 0, z = 0;
        if (rev === 0) {
          const life = (s.life + clock * 0.6 * s.spd) % 1;
          x = Math.cos(s.dir) * life * 1.6;
          y = -1.2 + life * 2.4 * s.spd - life * life * 1.8;
          z = Math.sin(s.dir) * life * 0.6;
          shown++;
        } else if (i < N * 0.35 * R.sparks) {
          const life = (s.life + clock * 0.9 * s.spd) % 1;
          const a = s.a + clock * 1.6;
          const r = radius * (1.02 + life * 0.35);
          x = Math.cos(a) * r;
          y = Math.sin(a) * r;
          z = 0.05;
          shown++;
        } else {
          x = y = z = 9999;
        }
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }
      mat.color.setHex(rev === 0 ? 0x9fb4d6 : 0xcfeeff);
      mat.size = rev === 0 ? 0.09 : 0.07;
      points.visible = shown > 0;
      geo.attributes.position.needsUpdate = true;

      const showSpec = easeOut((p - 0.7) / 0.3);
      spec.visible = showSpec > 0;
      spec.scale.setScalar(Math.max(0.001, showSpec));
      const specRev = Math.max(1, rev);
      if (specRev !== shownRev) {
        shownRev = specRev;
        const l = specLabels[3];
        spec.remove(l);
        specLabels[3] = labelAt(spec, `revision · ${specRev}`, 0, 0.85 - 3 * 0.55, 0.1, '#5dcaa5', 0.2);
      }

      const showCritic = easeOut((p - 1.5) / 0.3);
      critic.visible = arrow.visible = showCritic > 0;
      critic.scale.setScalar(Math.max(0.001, showCritic));
      eye.rotation.y = time * 1.5;
      notes.forEach((n, i) => (n.visible = i === rev && rev > 0));
      (frame.material as THREE.LineBasicMaterial).color.setHex(rev === 3 ? C.teal : C.dim);

      const showShelf = easeOut((p - 2.55) / 0.35);
      shelf.visible = showShelf > 0;
      shelf.scale.setScalar(Math.max(0.001, showShelf));
      presets.forEach((m, i) => (m.rotation.y = time * 0.8 + i));

      front(cam, -0.4, 4.0, 13.4);

      ctx.hud(
        row(t.spec, p >= 0.7 ? `${t.revision} ${specRev}` : '—') +
          row(t.critique, rev === 0 ? '—' : rev === 3 ? t.reads : t.revise, rev === 3 ? 'ok' : rev > 0 ? 'bad' : ''),
      );
    },
  };
}
