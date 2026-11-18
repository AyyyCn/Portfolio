import * as THREE from 'three';
import { Bots, foot, row, type CamPose, type Ctx, type Lens } from '../types';

const STATES = [
  { key: 'calm', pace: 1, sun: 0xfff0d2, tone: '' },
  { key: 'frustrated', pace: 0.65, sun: 0xa9c8ff, tone: 'bad' },
  { key: 'joy', pace: 1.3, sun: 0xffd27a, tone: 'ok' },
] as const;

/** The detected emotion changes the game's pace and light; a dashboard tallies it. */
export function emotion(ctx: Ctx): Lens {
  const w = ctx.world;
  const bots = new Bots(w);
  const base = ctx.sun.color.clone();
  const target = new THREE.Color();
  const lead = new THREE.Vector3();
  let clock = 0, pace = 1;
  let share = [0, 0, 0];

  return {
    enter() {
      bots.reset();
      clock = 0;
      pace = 1;
      share = [0, 0, 0];
    },
    exit() {
      ctx.sun.color.copy(base);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const on = p >= 0.5;
      let idx = 0;
      if (on) {
        clock += dt;
        idx = Math.floor(clock / 4.5) % 3;
        share[idx] += dt;
      }
      const st = STATES[idx];
      pace += ((on ? st.pace : 1) - pace) * Math.min(1, dt * 2);
      ctx.sun.color.lerp(target.setHex(on ? st.sun : 0xfff0d2), Math.min(1, dt * 2));
      bots.update(dt * pace);

      const yaw = w.trackPose(bots.s[0], 0, lead);
      if (p < 2.5) {
        cam.target.set(lead.x, lead.y + 0.5, lead.z);
        cam.pos.set(lead.x - Math.sin(yaw) * 10, lead.y + 5.5, lead.z - Math.cos(yaw) * 10);
      } else {
        const a = time * 0.1;
        cam.pos.set(Math.cos(a) * 36, 17, Math.sin(a) * 36);
        cam.target.set(0, 1, 0);
      }

      const t = ctx.t;
      let html = row(t.emotionLabel, on ? t[st.key] : t.off, on ? st.tone : '') + row(t.pace, `×${pace.toFixed(2)}`);
      if (p >= 1.5) {
        const total = share[0] + share[1] + share[2] || 1;
        html += `<div class="hud-bars">${STATES.map((s, i) => {
          const pct = Math.round((share[i] / total) * 100);
          return `<div class="hud-bar"><span>${t[s.key]}</span><span><b style="width:${pct}%"></b></span><em>${pct}%</em></div>`;
        }).join('')}</div>`;
      }
      ctx.hud(html + foot(t.live));
    },
  };
}
