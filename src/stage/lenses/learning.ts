import * as THREE from 'three';
import { row, type CamPose, type Ctx, type Lens } from '../types';

const SPEED = [4.4, 4.0, 3.6, 3.3];
const STUCK = 2;

/**
 * Four learners move through lessons (checkpoints). One gets stuck: time on
 * task climbs, frustration is detected, an agent steps in, the learner resumes.
 */
export function learning(ctx: Ctx): Lens {
  const w = ctx.world;
  const beacon = new THREE.Group();
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), new THREE.MeshBasicMaterial({ color: 0x5dcaa5 }));
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), new THREE.MeshBasicMaterial({ color: 0x5dcaa5, transparent: true, opacity: 0.5 }));
  beam.position.y = -0.9;
  beacon.add(gem, beam);

  const pos = new THREE.Vector3();
  let s = [0, 0, 0, 0], last = [0, 0, 0, 0];
  let lessons = 0, onTask = 0, pace = 1;

  const reset = (): void => {
    s = [-2, -5, -8, -11];
    last = [...s];
    lessons = 0;
    onTask = 0;
    pace = 1;
  };

  return {
    enter() {
      reset();
      ctx.scene.add(beacon);
    },
    exit() {
      ctx.scene.remove(beacon);
      for (const cp of w.checkpoints) cp.mat.emissiveIntensity = 0;
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      if (p < 0.05) reset();
      const stuck = p >= 0.6 && p < 2.45;
      const detected = p >= 1.6;
      pace += ((stuck ? 0 : 1) - pace) * Math.min(1, dt * 3);
      onTask = stuck ? onTask + dt : p < 0.6 ? 0 : onTask;

      const L = w.trackLength;
      for (let i = 0; i < 4; i++) {
        s[i] += SPEED[i] * (i === STUCK ? pace : 1) * dt;
        w.placeOnTrack(w.karts[i], s[i], i % 2 ? 0.75 : -0.75);
        for (const cp of w.checkpoints) {
          if (Math.floor((s[i] - cp.s) / L) > Math.floor((last[i] - cp.s) / L)) {
            lessons++;
            cp.mat.emissiveIntensity = 1.6;
          }
        }
        last[i] = s[i];
      }
      for (const cp of w.checkpoints) cp.mat.emissiveIntensity *= 1 - Math.min(1, dt * 2.2);

      const yaw = w.trackPose(s[STUCK], 0.75, pos);
      beacon.visible = detected && p < 2.9;
      beacon.position.set(pos.x, pos.y + 2.3 + Math.sin(time * 3) * 0.12, pos.z);
      gem.rotation.y = time * 2;

      if (p < 0.6) {
        w.trackPose(s[0], 0, cam.target);
        cam.pos.set(cam.target.x * 0.3, 26, cam.target.z * 0.3 + 8);
      } else {
        cam.target.set(pos.x, pos.y + 0.8, pos.z);
        cam.pos.set(pos.x - Math.sin(yaw) * 7 + Math.cos(yaw) * 4, pos.y + 4.5, pos.z - Math.cos(yaw) * 7 - Math.sin(yaw) * 4);
      }

      const t = ctx.t;
      ctx.hud(
        row(t.learners, 4) +
          row(t.lessons, lessons) +
          row(t.timeOnTask, `${onTask.toFixed(0)} s`, stuck ? 'bad' : '') +
          row(t.frustration, detected && p < 2.45 ? t.detected : '—', detected && p < 2.45 ? 'bad' : '') +
          row(t.agent, p >= 2.45 ? t.unblocked : detected ? 'RAG' : t.watching, detected ? 'ok' : ''),
      );
    },
  };
}
