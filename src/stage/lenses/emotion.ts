import * as THREE from 'three';
import { C, basic, box, front, label, labelAt, lit, sceneRoot } from '../kit';
import { foot, row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut } from '../world';

const STATES = [
  { key: 'calm', pace: 1, mouth: 0, brow: 0, color: C.white, tone: '' },
  { key: 'frustrated', pace: 0.6, mouth: -0.5, brow: 0.45, color: C.orange, tone: 'bad' },
  { key: 'joy', pace: 1.35, mouth: 0.55, brow: -0.15, color: C.teal, tone: 'ok' },
] as const;

/**
 * Left: a face whose expression is read in real time. Right: a small runner
 * game whose pace follows the detected emotion. Below: the emotion dashboard.
 */
export function emotion(ctx: Ctx): Lens {
  const root = sceneRoot();

  // --- face ----------------------------------------------------------------------
  const face = new THREE.Group();
  face.position.set(-3.9, 5.5, 0);
  const head = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 2), lit(0xd9c0a8));
  head.scale.set(0.9, 1.05, 0.8);
  face.add(head);
  const dark = basic(0x12161d);
  for (const x of [-0.38, 0.38]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), dark);
    eye.position.set(x, 0.25, 0.95);
    face.add(eye);
  }
  const brows = [-1, 1].map((side) => {
    const b = box(0.42, 0.07, 0.06, dark);
    b.position.set(side * 0.38, 0.55, 0.98);
    face.add(b);
    return { b, side };
  });
  const mouth = [-1, 1].map((side) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, -0.42, 1.0);
    const seg = box(0.34, 0.07, 0.06, dark);
    seg.position.x = side * 0.17;
    pivot.add(seg);
    face.add(pivot);
    return { pivot, side };
  });
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.9, 3.3, 0.1)), new THREE.LineBasicMaterial({ color: C.teal }));
  frame.position.z = 0.9;
  face.add(frame);
  root.add(face);
  labelAt(root, 'camera · emotion recognition', -3.9, 7.65, 0, '#a3a9b8', 0.26);
  const tag = STATES.map((s) => {
    const l = label(s.key, '#eef0f5', 0.3);
    l.position.set(-3.9, 3.45, 0.5);
    root.add(l);
    return l;
  });

  // --- the game it drives -------------------------------------------------------------
  const game = new THREE.Group();
  game.position.set(2.3, 4.4, 0);
  const screen = box(5.6, 3.2, 0.1, lit(C.slab));
  screen.position.y = 1.1;
  const ground = box(5.2, 0.06, 0.2, basic(C.dim));
  ground.position.set(0, 0, 0.15);
  const runner = box(0.34, 0.34, 0.2, basic(C.sun));
  runner.position.set(-1.9, 0.2, 0.2);
  const obstacles = Array.from({ length: 4 }, () => {
    const o = box(0.22, 0.5, 0.2, basic(C.orange));
    game.add(o);
    return o;
  });
  game.add(screen, ground, runner);
  root.add(game);
  labelAt(root, 'gameplay logic · pace follows the player', 2.3, 7.65, 0, '#a3a9b8', 0.26);
  const link = box(1.3, 0.04, 0.04, basic(C.teal));
  link.position.set(-1.45, 5.5, 0.3);
  root.add(link);

  // --- dashboards ------------------------------------------------------------------------
  const barChart = (x: number, title: string, names: string[], colors: number[]): { group: THREE.Group; bars: THREE.Mesh[] } => {
    const group = new THREE.Group();
    group.position.set(x, 0.3, 1.2);
    const bars = names.map((n, i) => {
      const b = box(0.5, 1, 0.5, lit(colors[i]));
      b.position.x = (i - (names.length - 1) / 2) * 0.85;
      group.add(b);
      labelAt(group, n, b.position.x, -0.3, 0.5, '#7a8296', 0.19);
      return b;
    });
    labelAt(group, title, 0, 2.75, 0, '#a3a9b8', 0.24);
    root.add(group);
    return { group, bars };
  };
  const setBar = (b: THREE.Mesh, h: number): void => {
    b.scale.y = Math.max(0.02, h);
    b.position.y = Math.max(0.02, h) / 2;
  };
  const emo = barChart(-0.6, 'emotion dashboard', ['calm', 'frustr.', 'joy'], [C.white, C.orange, C.teal]);

  let clock = 0, pace = 1, scroll = 0, jump = 0;
  let share = [0, 0, 0];
  let mouthK = 0, browK = 0;

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      clock = 0;
      pace = 1;
      share = [0, 0, 0];
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const on = p >= 0.5;
      let idx = 0;
      if (on) {
        clock += dt;
        idx = Math.floor(clock / 4) % 3;
        share[idx] += dt;
      }
      const st = STATES[idx];
      pace += ((on ? st.pace : 1) - pace) * Math.min(1, dt * 2);
      mouthK += (st.mouth - mouthK) * Math.min(1, dt * 5);
      browK += (st.brow - browK) * Math.min(1, dt * 5);
      for (const m of mouth) m.pivot.rotation.z = m.side * mouthK;
      for (const b of brows) b.b.rotation.z = -b.side * browK;
      head.rotation.y = Math.sin(time * 0.6) * 0.12;
      frame.visible = link.visible = on;
      (frame.material as THREE.LineBasicMaterial).color.setHex(st.color);
      tag.forEach((l, i) => (l.visible = on && i === idx));

      // Runner game: obstacles scroll at the adapted pace; the runner hops over them.
      scroll += dt * 2.2 * pace;
      let near = 9;
      obstacles.forEach((o, i) => {
        const x = 2.6 - ((scroll + i * 1.5) % 6);
        o.position.set(x, 0.28, 0.2);
        o.visible = x > -2.6;
        const d = x - runner.position.x;
        if (d > -0.2 && d < near) near = d;
      });
      jump = near < 0.75 ? Math.sin(Math.max(0, 1 - near / 0.75) * Math.PI) : Math.max(0, jump - dt * 4);
      runner.position.y = 0.2 + jump * 0.75;

      const showEmo = easeOut((p - 1.5) / 0.3);
      emo.group.visible = showEmo > 0;
      const total = share[0] + share[1] + share[2] || 1;
      emo.bars.forEach((b, i) => setBar(b, (share[i] / total) * 2.2 * showEmo));

      front(cam, -0.4, 4.1, 13.4, time, 0.6);

      const t = ctx.t;
      ctx.hud(row(t.emotionLabel, on ? t[st.key] : t.off, on ? st.tone : '') + row(t.pace, `×${pace.toFixed(2)}`) + foot(t.live));
    },
  };
}
