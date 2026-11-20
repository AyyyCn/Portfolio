import * as THREE from 'three';
import { C, basic, box, front, labelAt, line, lit, portal, sceneRoot } from '../kit';
import { Bots, row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut, rng } from '../world';

// Five generic engine primitives and three new kinds of game that need them.
const PRIMS = [
  { name: 'gravity fields', games: [0] },
  { name: 'portals', games: [1] },
  { name: 'voxel worlds', games: [2] },
  { name: 'hit regions', games: [2] },
  { name: 'abilities', games: [0, 2] },
];
const NEEDS = [[0, 4], [1], [2, 3, 4]];
const heightAt = (x: number, z: number): number => 1 + Math.floor((Math.sin(x * 0.9) + Math.cos(z * 0.8) + 2) * 0.5);
const NEED_TEXT = ['needs gravity fields, abilities', 'needs portals', 'needs voxels, hit regions, abilities'];

/**
 * A small planet you walk around, a kart race through portals, and a voxel
 * arena stay inert until the primitives they need come online. The karts on
 * the middle island are the world karts, scaled down.
 */
export function engine(ctx: Ctx): Lens {
  const t = ctx.t;
  const w = ctx.world;
  const root = sceneRoot();
  const rand = rng(3);
  const bots = new Bots(w);
  const XS = [-4.8, -0.4, 4.0];
  const BASE_Y = 3.1;
  const SCALE = 0.088;

  XS.forEach((x, i) => {
    const pl = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 2.1, 0.3, 28), lit(C.slab));
    pl.position.set(x, BASE_Y - 0.15, 0);
    root.add(pl);
    labelAt(root, ['planet walker', 'portal race', 'voxel arena'][i], x, BASE_Y - 0.75, 0.5, '#a3a9b8', 0.26);
  });

  // Planet walker: a character walks all the way round a small planet.
  const planet = new THREE.Group();
  planet.position.set(XS[0], BASE_Y + 1.35, 0);
  planet.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), lit(0x4f9a5c)));
  for (let i = 0; i < 5; i++) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 0), lit(C.grey));
    rock.position.setFromSphericalCoords(1.05, rand() * Math.PI, rand() * Math.PI * 2);
    planet.add(rock);
  }
  const orbit = new THREE.Group();
  const walker = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.16, 2, 6), lit(C.white));
  walker.position.y = 1.2;
  orbit.add(walker);
  planet.add(orbit);
  root.add(planet);

  // Portal race: the kart island in miniature, with a pair of portals on the track.
  // Each portal faces along the track, so the karts drive through it.
  const portals = [0.22, 0.66].map((u) => {
    const p = portal(3.4);
    p.group.rotation.y = w.trackPose(u * w.trackLength, 0, p.group.position);
    p.group.position.y += 3.0;
    return p;
  });

  // Voxel arena: blocks, two fighters, an ability burst and a hit flash.
  const voxels = new THREE.Group();
  voxels.position.set(XS[2], BASE_Y, 0);
  voxels.scale.setScalar(1.3);
  const cube = new THREE.BoxGeometry(0.34, 0.34, 0.34);
  const blocks: THREE.Mesh[] = [];
  for (let x = -3; x < 3; x++) {
    for (let z = -3; z < 3; z++) {
      if (Math.hypot(x + 0.5, z + 0.5) > 3.2) continue;
      const h = heightAt(x, z);
      for (let y = 0; y < h; y++) {
        const m = new THREE.Mesh(cube, lit(y === h - 1 ? 0x4f9a5c : 0x8a6b4a));
        m.position.set((x + 0.5) * 0.36, 0.17 + y * 0.35, (z + 0.5) * 0.36);
        m.userData.y = m.position.y;
        voxels.add(m);
        blocks.push(m);
      }
    }
  }
  /** Standing height on the block column under a point of the arena. */
  const standY = (px: number, pz: number): number => {
    const x = Math.max(-3, Math.min(2, Math.floor(px / 0.36))), z = Math.max(-3, Math.min(2, Math.floor(pz / 0.36)));
    return heightAt(x, z) * 0.35 + 0.2;
  };
  const fighters = [C.white, C.blue].map((c) => {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.2, 2, 6), lit(c));
    voxels.add(m);
    return m;
  });
  const burst = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 32), basic(C.sun));
  burst.rotation.x = Math.PI / 2;
  const hitBox = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.32, 0.5, 0.32)), new THREE.LineBasicMaterial({ color: C.red }));
  voxels.add(burst, hitBox);
  root.add(voxels);

  const missing = NEED_TEXT.map((s, i) => labelAt(root, s, XS[i], BASE_Y + 2.75, 0, '#e0795a', 0.24));

  // The primitives and their links to the games that use them
  const RACK_Y = 0.55, RACK_Z = 2.2;
  const prims = PRIMS.map((s, i) => {
    const x = -5.4 + i * 2.5;
    const block = box(0.5, 0.5, 0.5, lit(C.teal));
    block.position.set(x, RACK_Y, RACK_Z);
    root.add(block);
    labelAt(root, s.name, x, RACK_Y - 0.6, RACK_Z + 0.3, '#eef0f5', 0.22);
    const links = s.games.map((g) => {
      const l = line(block.position, new THREE.Vector3(XS[g], BASE_Y - 0.3, 0.6), C.dim);
      root.add(l);
      return l.material as THREE.LineBasicMaterial;
    });
    return { block, links };
  });
  labelAt(root, 'engine primitives', -0.4, RACK_Y - 1.15, RACK_Z + 0.3, '#7a8296', 0.24);
  const total = labelAt(root, '100 complete games shipped to production', -0.4, 6.2, 0.2, '#5dcaa5', 0.34);

  const saved = { scale: 1, pos: new THREE.Vector3() };
  const tmp = new THREE.Vector3();

  return {
    enter() {
      saved.scale = w.root.scale.x;
      saved.pos.copy(w.root.position);
      w.features.water.visible = false;
      w.root.scale.setScalar(SCALE);
      w.root.position.set(XS[1], BASE_Y + 0.12, 0);
      for (const r of portals) w.root.add(r.group);
      bots.reset();
      ctx.scene.add(root);
    },
    exit() {
      for (const r of portals) w.root.remove(r.group);
      w.root.scale.setScalar(saved.scale);
      w.root.position.copy(saved.pos);
      w.features.water.visible = true;
      w.features.karts.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      // Primitives come online one after the other during the build phase.
      const on = PRIMS.map((_, i) => p >= 0.75 + i * 0.18);
      prims.forEach((s, i) => {
        const k = easeOut((p - 0.65 - i * 0.18) / 0.2);
        s.block.visible = k > 0;
        s.block.scale.setScalar(Math.max(0.001, k));
        s.block.rotation.y = time * 0.6 + i;
        for (const l of s.links) l.color.setHex(on[i] ? C.teal : C.dim);
      });
      const ready = NEEDS.map((needs) => needs.every((n) => on[n]));
      missing.forEach((l, i) => (l.visible = !ready[i]));

      // Planet walker: without gravity fields the walker just stands on top.
      orbit.rotation.z = ready[0] ? -time * 0.9 : 0;
      planet.rotation.y = time * 0.15;
      walker.position.y = 1.2 + (ready[0] ? Math.abs(Math.sin(time * 4)) * 0.12 : 0);

      // Portal race: portals appear and the karts race once they exist.
      for (const r of portals) {
        r.group.visible = on[1];
        if (on[1]) r.update(dt, time, 1, 4);
      }
      w.features.karts.visible = ready[1];
      if (ready[1]) bots.update(dt);

      // Voxel arena: blocks rise with the voxel primitive; fighters need hit regions and abilities.
      const rise = easeOut((p - 0.95) / 0.4);
      blocks.forEach((b) => {
        b.visible = on[2];
        b.position.y = b.userData.y * Math.max(0.05, rise);
      });
      for (const f of fighters) f.visible = ready[2];
      fighters[0].position.set(Math.cos(time * 0.9) * 0.7, 0, Math.sin(time * 0.9) * 0.7);
      fighters[1].position.set(Math.cos(time * 0.7 + 2.6) * 0.8, 0, Math.sin(time * 1.1 + 2.6) * 0.6);
      for (const f of fighters) f.position.y = standY(f.position.x, f.position.z);
      const cycle = (time * 0.6) % 1;
      burst.visible = ready[2] && cycle < 0.5;
      burst.position.copy(fighters[0].position);
      burst.scale.setScalar(0.2 + cycle * 2.2);
      tmp.subVectors(fighters[1].position, fighters[0].position);
      hitBox.visible = burst.visible && cycle * 2.2 * 1 > tmp.length() - 0.2;
      hitBox.position.copy(fighters[1].position);

      total.visible = p >= 2.6;

      front(cam, -0.4, 3.0, 13.4);

      const running = ready.filter(Boolean).length;
      ctx.hud(
        row(t.primitives, `${on.filter(Boolean).length}/5`) +
          row(t.games, `${running}/3`, running === 3 ? 'ok' : 'bad') +
          (p >= 2.6 ? row(t.shipped, '100', 'ok') : ''),
      );
    },
  };
}
