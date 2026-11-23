import * as THREE from 'three';
import { C, basic, box, front, label, labelAt, lit, sceneRoot } from '../kit';
import { foot, row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut } from '../world';

const STATES = [
  { key: 'calm', pace: 1, mouth: 0.12, brow: 0, color: C.blue, tone: '' },
  { key: 'frustrated', pace: 0.6, mouth: -0.5, brow: 0.45, color: C.orange, tone: 'bad' },
  { key: 'joy', pace: 1.35, mouth: 0.55, brow: -0.15, color: C.teal, tone: 'ok' },
] as const;

/**
 * Left: a face whose expression is read in real time. Right: a small runner
 * game whose pace follows the detected emotion. Below: the emotion dashboard.
 */
export function emotion(ctx: Ctx): Lens {
  const root = sceneRoot();

  // --- face: a camera frame with a clean, flat face and its tracked landmarks ------------------
  const face = new THREE.Group();
  face.position.set(-3.9, 5.5, 0);
  const feed = new THREE.Mesh(roundedRect(2.9, 3.3, 0.28), basic(C.slab));
  feed.position.z = -0.05;
  face.add(feed);
  const skin = basic(0xf1d5bd);
  const head = new THREE.Mesh(new THREE.CircleGeometry(1.08, 64), skin);
  head.scale.set(0.9, 1.04, 1);
  face.add(head);
  // Hair: a cap over the crown with a soft side-parted hairline, inside the head outline.
  const hairShape = new THREE.Shape();
  const RX = 1.0, RY = 1.16, A0 = 0.22, A1 = Math.PI - 0.22;
  for (let i = 0; i <= 40; i++) {
    const a = A0 + ((A1 - A0) * i) / 40;
    const x = Math.cos(a) * RX, y = Math.sin(a) * RY;
    if (i === 0) hairShape.moveTo(x, y);
    else hairShape.lineTo(x, y);
  }
  hairShape.quadraticCurveTo(-0.7, 0.72, -0.18, 0.74);
  hairShape.quadraticCurveTo(0.5, 0.78, Math.cos(A0) * RX, Math.sin(A0) * RY);
  const hair = new THREE.Mesh(new THREE.ShapeGeometry(hairShape, 12), basic(0x3d3633));
  hair.position.z = 0.005;
  face.add(hair);
  for (const x of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), skin);
    ear.position.set(x * 0.98, 0.02, -0.01);
    face.add(ear);
  }
  const inkMat = basic(0x2b2b30);
  const eyes = [-1, 1].map((side) => {
    const e = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), inkMat);
    e.position.set(side * 0.36, 0.14, 0.02);
    face.add(e);
    return e;
  });
  const cheekMat = basic(0xeab3a4, 0);
  for (const x of [-1, 1]) {
    const c = new THREE.Mesh(new THREE.CircleGeometry(0.16, 24), cheekMat);
    c.position.set(x * 0.55, -0.18, 0.015);
    face.add(c);
  }
  const browL = stroke(6, inkMat), browR = stroke(6, inkMat), mouthS = stroke(18, inkMat);
  face.add(browL.mesh, browR.mesh, mouthS.mesh);

  // Landmarks the recogniser tracks: jaw line, brows, eyes, mouth.
  const LM = 30;
  const lmPos = new Float32Array(LM * 3);
  const lmGeo = new THREE.BufferGeometry();
  lmGeo.setAttribute('position', new THREE.BufferAttribute(lmPos, 3));
  const lmMat = new THREE.PointsMaterial({ color: C.teal, size: 0.07, sizeAttenuation: true, depthWrite: false });
  const landmarks = new THREE.Points(lmGeo, lmMat);
  landmarks.frustumCulled = false;
  face.add(landmarks);

  // Detection brackets around the face, in the colour of the emotion read.
  const bracketMat = new THREE.LineBasicMaterial({ color: C.teal });
  const frame = new THREE.LineSegments(brackets(2.3, 2.7, 0.42), bracketMat);
  frame.position.z = 0.04;
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
  const emo = barChart(-0.6, 'emotion dashboard', ['calm', 'frustr.', 'joy'], [C.blue, C.orange, C.teal]);

  /** Brows, eyes and mouth follow the expression; the landmarks sit on them. */
  const drawFace = (mouthK: number, browK: number, time: number, on: boolean): void => {
    const pts: [number, number][] = [];
    const brow = (side: number): [number, number][] =>
      Array.from({ length: 6 }, (_, i) => {
        const u = i / 5; // 0 inner, 1 outer
        const x = side * (0.18 + u * 0.36);
        const y = 0.42 + 0.05 * Math.sin(u * Math.PI) - browK * 0.22 * (1 - u) + Math.max(0, -browK) * 0.15;
        return [x, y];
      });
    const bl = brow(-1), br = brow(1);
    browL.set(bl, 0.065);
    browR.set(br, 0.065);
    const smile = mouthK;
    const ends = -0.46 + smile * 0.16;
    const mid = -0.46 - smile * 0.34;
    const mouthPts: [number, number][] = Array.from({ length: 18 }, (_, i) => {
      const u = i / 17;
      const x = -0.3 + u * 0.6;
      const y = (1 - u) * (1 - u) * ends + 2 * u * (1 - u) * mid + u * u * ends;
      return [x, y];
    });
    mouthS.set(mouthPts, 0.065);
    // Blink now and then; joy narrows the eyes a little.
    const blink = ((time + 2.1) % 4.2) < 0.12 ? 0.1 : 1;
    const open = blink * (1 - Math.max(0, smile) * 0.35);
    for (const e of eyes) e.scale.set(1, open, 1);
    cheekMat.opacity += ((smile > 0.2 ? 0.55 : 0) - cheekMat.opacity) * 0.08;
    cheekMat.transparent = true;

    if (!on) return;
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (1.12 + (i / 8) * 0.76);
      pts.push([Math.cos(a) * 0.95, Math.sin(a) * 1.08 + 0.02]);
    }
    pts.push(bl[0], bl[2], bl[5], br[0], br[2], br[5]);
    for (const e of eyes) pts.push([e.position.x - 0.12, 0.14], [e.position.x + 0.12, 0.14], [e.position.x, 0.14 + 0.08 * open]);
    pts.push(mouthPts[0], mouthPts[5], mouthPts[9], mouthPts[12], mouthPts[17], [0, mid - 0.06], [0, -0.08], [0, 0.05], [0, 0.18]);
    for (let i = 0; i < LM; i++) {
      const q = pts[i] ?? pts[0];
      lmPos[i * 3] = q[0];
      lmPos[i * 3 + 1] = q[1];
      lmPos[i * 3 + 2] = 0.06;
    }
    lmGeo.attributes.position.needsUpdate = true;
  };

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
      drawFace(mouthK, browK, time, on);
      face.rotation.z = Math.sin(time * 0.7) * 0.03;
      frame.visible = landmarks.visible = link.visible = on;
      bracketMat.color.setHex(st.color);
      tag.forEach((l, i) => (l.visible = on && i === idx));

      // Runner game: obstacles scroll at the adapted pace; the runner hops over them.
      scroll += dt * 2.2 * pace;
      let near = 9;
      obstacles.forEach((o, i) => {
        const x = 2.6 - ((scroll + i * 1.5) % 6);
        o.position.set(x, 0.28, 0.2);
        o.visible = x > -2.6;
        const d = x - runner.position.x;
        if (d > -0.5 && d < near) near = d;
      });
      // A hop centred on the obstacle; it never dips below the ground line.
      const hop = (0.7 - near) / 1.2;
      jump = hop > 0 && hop < 1 ? Math.sin(hop * Math.PI) : Math.max(0, jump - dt * 4);
      runner.position.y = 0.2 + Math.max(0, jump) * 0.95;

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

