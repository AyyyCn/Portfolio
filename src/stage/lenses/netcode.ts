import * as THREE from 'three';
import { C, basic, box, front, labelAt, sceneRoot } from '../kit';
import { foot, row, slider, type CamPose, type Ctx, type Lens, type Slider } from '../types';

const H = 1 / 60;
const W = 10, X0 = -5.6;
const LANES = { a: 6.4, s: 3.9, b: 1.4 } as const;

interface State { s: number; v: number }
interface Input { seq: number; thr: number; at: number }
interface Snap { seq: number; s: number; v: number; at: number }
interface Packet { m: THREE.Mesh; from: number; to: number; x: number; t0: number; t1: number }

const integrate = (st: State, thr: number): State => {
  const v = st.v + (thr * 7 - 0.6 * st.v) * H;
  return { s: st.s + v * H, v };
};
/** Maps a distance travelled to a back-and-forth position on a lane. */
const lane = (s: number): number => {
  const u = (((s * 0.09) % 2) + 2) % 2;
  return X0 + (u < 1 ? u : 2 - u) * W;
};
/** The target is a server-side bot with a known path, so its past can be recomputed exactly. */
const targetAt = (time: number): number => X0 + (0.5 + 0.42 * Math.sin(time * 1.3) + 0.08 * Math.sin(time * 3.1)) * W;

/**
 * A real client/server simulation: client A, the server and client B as three
 * lanes. Inputs and snapshots travel as packets that take half the latency
 * each way. A predicts and reconciles; when A shoots, the server rewinds the
 * target by A's latency (up to 250 ms) before judging the hit.
 */
