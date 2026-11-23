import * as THREE from 'three';
import { C, basic, box, card, figure, front, labelAt, line, lit, sceneRoot } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { clamp01, easeOut } from '../world';

// Lessons as cards. The planned path runs along the top row; after the lesson
// where the learner got stuck, the adapted path drops to a different next pair.
const TOP = 5.0, LOW = 2.3;
const XS = [-5.4, -3.4, -1.4, 0.6, 2.6, 4.6];
const STUCK = 3;
const CW = 1.5, CH = 1.1;
const FEET = -1.55; // feet of the learner, relative to the card centre

/**
 * A learner walks past the lessons. On one lesson time on task fills a ring,
 * frustration is detected, an agent answers from the course documents and the
 * path is rerouted through a different next lesson.
 */
export function learning(ctx: Ctx): Lens {
  const root = sceneRoot();

  const lesson = (x: number, y: number, n: number): { strip: THREE.MeshBasicMaterial; g: THREE.Group } => {
    const g = card(CW, CH, 0.14);
    g.position.set(x, y, 0);
    const strip = basic(C.dim);
    const bar = box(CW - 0.3, 0.12, 0.02, strip);
    bar.position.set(0, CH / 2 - 0.25, 0.02);
    g.add(bar);
    for (let i = 0; i < 3; i++) {
      const w = [0.95, 0.75, 0.85][i];
      const l = box(w, 0.05, 0.02, basic(0xe3e7ed));
      l.position.set(-(CW - 0.3 - w) / 2, 0.05 - i * 0.2, 0.02);
      g.add(l);
    }
    labelAt(g, String(n), CW / 2 - 0.22, -CH / 2 + 0.2, 0.03, '#7a8296', 0.2);
    root.add(g);
    return { strip, g };
  };

  // Planned row, then the adapted pair below the planned next lessons.
  for (let i = 0; i < XS.length - 1; i++) root.add(line(new THREE.Vector3(XS[i] + CW / 2, TOP, -0.1), new THREE.Vector3(XS[i + 1] - CW / 2, TOP, -0.1), C.dim));
  const top = XS.map((x, i) => lesson(x, TOP, i + 1));
  const low = [XS[4], XS[5]].map((x, i) => lesson(x, LOW, 5 + i));
  const detour = line(new THREE.Vector3(XS[STUCK] + CW / 2, TOP - 0.2, -0.1), new THREE.Vector3(XS[4] - CW / 2, LOW + 0.2, -0.1), C.dim);
  const lowLink = line(new THREE.Vector3(XS[4] + CW / 2, LOW, -0.1), new THREE.Vector3(XS[5] - CW / 2, LOW, -0.1), C.dim);
  root.add(detour, lowLink);
  for (const l of low) l.g.visible = false;
  labelAt(root, 'lessons · planned path', XS[0] + 0.9, TOP + 0.95, 0, '#3c3f47', 0.24);
  labelAt(root, 'planned next', (XS[4] + XS[5]) / 2, TOP + 0.95, 0, '#7a8296', 0.22);
  const adaptedLabel = labelAt(root, 'adapted next', XS[4] - 1.75, LOW + 0.1, 0, '#5dcaa5', 0.22);

  // The learner, and a question mark while they are stuck.
  const learner = figure(C.violet);
  root.add(learner);
  const puzzled = labelAt(root, '?', 0, 0, 0.5, '#c94a26', 0.5);

  // Time on task: a ring of ticks above the lesson where the learner stalls.
  const SEG = 24;
  const ringC = new THREE.Vector3(XS[STUCK], TOP + 1.35, 0);
  const ring = Array.from({ length: SEG }, (_, i) => {
    const a = Math.PI / 2 - (i / SEG) * Math.PI * 2;
    const m = box(0.06, 0.16, 0.04, basic(C.dim));
    m.position.set(ringC.x + Math.cos(a) * 0.42, ringC.y + Math.sin(a) * 0.42, 0);
    m.rotation.z = a - Math.PI / 2;
    root.add(m);
    return m;
  });
  const ringLabel = labelAt(root, 'time on task', ringC.x + 1.45, ringC.y, 0, '#7a8296', 0.22);
  const ringParts: THREE.Object3D[] = [ringLabel, ...ring];

  // The assistant: a chat panel that answers from the course documentation (RAG).
  const chat = card(2.6, 1.5, 0.2);
  chat.position.set(-2.4, 1.35, 0.2);
  root.add(chat);
  const agentIcon = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), lit(C.teal));
  agentIcon.position.set(-0.95, 0.42, 0.2);
  chat.add(agentIcon);
  labelAt(chat, 'AI agent · RAG', 0.2, 0.42, 0.05, '#138a63', 0.22);
  const answer = [1.9, 1.5, 1.7].map((w, i) => {
    const l = box(w, 0.07, 0.02, basic(C.teal));
    l.position.set(-1.1 + w / 2, 0.0 - i * 0.24, 0.03);
    chat.add(l);
    return { l, w };
  });

  const docsHome = new THREE.Vector3(-5.4, 0.75, 0.4);
  for (let i = 0; i < 5; i++) {
    const d = box(0.8, 0.06, 0.55, lit(i % 2 ? 0xf4f6f9 : 0xc9cfd8));
    d.position.set(docsHome.x, 0.45 + i * 0.08, docsHome.z);
    root.add(d);
  }
  labelAt(root, 'course documentation', docsHome.x, -0.05, docsHome.z, '#3c3f47', 0.22);
  const pages = Array.from({ length: 3 }, () => {
    const d = new THREE.Group();
    const sheet = box(0.42, 0.56, 0.02, basic(C.slab));
    const ln = box(0.28, 0.04, 0.01, basic(0xc9cfd8));
    ln.position.set(0, 0.1, 0.015);
    d.add(sheet, ln);
    root.add(d);
    return d;
  });
  const reply = line(new THREE.Vector3(), new THREE.Vector3(), C.teal);
  root.add(reply);

  const pos = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const stand = (x: number, y: number): THREE.Vector3 => tmp.set(x, y + FEET, 0.4);
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

      // Walk: along the top row to the stuck lesson, then down to the adapted pair.
      let walking = false;
      if (p < 0.6) {
        const f = (p / 0.6) * STUCK;
        const i = Math.min(STUCK - 1, Math.floor(f));
        const k = easeOut(f - i);
        pos.lerpVectors(stand(XS[i], TOP).clone(), stand(XS[i + 1], TOP), k);
        walking = k > 0.05 && k < 0.95;
      } else if (!rerouted) {
        pos.copy(stand(XS[STUCK], TOP));
      } else {
        const f = clamp01((p - 2.4) / 0.6) * 2;
        const a = f < 1 ? stand(XS[STUCK], TOP).clone() : stand(XS[4], LOW).clone();
        const b = f < 1 ? stand(XS[4], LOW).clone() : stand(XS[5], LOW).clone();
        const k = easeOut(f < 1 ? f : f - 1);
        pos.lerpVectors(a, b, k);
        walking = k > 0.05 && k < 0.95;
      }
      learner.position.copy(pos);
      learner.position.y += walking ? Math.abs(Math.sin(time * 10)) * 0.08 : 0;
      learner.rotation.z = stuck && !detected ? Math.sin(time * 6) * 0.05 : 0;
      puzzled.visible = stuck && !detected;
      puzzled.position.set(pos.x + 0.35, pos.y + 1.3 + Math.sin(time * 3) * 0.05, 0.5);

      const done = p < 0.6 ? Math.floor((p / 0.6) * 3 + 0.01) : rerouted ? 4 + Math.floor(clamp01((p - 2.4) / 0.6) * 2 + 0.01) : 3;
      top.forEach((l, i) => {
        const visited = i < Math.min(done, 3) || (rerouted && i === STUCK);
        l.strip.color.setHex(i === STUCK && stuck ? (detected ? C.sun : C.orange) : visited ? C.teal : C.dim);
      });
      low.forEach((l, i) => {
        l.g.visible = rerouted;
        l.strip.color.setHex(done >= 5 + i ? C.teal : C.dim);
      });
      (detour.material as THREE.LineBasicMaterial).color.setHex(C.teal);
      detour.visible = lowLink.visible = adaptedLabel.visible = rerouted;

      ring.forEach((m, i) => (m.material as THREE.MeshBasicMaterial).color.setHex(i / SEG < fill && p >= 0.6 ? (rerouted ? C.teal : C.orange) : C.dim));
      for (const r of ringParts) r.visible = p >= 0.6;

      const pop = easeOut((p - 1.6) / 0.3);
      chat.visible = detected && !rerouted;
      chat.scale.setScalar(Math.max(0.001, pop));
      agentIcon.rotation.y = time * 1.6;
      answer.forEach((a, i) => {
        const k = clamp01(retrieved * 1.5 - 0.5 - i * 0.15);
        a.l.scale.x = Math.max(0.001, k);
        a.l.position.x = -1.1 + (a.w * k) / 2;
      });
      pages.forEach((d, i) => {
        const k = clamp01(retrieved * 1.4 - i * 0.2);
        d.visible = detected && !rerouted && k > 0 && k < 1;
        d.position.lerpVectors(docsHome, chat.position, easeOut(k));
        d.position.y += Math.sin(k * Math.PI) * 0.8;
        d.rotation.z = (1 - k) * 0.8 * (i - 1);
      });
      reply.visible = detected && !rerouted && retrieved > 0.85;
      const rp = reply.geometry.attributes.position as THREE.BufferAttribute;
      rp.setXYZ(0, chat.position.x + 1.3, chat.position.y + 0.4, 0.2);
      rp.setXYZ(1, pos.x - 0.25, pos.y + 0.5, 0.4);
      rp.needsUpdate = true;

      front(cam, -0.4, 3.9, 12.2, time, 0.6);

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
