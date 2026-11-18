import * as THREE from 'three';
import { C, basic, box, front, labelAt, line, lit, sceneRoot } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { clamp01, easeOut } from '../world';

// Lessons as a graph. The planned path goes through the top row; the adapted
// path leaves it after the lesson where the learner got stuck.
const NODES: [number, number][] = [
  [-5.6, 4.6], [-3.6, 4.6], [-1.6, 4.6], [0.4, 4.6], [2.4, 5.8], [4.4, 5.8],
  [2.4, 3.2], [4.4, 3.2], [0.4, 2.4], [-1.6, 2.4],
];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6], [6, 7], [2, 9], [9, 8], [8, 6]];
const BEFORE = [0, 1, 2, 3];
const AFTER = [3, 6, 7];
const STUCK = 3;

/**
 * A learner moves through lessons. On one lesson time on task fills a ring,
 * frustration is detected, an agent retrieves course documents and the path is
 * rerouted through a different next lesson.
 */
export function learning(ctx: Ctx): Lens {
  const root = sceneRoot();
  const at = (i: number, z = 0): THREE.Vector3 => new THREE.Vector3(NODES[i][0], NODES[i][1], z);
  const adapted = new Set(['3-6', '6-7']);
  const edges = EDGES.map(([a, b]) => {
    const l = line(at(a), at(b), C.dim);
    root.add(l);
    return { l: l.material as THREE.LineBasicMaterial, key: `${a}-${b}`, a, b };
  });
  const nodes = NODES.map(([x, y]) => {
    const mat = lit(C.dim);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.16, 20), mat);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, y, 0);
    root.add(m);
    return mat;
  });
  labelAt(root, 'lessons', NODES[0][0] + 0.2, 5.5, 0, '#a3a9b8', 0.3);
  labelAt(root, 'planned next', 3.4, 6.55, 0, '#7a8296', 0.22);
  const adaptedLabel = labelAt(root, 'adapted next', 3.4, 2.5, 0, '#5dcaa5', 0.22);

  const learner = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), basic(C.sun));
  root.add(learner);

  // Time-on-task ring around the lesson where the learner stalls
  const SEG = 20;
  const ring = Array.from({ length: SEG }, (_, i) => {
    const a = Math.PI / 2 - (i / SEG) * Math.PI * 2;
    const m = box(0.09, 0.2, 0.06, basic(C.dim));
    m.position.set(NODES[STUCK][0] + Math.cos(a) * 0.62, NODES[STUCK][1] + Math.sin(a) * 0.62, 0);
    m.rotation.z = a - Math.PI / 2;
    root.add(m);
    return m.material as THREE.MeshBasicMaterial;
  });
  labelAt(root, 'time on task', NODES[STUCK][0], NODES[STUCK][1] + 1.15, 0, '#7a8296', 0.22);

  // The agent and the course documents it retrieves
  const agent = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), lit(C.teal));
  root.add(agent);
  const agentLabel = labelAt(root, 'LLM agent', 0, 0, 0, '#5dcaa5', 0.24);
  const docsHome = new THREE.Vector3(-3.6, 0.9, 1.5);
  labelAt(root, 'course documentation', docsHome.x, 0.25, 1.5, '#a3a9b8', 0.24);
  for (let i = 0; i < 6; i++) {
    const d = box(0.7, 0.05, 0.5, lit(i % 2 ? 0xeef0f5 : 0xa3a9b8));
    d.position.set(docsHome.x, 0.55 + i * 0.07, 1.5);
    root.add(d);
  }
  const docs = Array.from({ length: 3 }, () => {
    const d = box(0.42, 0.54, 0.03, basic(0xeef0f5));
    root.add(d);
    return d;
  });

  const pos = new THREE.Vector3();
  const along = (path: number[], u: number, out: THREE.Vector3): void => {
    const f = clamp01(u) * (path.length - 1);
    const i = Math.min(path.length - 2, Math.floor(f));
    out.lerpVectors(at(path[i]), at(path[i + 1]), f - i);
  };
  let seconds = 0;

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      seconds = 0;
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const stuck = p >= 0.6 && p < 2.4;
      const fill = clamp01((p - 0.6) / 1.0);
      const detected = p >= 1.6;
      const retrieved = easeOut((p - 1.7) / 0.5);
      const rerouted = p >= 2.4;
      seconds = stuck ? seconds + dt : p < 0.6 ? 0 : seconds;

      if (p < 0.6) along(BEFORE, p / 0.6, pos);
      else if (!rerouted) pos.copy(at(STUCK));
      else along(AFTER, (p - 2.4) / 0.6, pos);
      learner.position.set(pos.x + (stuck && !detected ? Math.sin(time * 9) * 0.04 : 0), pos.y, 0.3);

      const done = p < 0.6 ? Math.floor((p / 0.6) * 3 + 0.01) : rerouted ? 4 + Math.floor(clamp01((p - 2.4) / 0.6) * 2 + 0.01) : 3;
      nodes.forEach((m, i) => {
        const visited = (i < 3 && i < done) || (rerouted && (i === 3 || (i === 6 && done >= 5) || (i === 7 && done >= 6)));
        m.color.setHex(i === STUCK && stuck ? (detected ? C.sun : C.orange) : visited ? C.teal : C.dim);
      });
      ring.forEach((m, i) => m.color.setHex(i / SEG < fill && p >= 0.6 ? (rerouted ? C.teal : C.orange) : C.dim));
      for (const e of edges) e.l.color.setHex(rerouted && adapted.has(e.key) ? C.teal : C.dim);
      adaptedLabel.visible = rerouted;

      agent.visible = agentLabel.visible = detected;
      const drop = easeOut((p - 1.6) / 0.3);
      agent.position.set(NODES[STUCK][0] + 1.1, NODES[STUCK][1] + 2.6 - drop * 1.5 + Math.sin(time * 3) * 0.06, 0.2);
      agent.rotation.y = time * 1.6;
      agentLabel.position.set(agent.position.x + 1.1, agent.position.y + 0.1, 0.2);
      docs.forEach((d, i) => {
        const k = clamp01(retrieved * 1.4 - i * 0.2);
        d.visible = detected && k > 0 && !rerouted;
        d.position.lerpVectors(docsHome, agent.position, easeOut(k));
        d.position.x += (i - 1) * 0.5 * k;
        d.position.y -= 0.75 * k;
        d.rotation.y = (1 - k) * 2;
      });

      front(cam, -0.6, 3.6, 13, time, 0.6);

      const t = ctx.t;
      ctx.hud(
        row(t.lessons, done) +
          row(t.timeOnTask, `${seconds.toFixed(0)} s`, stuck ? 'bad' : '') +
          row(t.frustration, detected && !rerouted ? t.detected : '—', detected && !rerouted ? 'bad' : '') +
          row(t.agent, rerouted ? t.unblocked : detected ? 'RAG' : t.watching, detected ? 'ok' : ''),
      );
    },
  };
}
