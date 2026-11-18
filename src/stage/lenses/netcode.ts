import * as THREE from 'three';
import { foot, row, slider, type CamPose, type Ctx, type Lens, type Slider } from '../types';

const H = 1 / 60;
interface State { s: number; v: number }
interface Input { seq: number; thr: number; at: number }
interface Snap { seq: number; s: number; v: number; at: number }

const integrate = (st: State, thr: number): State => {
  const v = st.v + (thr * 7 - 0.6 * st.v) * H;
  return { s: st.s + v * H, v };
};

/**
 * A real client/server simulation running in the page: the server is the only
 * authority, inputs and snapshots travel with the latency set on the slider,
 * and the client predicts then reconciles. The server sometimes slows the kart
 * (a hit the client could not predict) to force a visible reconciliation.
 */
export function netcode(ctx: Ctx): Lens {
  const w = ctx.world;
  const ghost = w.makeKart(0xffffff);
  const wire = new THREE.MeshBasicMaterial({ color: 0x5dcaa5, wireframe: true });
  ghost.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = wire;
  });
  ghost.scale.setScalar(1.08);

  let now = 0, acc = 0, tick = 0, seq = 0, srvSeq = 0, bumpIn = 150;
  let pred: State = { s: 0, v: 0 }, srv: State = { s: 0, v: 0 };
  let naive = 0, offset = 0, corrections = 0, maxCorr = 0, maxCorrAge = 0;
  let pending: Input[] = [], up: Input[] = [], down: Snap[] = [];
  let ctl: Slider | null = null;
  const lead = new THREE.Vector3();
  let seed = 1;
  const rand = (): number => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const step = (latency: number): void => {
    now += H;
    tick++;
    const half = latency / 2000;

    // Client: sample input, send it, predict immediately.
    const thr = Math.sin(now * 0.7) + Math.sin(now * 1.9 + 1) > -0.7 ? 1 : 0;
    const input: Input = { seq: ++seq, thr, at: now + half };
    pending.push(input);
    up.push(input);
    pred = integrate(pred, thr);

    // Server: apply the inputs that have arrived.
    while (up.length && up[0].at <= now) {
      const inp = up.shift()!;
      srv = integrate(srv, inp.thr);
      srvSeq = inp.seq;
      if (--bumpIn <= 0) {
        srv.v *= 0.4;
        bumpIn = 170 + Math.floor(rand() * 170);
      }
    }
    if (tick % 4 === 0) down.push({ seq: srvSeq, s: srv.s, v: srv.v, at: now + half });

    // Client: receive snapshots, rewind to the server state, replay unacked inputs.
    while (down.length && down[0].at <= now) {
      const snap = down.shift()!;
      naive = snap.s;
      pending = pending.filter((i) => i.seq > snap.seq);
      let st: State = { s: snap.s, v: snap.v };
      for (const i of pending) st = integrate(st, i.thr);
      const err = pred.s - st.s;
      if (Math.abs(err) > 0.02) {
        corrections++;
        offset += err;
        if (Math.abs(err) > maxCorr) {
          maxCorr = Math.abs(err);
          maxCorrAge = 0;
        }
      }
      pred = st;
    }
    offset *= 0.9;
  };

  return {
    enter() {
      now = acc = tick = seq = srvSeq = naive = offset = corrections = maxCorr = 0;
      bumpIn = 150;
      pred = { s: 0, v: 0 };
      srv = { s: 0, v: 0 };
      pending = [];
      up = [];
      down = [];
      ctx.scene.add(ghost);
      w.karts[2].visible = w.karts[3].visible = false;
      ctl = slider(ctx.controls, ctx.t.latency, 0, 250, 120, ' ms');
    },
    exit() {
      ctx.scene.remove(ghost);
      for (const k of w.karts) k.visible = true;
      ctl = null;
    },
    update(dt: number, p: number, _time: number, cam: CamPose) {
      const latency = ctl ? ctl.value : 120;
      acc += dt;
      while (acc >= H) {
        step(latency);
        acc -= H;
      }
      maxCorrAge += dt;
      if (maxCorrAge > 5) maxCorr *= 0.98;

      const phase = Math.round(p);
      const shown = pred.s + offset;
      const [predKart, naiveKart] = w.karts;
      predKart.visible = phase >= 1;
      naiveKart.visible = phase === 0 || phase === 3;
      ghost.visible = phase === 1 || phase === 2;
      const split = phase === 3 ? 0.8 : 0;
      w.placeOnTrack(predKart, shown, split);
      w.placeOnTrack(naiveKart, naive, -split);
      w.placeOnTrack(ghost, srv.s, split);

      const focus = phase === 0 ? naive : shown;
      const yaw = w.trackPose(focus, 0, lead);
      cam.target.set(lead.x, lead.y + 0.6, lead.z);
      const back = phase === 3 ? 11 : 8.5;
      cam.pos.set(lead.x - Math.sin(yaw) * back + Math.cos(yaw) * 3.5, lead.y + (phase === 3 ? 6.5 : 4.6), lead.z - Math.cos(yaw) * back - Math.sin(yaw) * 3.5);

      const t = ctx.t;
      let html = row(t.latency, `${latency} ms`);
      if (phase === 0 || phase === 3) html += row(t.behind, `${Math.max(0, pred.s - naive).toFixed(1)} m`, 'bad');
      if (phase >= 1) html += row(t.corrections, corrections) + row(t.correction, `${maxCorr.toFixed(2)} m`);
      const sw = (c: string, label: string): string => `<span style="color:${c}">■</span> ${label}`;
      const red = sw('#e24b4a', t.predicted), blue = sw('#378add', t.naive), teal = sw('#5dcaa5', t.server);
      const legend = phase === 0 ? blue : phase === 3 ? `${red} · ${blue}` : `${red} · ${teal}`;
      ctx.hud(html + foot(legend) + foot(t.live));
    },
  };
}
