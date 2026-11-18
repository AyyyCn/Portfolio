import * as THREE from 'three';
import { bars, foot, row, slider, type CamPose, type Ctx, type Lens, type Slider } from '../types';
import { rng } from '../world';

const MAX = 400;

/**
 * A horde chases a kart. The readouts are real measurements of this page:
 * time spent in the AI step, in transforms, and in the render call.
 */
export function profiler(ctx: Ctx): Lens {
  const w = ctx.world;
  const rand = rng(99);
  const mesh = new THREE.InstancedMesh(
    new THREE.CapsuleGeometry(0.2, 0.45, 2, 6),
    new THREE.MeshLambertMaterial({ flatShading: true }),
    MAX,
  );
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  const px = new Float32Array(MAX), pz = new Float32Array(MAX);
  const vx = new Float32Array(MAX), vz = new Float32Array(MAX);
  const ox = new Float32Array(MAX), oz = new Float32Array(MAX);
  const color = new THREE.Color();
  for (let i = 0; i < MAX; i++) {
    const a = rand() * 6.28, r = 2 + rand() * 7;
    ox[i] = Math.cos(a) * r;
    oz[i] = Math.sin(a) * r;
    mesh.setColorAt(i, color.setHSL(0.02 + rand() * 0.07, 0.75, 0.5 + rand() * 0.15));
  }
  const o = new THREE.Object3D();
  const lead = new THREE.Vector3();
  let s = 0, count = 30, aiMs = 0, xfMs = 0;
  let ctl: Slider | null = null;

  const scatter = (): void => {
    w.trackPose(s, 0, lead);
    for (let i = 0; i < MAX; i++) {
      px[i] = lead.x + ox[i] * 1.6 - 6;
      pz[i] = lead.z + oz[i] * 1.6;
      vx[i] = vz[i] = 0;
    }
  };

  return {
    enter() {
      s = 0;
      scatter();
      ctx.scene.add(mesh);
      for (let i = 1; i < 4; i++) w.karts[i].visible = false;
      ctl = slider(ctx.controls, ctx.t.npcs, 0, MAX, 30, '');
    },
    exit() {
      ctx.scene.remove(mesh);
      for (const k of w.karts) k.visible = true;
      ctl = null;
    },
    update(dt: number, p: number, _time: number, cam: CamPose) {
      const auto = p < 2 ? 30 : p < 3 ? 30 + (p - 2) * (MAX - 30) : 100;
      if (ctl && !ctl.touched) ctl.set(auto);
      count = ctl ? ctl.value : Math.round(auto);

      s += 6.5 * dt;
      w.placeOnTrack(w.karts[0], s, 0);
      const yaw = w.trackPose(s, 0, lead);

      // AI system: seek the kart, keep distance from neighbours.
      let t0 = performance.now();
      for (let i = 0; i < count; i++) {
        let ax = (lead.x + ox[i] - px[i]) * 1.2, az = (lead.z + oz[i] - pz[i]) * 1.2;
        for (let j = 0; j < count; j++) {
          if (j === i) continue;
          const dx = px[i] - px[j], dz = pz[i] - pz[j];
          const d2 = dx * dx + dz * dz;
          if (d2 < 0.5 && d2 > 1e-6) {
            ax += (dx / d2) * 1.4;
            az += (dz / d2) * 1.4;
          }
        }
        vx[i] += ax * dt;
        vz[i] += az * dt;
        const sp = Math.hypot(vx[i], vz[i]);
        const cap = 5.2;
        if (sp > cap) {
          vx[i] *= cap / sp;
          vz[i] *= cap / sp;
        }
        vx[i] *= 1 - 1.5 * dt;
        vz[i] *= 1 - 1.5 * dt;
        px[i] += vx[i] * dt;
        pz[i] += vz[i] * dt;
      }
      let t1 = performance.now();
      aiMs += (t1 - t0 - aiMs) * 0.08;

      // Transform system: ground height and instance matrices.
      t0 = t1;
      for (let i = 0; i < count; i++) {
        o.position.set(px[i], Math.max(-0.2, w.heightAt(px[i], pz[i])) + 0.42, pz[i]);
        o.rotation.y = Math.atan2(vx[i], vz[i]);
        o.updateMatrix();
        mesh.setMatrixAt(i, o.matrix);
      }
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
      t1 = performance.now();
      xfMs += (t1 - t0 - xfMs) * 0.08;

      const back = p < 2 ? 15 : 21, up = p < 2 ? 11 : 17;
      cam.target.copy(lead);
      cam.pos.set(lead.x - Math.sin(yaw) * back + 4, lead.y + up, lead.z - Math.cos(yaw) * back);

      const { frameMs, renderMs } = ctx.stats;
      ctx.hud(
        row(ctx.t.npcs, count) +
          row(ctx.t.fps, Math.round(1000 / Math.max(1, frameMs))) +
          bars(
            [
              ['ai', aiMs],
              ['transforms', xfMs],
              ['render', renderMs],
              [ctx.t.frame, frameMs],
            ],
            16.7,
          ) +
          foot(ctx.t.live),
      );
    },
  };
}
