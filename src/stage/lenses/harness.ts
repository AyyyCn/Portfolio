import * as THREE from 'three';
import { C, basic, box, front, label, labelAt, line, lit, sceneRoot } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { clamp01, easeOut } from '../world';

// The agent harness: one tool-use loop (model → tool → validation gate),
// specialist sub-agents, a cost meter with its ceiling and a failure breaker.
// Without the harness one big answer lets a broken part into the game and the
// cost runs past any limit; with it, a part that breaks its contract is sent
// back and revised, and the game is assembled only from parts that passed.

const SPECIALISTS = [
  { name: 'world', color: C.teal },
  { name: 'logic', color: C.blue },
  { name: 'vfx', color: C.orange },
  { name: 'ui', color: C.violet },
  { name: 'audio', color: C.sun },
];
const BROKEN = 2;

export function harness(ctx: Ctx): Lens {
  const t = ctx.t;
  const root = sceneRoot();

  // --- prompt -------------------------------------------------------------------------
  const prompt = box(2.3, 0.7, 0.06, lit(C.slab));
  prompt.position.set(-7.0, 6.6, 0);
  root.add(prompt);
  labelAt(root, '"a kart island"', -7.0, 6.6, 0.1, '#eef0f5', 0.26);
  labelAt(root, 'prompt', -7.0, 7.25, 0, '#7a8296', 0.22);

  // --- the loop -----------------------------------------------------------------------
  const CEN = new THREE.Vector3(-3.4, 3.4, 0), R = 1.9;
  const ringMat = basic(C.dim);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.035, 8, 64), ringMat);
  ring.position.copy(CEN);
  root.add(ring);
  const onRing = (a: number, out: THREE.Vector3): THREE.Vector3 => out.set(CEN.x + Math.cos(a) * R, CEN.y + Math.sin(a) * R, 0);
  const A_MODEL = Math.PI / 2, A_TOOL = -Math.PI / 6, A_GATE = (7 * Math.PI) / 6;

  const model = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), lit(C.white));
  onRing(A_MODEL, model.position);
  const loop = new THREE.Group();
  const tool = box(0.6, 0.6, 0.6, lit(C.grey));
  onRing(A_TOOL, tool.position);
  const gateMat = basic(C.dim);
  const gate = new THREE.Group();
  for (const [w, h, x, y] of [[0.1, 1, -0.45, 0], [0.1, 1, 0.45, 0], [1, 0.1, 0, 0.5]] as const) {
    const bar = box(w, h, 0.1, gateMat);
    bar.position.set(x, y, 0);
    gate.add(bar);
  }
  onRing(A_GATE, gate.position);
  gate.rotation.z = A_GATE + Math.PI / 2;
  const token = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), basic(C.white));
  loop.add(tool, gate, token);
  for (const [text, a, dx, dy] of [['tool', A_TOOL, 0.95, -0.35], ['validation gate', A_GATE, -0.6, -1.0]] as const) {
    const l = label(text, '#a3a9b8', 0.32);
    onRing(a, l.position);
    l.position.x += dx;
    l.position.y += dy;
    loop.add(l);
  }
  labelAt(loop, 'tool-use loop', CEN.x, CEN.y, 0, '#7a8296', 0.28);
  root.add(model, loop);
  labelAt(root, 'model', CEN.x, CEN.y + R + 0.75, 0, '#a3a9b8', 0.32);

  // --- specialist sub-agents ---------------------------------------------------------------
  const agents = new THREE.Group();
  const nodes = SPECIALISTS.map((s, i) => {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), lit(s.color));
    m.position.set(0.3, 5.6 - i * 0.95, 0);
    labelAt(agents, s.name, 1.15, 5.6 - i * 0.95, 0, '#a3a9b8', 0.26);
    agents.add(m);
    return m;
  });
  labelAt(agents, 'sub-agents', 0.6, 6.5, 0, '#7a8296', 0.24);
  root.add(agents);

  // --- the game, part by part ---------------------------------------------------------------
  const GAME = new THREE.Vector3(4.6, 3.6, 0);
  const tileGeo = new THREE.BoxGeometry(1.1, 1.1, 0.2);
  const edgeGeo = new THREE.EdgesGeometry(tileGeo);
  const slot = (i: number, merged: number): THREE.Vector3 => {
    const col = i % 3, rowI = Math.floor(i / 3);
    const gap = 1.3 - 0.18 * merged;
    return new THREE.Vector3(GAME.x + (col - 1 + (rowI ? 0.5 : 0)) * gap, GAME.y + 0.65 - rowI * gap, 0);
  };
  const tiles = SPECIALISTS.map((s) => {
    const g = new THREE.Group();
    const okMat = lit(s.color);
    const fill = new THREE.Mesh(tileGeo, okMat);
    const edge = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: C.dim }));
    g.add(fill, edge);
    root.add(g);
    return { g, fill, okMat, edge };
  });
  const brokenMat = lit(C.red);
  labelAt(root, 'game parts', GAME.x, GAME.y + 1.85, 0, '#7a8296', 0.24);
  const playable = labelAt(root, 'playable game ✓', GAME.x, GAME.y - 2.1, 0, '#5dcaa5', 0.32);
  const brokenTag = labelAt(root, 'broken part in the game', GAME.x, GAME.y - 2.1, 0, '#e0795a', 0.26);

  // A part travelling between the gate and the board
  const courier = box(0.4, 0.4, 0.1, lit(C.orange));
  root.add(courier);
  const sentBack = labelAt(root, 'contract broken · sent back', -1.0, 1.0, 0.2, '#e0795a', 0.24);

  // --- cost meter, ceiling and breaker ---------------------------------------------------------------
  const METER = new THREE.Vector3(-8.4, 0.6, 0), MAXH = 4.4, CEIL = 2.8;
  const frameM = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, MAXH, 0.1)), new THREE.LineBasicMaterial({ color: C.dim }));
  frameM.position.set(METER.x, METER.y + MAXH / 2, 0);
  const costMat = lit(C.teal);
  const cost = box(0.5, 1, 0.1, costMat);
  root.add(frameM, cost);
  labelAt(root, 'cost', METER.x, METER.y - 0.4, 0, '#a3a9b8', 0.24);
  const ceiling = new THREE.Group();
  ceiling.add(line(new THREE.Vector3(METER.x - 0.6, METER.y + CEIL, 0.1), new THREE.Vector3(METER.x + 0.6, METER.y + CEIL, 0.1), C.white));
  labelAt(ceiling, 'ceiling', METER.x + 1.3, METER.y + CEIL, 0.1, '#eef0f5', 0.22);
  const breaker = new THREE.Group();
  breaker.position.set(METER.x + 1.6, METER.y + MAXH - 0.6, 0);
  const lever = box(0.08, 0.5, 0.08, basic(C.teal));
  lever.position.y = 0.2;
  breaker.add(box(0.5, 0.12, 0.2, lit(C.grey)), lever);
  labelAt(breaker, 'failure breaker · armed', 0, -0.45, 0, '#a3a9b8', 0.2);
  root.add(ceiling, breaker);
  const noLimit = labelAt(root, 'no limit', METER.x, METER.y + MAXH + 0.35, 0, '#e0795a', 0.22);

  // A beam from the sub-agent being called to the model
  const beam = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), basic(C.white));
  root.add(beam);

  let angle = A_MODEL, lap = 0, beamT = 1, beamFrom = 0, gateFlash = 0, passed = false, calls = 0;
  const v = new THREE.Vector3();

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      angle = A_MODEL;
      calls = 0;
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const harnessOn = p >= 1;
      const checking = p >= 2;
      const show = easeOut((p - 0.85) / 0.3);
      loop.visible = agents.visible = show > 0;
      loop.scale.setScalar(Math.max(0.001, show));
      agents.scale.setScalar(Math.max(0.001, show));
      ringMat.color.setHex(harnessOn ? 0x3a4256 : C.dim);
      ceiling.visible = breaker.visible = checking;
      noLimit.visible = !checking;
      model.rotation.y = time * 0.8;
      tool.rotation.set(time * 0.5, time * 0.7, 0);

      // The loop turns; each lap calls one sub-agent and passes through the gate.
      if (harnessOn) {
        angle -= dt * 2.4;
        if (angle < A_MODEL - Math.PI * 2) {
          angle += Math.PI * 2;
          lap++;
          calls++;
          passed = false;
          beamFrom = lap % SPECIALISTS.length;
          beamT = 0;
        }
        if (!passed && angle < A_GATE - Math.PI * 2) {
          passed = true;
          gateFlash = 1;
        }
      }
      onRing(angle, token.position);
      token.position.z = 0.12;
      gateFlash = Math.max(0, gateFlash - dt * 1.6);
      gateMat.color.setHex(C.dim).lerp(new THREE.Color(checking ? C.teal : 0x3a4256), checking ? gateFlash : 0.5);
      beamT = Math.min(1, beamT + dt * 2.2);
      beam.visible = harnessOn && beamT < 1;
      beam.position.lerpVectors(nodes[beamFrom].position, model.position, easeOut(beamT));
      (beam.material as THREE.MeshBasicMaterial).color.setHex(SPECIALISTS[beamFrom].color);
      nodes.forEach((n, i) => {
        n.rotation.y = time * 0.9 + i;
        n.scale.setScalar(1 + (beam.visible && i === beamFrom ? 0.5 * (1 - beamT) : 0));
      });

      // Which parts are in the game at this point of the replay, and whether the broken one is.
      const start = p < 1 ? 0.1 : 1.15;
      const rejectAt = 2.1, fixedAt = 2.4;
      const merged = easeOut((p - 2.55) / 0.35);
      let present = 0, broken = false;
      tiles.forEach((tile, i) => {
        let on = p >= start + i * 0.13;
        let bad = i === BROKEN && p < rejectAt;
        if (i === BROKEN && p >= rejectAt && p < fixedAt) on = false;
        if (on) present++;
        if (on && bad) broken = true;
        tile.fill.visible = on;
        tile.fill.material = bad ? brokenMat : tile.okMat;
        (tile.edge.material as THREE.LineBasicMaterial).color.setHex(on ? (bad ? C.red : C.line) : C.dim);
        tile.g.position.copy(slot(i, merged));
        tile.g.rotation.y = on ? 0 : Math.sin(time + i) * 0.1;
      });
      playable.visible = p >= 2.6;
      brokenTag.visible = broken && p >= 0.6;

      // The rejected vfx part travels back from the board to the gate, then returns revised.
      const back = clamp01((p - rejectAt) / 0.15), forth = clamp01((p - (fixedAt - 0.12)) / 0.12);
      courier.visible = p >= rejectAt && p < fixedAt;
      sentBack.visible = courier.visible;
      const slotP = slot(BROKEN, 0);
      v.copy(gate.position);
      courier.position.lerpVectors(slotP, v, easeOut(back));
      if (forth > 0) {
        courier.position.lerpVectors(v, slotP, easeOut(forth));
        (courier.material as THREE.MeshLambertMaterial).color.setHex(C.orange);
      } else (courier.material as THREE.MeshLambertMaterial).color.setHex(C.red);

      // Cost: without the harness it climbs past where the ceiling will be; with it, it stays under.
      const spend = p < 1 ? 0.6 + p * 5 : p < 2 ? 0.6 + (p - 1) * 1.4 : Math.min(CEIL - 0.3, 2.0 + (p - 2) * 0.4);
      const h = Math.min(MAXH, spend);
      cost.scale.y = h;
      cost.position.set(METER.x, METER.y + h / 2, 0.02);
      costMat.color.setHex(h > CEIL ? C.red : C.teal);

      front(cam, -1.3, 3.7, 13.6);

      ctx.hud(
        row(t.parts, `${present}/5`, present === 5 && !broken ? 'ok' : '') +
          row(t.gate, !harnessOn ? '—' : checking ? (p < fixedAt && p >= rejectAt ? t.rejected : t.passed) : t.off, checking ? (p >= rejectAt && p < fixedAt ? 'bad' : 'ok') : '') +
          row(t.cost, h > CEIL ? t.over : checking ? t.under : '…', h > CEIL ? 'bad' : checking ? 'ok' : '') +
          (harnessOn ? row(t.calls, calls) : ''),
      );
    },
  };
}