/** A flat ribbon along a polyline, rewritten in place each frame. */
function stroke(n: number, mat: THREE.Material): { mesh: THREE.Mesh; set(pts: [number, number][], w: number): void } {
  const pos = new Float32Array(n * 2 * 3);
  const idx: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return {
    mesh,
    set(pts, w) {
      for (let i = 0; i < n; i++) {
        const p = pts[Math.min(i, pts.length - 1)];
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let tx = b[0] - a[0], ty = b[1] - a[1];
        const l = Math.hypot(tx, ty) || 1;
        tx /= l;
        ty /= l;
        const nx = -ty * w / 2, ny = tx * w / 2;
        pos.set([p[0] + nx, p[1] + ny, 0.03, p[0] - nx, p[1] - ny, 0.03], i * 6);
      }
      geo.attributes.position.needsUpdate = true;
    },
  };
}

function roundedRect(w: number, h: number, r: number): THREE.ShapeGeometry {
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

/** Four corner brackets, like a face-detection box. */
function brackets(w: number, h: number, len: number): THREE.BufferGeometry {
  const v: number[] = [];
  for (const sx of [-1, 1])
    for (const sy of [-1, 1]) {
      const x = (sx * w) / 2, y = (sy * h) / 2;
      v.push(x, y, 0, x - sx * len, y, 0, x, y, 0, x, y - sy * len, 0);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  return g;
}
