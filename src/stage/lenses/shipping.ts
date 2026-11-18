import * as THREE from 'three';
import { Bots, row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut } from '../world';

/** Bots play the finished game: every checkpoint they cross lights up and is counted. */
export function shipping(ctx: Ctx): Lens {
  const w = ctx.world;
  const bots = new Bots(w);
  const lead = new THREE.Vector3();
  let passed = 0;
  let last = [0, 0, 0, 0];

  const reset = (): void => {
    bots.reset();
    passed = 0;
    last = [...bots.s];
    for (const cp of w.checkpoints) cp.mat.emissiveIntensity = 0;
  };

  return {
    enter: reset,
    exit() {
      for (const cp of w.checkpoints) cp.mat.emissiveIntensity = 0;
      for (const k of w.karts) {
        k.visible = true;
        k.scale.setScalar(1);
      }
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const spawn = easeOut((p - 0.55) / 0.3);
      for (const k of w.karts) {
        k.visible = spawn > 0;
        k.scale.setScalar(Math.max(0.001, spawn));
      }
      if (p < 1.05) reset();
      else {
        bots.update(dt);
        const L = w.trackLength;
        for (let i = 0; i < 4; i++) {
          for (const cp of w.checkpoints) {
            const a = Math.floor((last[i] - cp.s) / L), b = Math.floor((bots.s[i] - cp.s) / L);
            if (b > a) {
              passed++;
              cp.mat.emissiveIntensity = 1.6;
            }
          }
          last[i] = bots.s[i];
        }
      }
      for (const cp of w.checkpoints) cp.mat.emissiveIntensity *= 1 - Math.min(1, dt * 2.2);

      const yaw = w.trackPose(bots.s[0], 0, lead);
      if (p < 1) {
        cam.pos.set(30, 9, -14);
        cam.target.set(17, 1, 0);
      } else if (p < 1.5) {
        cam.target.set(lead.x, lead.y + 0.5, lead.z);
        cam.pos.set(lead.x - Math.sin(yaw) * 10, lead.y + 5, lead.z - Math.cos(yaw) * 10);
      } else if (p < 2.5) {
        cam.target.copy(lead);
        cam.pos.set(lead.x * 0.25, 30, lead.z * 0.25 + 6);
      } else {
        const a = time * 0.1;
        cam.pos.set(Math.cos(a) * 36, 17, Math.sin(a) * 36);
        cam.target.set(0, 1, 0);
      }

      const laps = Math.max(0, Math.floor(bots.s[0] / w.trackLength));
      ctx.hud(row(ctx.t.bots, spawn > 0 ? 4 : 0) + row(ctx.t.checkpoints, passed, passed ? 'ok' : '') + row(ctx.t.laps, laps));
    },
  };
}
