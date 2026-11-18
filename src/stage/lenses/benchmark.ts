import * as THREE from 'three';
import { cells, row, type CamPose, type Ctx, type Lens } from '../types';
import { label } from '../kit';
import { clamp01, easeOut } from '../world';

// The harness itself, not a game: a tool-use loop (model → tool → validation
// gate), five specialist sub-agents, a checklist, and the 12 requested features
// as a board. A run can pass the gate on every lap and still leave the board
// almost empty (1/12 = 8%); with the checklist it reaches 11/12 = 92%.

const FEATURES = 12;
const SPECIALISTS: { name: string; color: number; tiles: number[] }[] = [
  { name: 'world', color: 0x5dcaa5, tiles: [0, 1, 2, 3, 4] },
  { name: 'logic', color: 0x378add, tiles: [5, 6, 7] },
  { name: 'vfx', color: 0xf08a5d, tiles: [8] },
  { name: 'ui', color: 0x9b7bea, tiles: [9] },
  { name: 'audio', color: 0xf2c14e, tiles: [10] },
];
const OWNER = Array.from({ length: FEATURES }, (_, i) => SPECIALISTS.findIndex((s) => s.tiles.includes(i)));

export function benchmark(ctx: Ctx): Lens {
  const root = new THREE.Group();
  const basic = (c: number, o = 1): THREE.MeshBasicMaterial => new THREE.MeshBasicMaterial({ color: c, transparent: o < 1, opacity: o });
  const lit = (c: number): THREE.MeshLambertMaterial => new THREE.MeshLambertMaterial({ color: c, flatShading: true });

  const grid = new THREE.GridHelper(60, 60, 0x263140, 0x18202b);
  root.add(grid);

  // --- the loop ----------------------------------------------------------------
  const C = new THREE.Vector3(-3.4, 2.9, 0), R = 1.9;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.035, 8, 64), basic(0x3a4656));
  ring.position.copy(C);
  root.add(ring);
  const onRing = (a: number, out: THREE.Vector3): THREE.Vector3 => out.set(C.x + Math.cos(a) * R, C.y + Math.sin(a) * R, 0);
  const A_MODEL = Math.PI / 2, A_TOOL = -Math.PI / 6, A_GATE = (7 * Math.PI) / 6;

  const model = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), lit(0xe8edf2));
  onRing(A_MODEL, model.position);
  const tool = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), lit(0x8fa3b8));
  onRing(A_TOOL, tool.position);
  const gateMat = basic(0x3a4656);
  const gateOn = new THREE.Color(0x5dcaa5);
  const gate = new THREE.Group();
  for (const [w, h, x, y] of [[0.1, 1, -0.45, 0], [0.1, 1, 0.45, 0], [1, 0.1, 0, 0.5]] as const) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), gateMat);
    bar.position.set(x, y, 0);
    gate.add(bar);
  }
  onRing(A_GATE, gate.position);
  gate.rotation.z = A_GATE + Math.PI / 2;
  const token = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), basic(0xffffff));
  root.add(model, tool, gate, token);
  for (const [text, a, dx, dy] of [['model', A_MODEL, 0, 0.75], ['tool', A_TOOL, 0.95, -0.35], ['gate', A_GATE, -0.15, -1.0]] as const) {
    const l = label(text, '#9aa7b4', 0.42);
    onRing(a, l.position);
    l.position.x += dx;
    l.position.y += dy;
    root.add(l);
  }
  const loopTitle = label('tool-use loop', '#6f7c8a', 0.32);
  loopTitle.position.set(C.x, C.y, 0);
  root.add(loopTitle);

  // --- specialist sub-agents -------------------------------------------------------
  const nodes = SPECIALISTS.map((s, i) => {
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), lit(s.color));
    mesh.position.set(0.5, 4.9 - i * 1.0, 0);
    const l = label(s.name, '#9aa7b4', 0.3);
    l.position.set(0.5, 4.9 - i * 1.0 - 0.48, 0);
    root.add(mesh, l);
    return mesh;
  });

  // --- the board: 12 requested features ----------------------------------------------
  const tileGeo = new THREE.BoxGeometry(0.82, 0.82, 0.16);
  const edgeGeo = new THREE.EdgesGeometry(tileGeo);
  const tiles = Array.from({ length: FEATURES }, (_, i) => {
    const group = new THREE.Group();
    group.position.set(2.9 + (i % 3) * 1.0, 4.4 - Math.floor(i / 3) * 1.0, 0);
    const fill = new THREE.Mesh(tileGeo, lit(SPECIALISTS[Math.max(0, OWNER[i])].color));
    const edge = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0xf08a5d }));
    group.add(fill, edge);
    root.add(group);
    return { group, fill, edge, k: 0 };
  });
  const boardTitle = label('requested · 12 features', '#9aa7b4', 0.3);
  boardTitle.position.set(3.9, 5.35, 0);
  root.add(boardTitle);
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 0.06), basic(0xffffff, 0.8));
  scan.position.set(3.9, 0, 0.2);
  root.add(scan);

  // --- the checklist -----------------------------------------------------------------
  const checklist = new THREE.Group();
  checklist.position.set(-6.6, 0, 0);
  const checks = Array.from({ length: FEATURES }, (_, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.08), basic(0x3a4656));
    m.position.set(0, 5.05 - i * 0.39, 0);
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.02), basic(0x263140));
    line.position.set(0.75, 5.05 - i * 0.39, 0);
    checklist.add(m, line);
    return m.material as THREE.MeshBasicMaterial;
  });
  const checkTitle = label('checklist', '#9aa7b4', 0.32);
  checkTitle.position.set(0.45, 5.6, 0);
  checklist.add(checkTitle);
  root.add(checklist);

  // --- the rig: seven architectures on the same bench ---------------------------------------
  const rig = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 6, 28), basic(0x3a4656));
    r.position.set((i - 3) * 1.9, 7.3, -2);
    rig.add(r);
  }
  const rigTitle = label('test rig · 7 architectures, one score', '#9aa7b4', 0.36);
  rigTitle.position.set(0, 8.35, -2);
  rig.add(rigTitle);
  root.add(rig);

  // --- beams from a specialist to the tile it just built ---------------------------------------
  const beams = Array.from({ length: 4 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), basic(0xffffff));
    m.visible = false;
    root.add(m);
    return { m, t: 1, from: new THREE.Vector3(), to: new THREE.Vector3() };
  });
  let nextBeam = 0;

  let angle = A_MODEL, calls = 0, gateFlash = 0, prevBuilt = 1, passedGate = false;
  const pulse = [0, 0, 0, 0, 0];

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      angle = A_MODEL;
      calls = 0;
      prevBuilt = 1;
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      // The loop keeps turning: each lap is one model call, each pass through the gate validates.
      angle -= dt * 2.6;
      if (angle < A_MODEL - Math.PI * 2) {
        angle += Math.PI * 2;
        calls++;
        passedGate = false;
      }
      onRing(angle, token.position);
      token.position.z = 0.12;
      const gateAngle = A_GATE - Math.PI * 2;
      if (!passedGate && angle < gateAngle) {
        passedGate = true;
        gateFlash = 1;
      }
      gateFlash = Math.max(0, gateFlash - dt * 1.6);
      gateMat.color.setHex(0x3a4656).lerp(gateOn, gateFlash);
      model.rotation.y = time * 0.8;
      tool.rotation.set(time * 0.5, time * 0.7, 0);

      // How much of the board is built at this point of the replay.
      const build = clamp01((p - 0.55) / 0.85);
      const built = p < 0.55 ? 1 : 1 + Math.floor(build * 10 + 0.001);
      if (built > prevBuilt) {
        const i = built - 1, owner = OWNER[i];
        pulse[owner] = 1;
        const b = beams[nextBeam++ % beams.length];
        b.from.copy(nodes[owner].position);
        b.to.copy(tiles[i].group.position);
        b.t = 0;
        (b.m.material as THREE.MeshBasicMaterial).color.setHex(SPECIALISTS[owner].color);
      }
      prevBuilt = built;

      tiles.forEach((tile, i) => {
        const on = i < built;
        tile.k += ((on ? 1 : 0) - tile.k) * Math.min(1, dt * 6);
        tile.fill.visible = tile.k > 0.02;
        tile.fill.scale.setScalar(Math.max(0.001, easeOut(tile.k)));
        tile.edge.visible = !on;
      });
      nodes.forEach((n, i) => {
        pulse[i] = Math.max(0, pulse[i] - dt * 2);
        n.scale.setScalar(1 + pulse[i] * 0.7);
        n.rotation.y = time * 0.9 + i;
      });
      for (const b of beams) {
        b.t = Math.min(1, b.t + dt * 2.6);
        b.m.visible = b.t < 1;
        b.m.position.lerpVectors(b.from, b.to, easeOut(b.t));
      }

      const showList = easeOut((p - 0.5) / 0.3);
      checklist.visible = rig.visible = showList > 0;
      checklist.scale.setScalar(Math.max(0.001, showList));
      rig.scale.setScalar(Math.max(0.001, showList));
      checks.forEach((m, i) => m.color.setHex(i < built && p >= 0.55 ? 0x5dcaa5 : i === FEATURES - 1 && built >= 11 ? 0xf08a5d : 0x3a4656));

      // Measuring: a scan line sweeps the board and counts what is really there.
      const measuring = p >= 1.5 && p < 2.5;
      scan.visible = measuring;
      scan.position.y = 4.9 - ((time * 1.4) % 1) * 4.1;

      if (p < 1.5) {
        cam.pos.set(-0.9, 4.2, 12.8);
        cam.target.set(-0.9, 4, 0);
      } else if (p < 2.5) {
        cam.pos.set(5.6, 3.4, 7.2);
        cam.target.set(2.8, 3, 0);
      } else {
        cam.pos.set(-0.9, 5, 13.6);
        cam.target.set(-0.9, 4, -0.5);
      }

      const pct = Math.round((built / FEATURES) * 100);
      ctx.hud(
        row('model calls', calls) +
          row(ctx.t.schema, `${ctx.t.valid} ✓`, 'ok') +
          (p >= 0.55 ? row(ctx.t.checklist, `${built}/${FEATURES}`) : '') +
          cells(FEATURES, built) +
          row(ctx.t.coverage, `${pct}%`, pct < 50 ? 'bad' : 'ok'),
      );
    },
  };
}