export function netcode(ctx: Ctx): Lens {
  const root = sceneRoot();
  for (const [key, name] of [['a', 'client A · shooter'], ['s', 'server · authority'], ['b', 'client B · observer']] as const) {
    const y = LANES[key];
    const rail = box(W + 0.6, 0.04, 0.04, basic(C.dim));
    rail.position.set(X0 + W / 2, y, 0);
    root.add(rail);
    labelAt(root, name, X0 + W - 1.8, y + 0.75, 0, '#a3a9b8', 0.3);
  }
  const dot = (color: number, y: number, r = 0.26, wire = false): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), new THREE.MeshBasicMaterial({ color, wireframe: wire }));
    m.position.y = y;
    root.add(m);
    return m;
  };
  const aPred = dot(C.red, LANES.a), aNaive = dot(C.red, LANES.a, 0.26, true);
  const aSeesTarget = dot(C.blue, LANES.a, 0.22);
  const sA = dot(C.red, LANES.s, 0.22), sTarget = dot(C.blue, LANES.s, 0.26), sRewound = dot(C.blue, LANES.s, 0.34, true);
  const bSeesA = dot(C.red, LANES.b, 0.22), bTarget = dot(C.blue, LANES.b, 0.26);
  const rewindBar = box(1, 0.06, 0.06, basic(C.sun));
  rewindBar.position.y = LANES.s - 0.5;
  root.add(rewindBar);
  const rewindLabel = labelAt(root, 'rewind', 0, LANES.s - 0.85, 0, '#d9b86a', 0.26);
  const shot = box(0.05, 1, 0.05, basic(C.sun));
  root.add(shot);

  const packets: Packet[] = Array.from({ length: 28 }, () => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), basic(C.white));
    m.visible = false;
    root.add(m);
    return { m, from: 0, to: 0, x: 0, t0: 0, t1: -1 };
  });
  let nextPacket = 0;
  const send = (from: number, to: number, x: number, t0: number, t1: number, color: number): void => {
    const pk = packets[nextPacket++ % packets.length];
    Object.assign(pk, { from, to, x, t0, t1 });
    (pk.m.material as THREE.MeshBasicMaterial).color.setHex(color);
  };

  let now = 0, acc = 0, tick = 0, seq = 0, srvSeq = 0, bumpIn = 150;
  let pred: State = { s: 0, v: 0 }, srv: State = { s: 0, v: 0 };
  let naive = 0, offset = 0, corrections = 0, bSees = 0;
  let pending: Input[] = [], up: Input[] = [], down: Snap[] = [];
  let shots: { at: number; aim: number; fired: number }[] = [];
  let hits = 0, fired = 0, lastMiss = 0, lastRewind = 0, flash = 0, nextShot = 1.5;
  let ctl: Slider | null = null;
  let shooting = false;
  let seed = 1;
  const rand = (): number => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const step = (latency: number): void => {
    now += H;
    tick++;
    const half = latency / 2000;

    const thr = Math.sin(now * 0.7) + Math.sin(now * 1.9 + 1) > -0.7 ? 1 : 0;
    const input: Input = { seq: ++seq, thr, at: now + half };
    pending.push(input);
    up.push(input);
    pred = integrate(pred, thr);
    if (tick % 8 === 0) send(LANES.a, LANES.s, lane(pred.s), now, now + half, C.red);

    while (up.length && up[0].at <= now) {
      const inp = up.shift()!;
      srv = integrate(srv, inp.thr);
      srvSeq = inp.seq;
      if (--bumpIn <= 0) {
        srv.v *= 0.4;
        bumpIn = 170 + Math.floor(rand() * 170);
      }
    }
    if (tick % 4 === 0) {
      down.push({ seq: srvSeq, s: srv.s, v: srv.v, at: now + half });
      if (tick % 8 === 0) {
        send(LANES.s, LANES.a, lane(srv.s), now, now + half, C.teal);
        send(LANES.s, LANES.b, lane(srv.s), now, now + half, C.teal);
      }
    }
    while (down.length && down[0].at <= now) {
      const snap = down.shift()!;
      naive = snap.s;
      bSees = snap.s;
      pending = pending.filter((i) => i.seq > snap.seq);
      let st: State = { s: snap.s, v: snap.v };
      for (const i of pending) st = integrate(st, i.thr);
      const err = pred.s - st.s;
      if (Math.abs(err) > 0.02) {
        corrections++;
        offset += err;
      }
      pred = st;
    }
    offset *= 0.9;

    // Shooting: A aims at the target where it sees it, i.e. half a latency in the past.
    if (shooting && now >= nextShot) {
      nextShot = now + 1.4;
      shots.push({ at: now + half, aim: targetAt(now - half), fired: now });
      send(LANES.a, LANES.s, targetAt(now - half), now, now + half, C.sun);
    }
    while (shots.length && shots[0].at <= now) {
      const sh = shots.shift()!;
      const rewind = Math.min(0.25, now - sh.fired + half);
      const rewound = targetAt(now - rewind);
      fired++;
      if (Math.abs(rewound - sh.aim) < 0.3) hits++;
      lastMiss = Math.abs(targetAt(now) - sh.aim);
      lastRewind = rewind * 1000;
      flash = 1;
      sRewound.position.x = rewound;
    }
  };

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(root);
      now = acc = tick = seq = srvSeq = naive = offset = corrections = bSees = hits = fired = lastMiss = lastRewind = flash = 0;
      bumpIn = 150;
      nextShot = 1.5;
      pred = { s: 0, v: 0 };
      srv = { s: 0, v: 0 };
      pending = [];
      up = [];
      down = [];
      shots = [];
      for (const pk of packets) pk.t1 = -1;
      ctl = slider(ctx.controls, ctx.t.latency, 0, 250, 120, ' ms');
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(root);
      ctl = null;
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const phase = Math.round(p);
      if (ctl && !ctl.touched) ctl.set(phase === 3 ? 250 : 120);
      const latency = ctl ? ctl.value : 120;
      shooting = phase >= 2;
      acc += dt;
      while (acc >= H) {
        step(latency);
        acc -= H;
      }
      flash = Math.max(0, flash - dt * 1.4);
      const half = latency / 2000;

      aPred.visible = phase >= 1;
      aNaive.visible = phase <= 1;
      aPred.position.x = lane(pred.s + offset);
      aNaive.position.x = lane(naive);
      sA.position.x = lane(srv.s);
      bSeesA.position.x = lane(bSees);
      sTarget.position.x = bTarget.position.x = targetAt(now);
      aSeesTarget.position.x = targetAt(now - half);

      sRewound.visible = rewindBar.visible = rewindLabel.visible = shot.visible = shooting && flash > 0;
      const tx = targetAt(now), rx = sRewound.position.x;
      rewindBar.scale.x = Math.max(0.02, Math.abs(tx - rx));
      rewindBar.position.x = (tx + rx) / 2;
      rewindLabel.position.x = (tx + rx) / 2;
      shot.position.set(rx, (LANES.a + LANES.s) / 2, 0);
      shot.scale.y = LANES.a - LANES.s;

      for (const pk of packets) {
        const k = (now - pk.t0) / Math.max(1e-4, pk.t1 - pk.t0);
        pk.m.visible = k >= 0 && k <= 1 && pk.t1 > 0;
        pk.m.position.set(pk.x, pk.from + (pk.to - pk.from) * k, 0.1);
      }

      front(cam, -0.6, 4.1, 13.2, time, 0.5);

      const t = ctx.t;
      let html = row(t.latency, `${latency} ms`);
      if (phase === 0) html += row(t.behind, `${Math.abs(lane(pred.s) - lane(naive)).toFixed(1)} m`, 'bad');
      if (phase >= 1) html += row(t.corrections, corrections);
      if (phase >= 2) html += row('rewind', `${lastRewind.toFixed(0)} ms`) + row('miss without it', `${lastMiss.toFixed(1)} m`, 'bad') + row('hits', `${hits}/${fired}`, 'ok');
      ctx.hud(html + foot(t.live));
    },
  };
}
