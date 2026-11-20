import * as THREE from 'three';
import { C, basic, label, portal as makePortal } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut } from '../world';

// Vehicles on the island: one kart alone, then driven by physics (force lines
// at the wheels, body roll in corners), then AI opponents join, then the wide
// view with the three kinds of vehicle game the system serves.

const SPEEDS = [9.6, 9.1, 8.8, 8.4];

export function vehicles(ctx: Ctx): Lens {
  const t = ctx.t;
  const w = ctx.world;
  const s = [0, -3.4, -6.4, -9.4];
  const hero = w.karts[0];

  // Force lines under the hero kart's wheels, as children so they follow it.
  const forces = [[-0.44, 0.42], [0.44, 0.42], [-0.44, -0.42], [0.44, -0.42]].map(([x, z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, 0.05), basic(C.teal));
    m.position.set(x, 0, z);
    return m;
  });
  const aiTags = [1, 2, 3].map(() => label('AI', '#eef0f5', 0.28));
  const genres = new THREE.Group();
  for (const [text, x, z] of [['circuit racing', -15, 3], ['kart battles', 15, -3], ['portal races', 0, 12]] as const) {
    const l = label(text, '#eef0f5', 1.1);
    l.material.fog = false;
    l.position.set(x, 6, z);
    genres.add(l);
  }
  const gate = makePortal(2.8);
  const portal = gate.group;

  let prevYaw = 0, roll = 0, lastS0 = 0;
  const camPos = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  return {
    enter() {
      s[0] = 0;
      s[1] = -3.4;
      s[2] = -6.4;
      s[3] = -9.4;
      for (const f of forces) hero.add(f);
      aiTags.forEach((l, i) => w.karts[i + 1].add(l));
      for (const l of aiTags) l.position.set(0, 1.45, 0);
      w.root.add(genres, portal);
      const u = 0.5 * w.trackLength;
      portal.rotation.y = w.trackPose(u, 0, portal.position);
      portal.position.y += 2.4;
      prevYaw = hero.rotation.y;
    },
    exit() {
      for (const f of forces) hero.remove(f);
      aiTags.forEach((l, i) => w.karts[i + 1].remove(l));
      w.root.remove(genres, portal);
      for (const k of w.karts) {
        k.visible = true;
        k.rotation.z = 0;
      }
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const driving = p >= 1;
      const opponents = p >= 2;
      const wide = easeOut((p - 2.5) / 0.4);

      if (driving) s[0] += SPEEDS[0] * dt;
      if (opponents) for (let i = 1; i < 4; i++) s[i] += SPEEDS[i] * (0.9 + 0.1 * Math.sin(s[i] * 0.2 + i)) * dt;
      else for (let i = 1; i < 4; i++) s[i] = s[0] - 3.4 * i;
      w.karts.forEach((k, i) => {
        w.placeOnTrack(k, s[i], i % 2 ? 0.75 : -0.75);
        k.visible = i === 0 || opponents;
      });

      // Body roll from the turn rate, and force lines that shorten on bumps.
      const yaw = hero.rotation.y;
      let dyaw = yaw - prevYaw;
      if (dyaw > Math.PI) dyaw -= Math.PI * 2;
      if (dyaw < -Math.PI) dyaw += Math.PI * 2;
      prevYaw = yaw;
      const target = driving && dt > 0 ? Math.max(-0.25, Math.min(0.25, (dyaw / dt) * 0.18)) : 0;
      roll += (target - roll) * Math.min(1, dt * 6);
      hero.rotation.z = roll;
      forces.forEach((f, i) => {
        const len = driving ? 0.55 + 0.25 * Math.sin(s[0] * 2.3 + i * 1.7) + (i % 2 ? -roll : roll) * 1.4 : 0.4;
        f.visible = p >= 0.9 && p < 2.6;
        f.scale.y = Math.max(0.1, len);
        f.position.y = -len / 2 + 0.05;
      });
      for (const l of aiTags) l.visible = opponents && wide < 0.5;
      genres.visible = portal.visible = wide > 0.5;
      if (portal.visible) gate.update(dt, time, 1, 5);

      // Chase camera behind the hero kart, then pull out to the island.
      const back = driving ? 6.5 : 4.8;
      tmp.set(-Math.sin(yaw) * back, 2.6, -Math.cos(yaw) * back);
      camPos.copy(hero.position).add(tmp);
      const a = time * 0.06 + 0.9;
      tmp.set(Math.cos(a) * 36, 22, Math.sin(a) * 36);
      cam.pos.lerpVectors(camPos, tmp, wide);
      cam.target.lerpVectors(tmp.copy(hero.position).setY(hero.position.y + 0.6), new THREE.Vector3(0, 1, 0), wide);
      lastS0 = s[0];

      const laps = Math.max(0, Math.floor(lastS0 / w.trackLength));
      ctx.hud(
        row(t.physics, driving ? t.on : t.off, driving ? 'ok' : '') +
          row(t.opponents, opponents ? '3' : '0', opponents ? 'ok' : '') +
          row(t.mode, opponents ? `${t.solo} · ${t.online}` : t.solo) +
          (driving ? row(t.laps, laps) : ''),
      );
    },
  };
}
