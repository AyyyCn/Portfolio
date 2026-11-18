import * as THREE from 'three';
import { C, basic, box, front, labelAt, line, lit, sceneRoot } from '../kit';
import { Bots, row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut, rng } from '../world';

// Four shared gameplay systems and the games that run on them.
const SYSTEMS = [
  { name: 'weapons', games: [0] },
  { name: 'vehicles', games: [1] },
  { name: 'NPC navigation', games: [0, 1] },
  { name: 'characters', games: [0, 2] },
];
const NEEDS = [[0, 2, 3], [1, 2], [3]];

/**
 * Three very different games (a shooter arena, the kart island, a voxel world)
 * stay empty until the shared systems they need come online: weapons,
 * vehicles, NPC navigation, characters. One game spec feeds all three.
 */
export function shipping(ctx: Ctx): Lens {
  const w = ctx.world;
  const root = sceneRoot();
  const rand = rng(3);
  const bots = new Bots(w);
  const XS = [-4.6, -0.4, 3.8];
  const BASE_Y = 3.1;
  const SCALE = 0.088;

  XS.forEach((x, i) => {
    const pl = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 2.1, 0.3, 28), lit(C.slab));
    pl.position.set(x, BASE_Y - 0.15, 0);
    root.add(pl);
    labelAt(root, ['tactical shooter', 'kart racer', 'voxel world'][i], x, BASE_Y - 0.75, 0.5, '#a3a9b8', 0.26);
  });

  // Shooter arena: walls are there from the start; fighters and tracer need the systems.
  const arena = new THREE.Group();
  arena.position.set(XS[0], BASE_Y, 0);
  arena.scale.setScalar(1.35);
  for (let i = 0; i < 6; i++) {
    const wall = box(0.25 + rand() * 0.7, 0.45, 0.2, lit(C.grey));
    wall.position.set((rand() - 0.5) * 2.2, 0.22, (rand() - 0.5) * 2.2);
    wall.rotation.y = rand() > 0.5 ? 0 : Math.PI / 2;
    arena.add(wall);
  }
  const fighters = [C.white, C.teal].map((c) => {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 2, 6), lit(c));
    arena.add(m);
    return m;
  });
  const tracer = box(0.03, 0.03, 1, basic(C.teal));
  arena.add(tracer);
  root.add(arena);

  // Voxel world with a small walking character
  const voxels = new THREE.Group();
  voxels.position.set(XS[2], BASE_Y, 0);
  voxels.scale.setScalar(1.3);
  const cube = new THREE.BoxGeometry(0.34, 0.34, 0.34);
  const tops: THREE.Vector3[] = [];
  for (let x = -3; x < 3; x++) {
    for (let z = -3; z < 3; z++) {
      if (Math.hypot(x + 0.5, z + 0.5) > 3.2) continue;
      const h = 1 + Math.floor((Math.sin(x * 0.9) + Math.cos(z * 0.8) + 2) * 0.9);
      for (let y = 0; y < h; y++) {
        const m = new THREE.Mesh(cube, lit(y === h - 1 ? 0x4f9a5c : y > 0 ? 0x8a6b4a : 0x7c8794));
        m.position.set((x + 0.5) * 0.36, 0.17 + y * 0.35, (z + 0.5) * 0.36);
        voxels.add(m);
      }
      tops.push(new THREE.Vector3((x + 0.5) * 0.36, 0.17 + h * 0.35 + 0.05, (z + 0.5) * 0.36));
    }
  }
  const walker = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.16, 2, 6), lit(C.white));
  voxels.add(walker);
  root.add(voxels);

  // What each game is still missing
  const missing = [
    labelAt(root, 'needs weapons, NPCs, characters', XS[0], BASE_Y + 2.3, 0, '#e0795a', 0.2),
    labelAt(root, 'needs vehicles, NPCs', XS[1], BASE_Y + 2.3, 0, '#e0795a', 0.2),
    labelAt(root, 'needs characters', XS[2], BASE_Y + 2.3, 0, '#e0795a', 0.2),
  ];

  // The shared systems and their links to the games that use them
  const RACK_Y = 0.55, RACK_Z = 2.2;
  const systems = SYSTEMS.map((s, i) => {
    const x = -4.9 + i * 3.0;
    const block = box(0.5, 0.5, 0.5, lit(C.teal));
    block.position.set(x, RACK_Y, RACK_Z);
    root.add(block);
    labelAt(root, s.name, x, RACK_Y - 0.6, RACK_Z + 0.3, '#eef0f5', 0.24);
    const links = s.games.map((g) => {
      const l = line(block.position, new THREE.Vector3(XS[g], BASE_Y - 0.3, 0.6), C.dim);
      root.add(l);
      return l.material as THREE.LineBasicMaterial;
    });
    return { block, links };
  });
  labelAt(root, 'shared gameplay systems', -0.4, RACK_Y - 1.15, RACK_Z + 0.3, '#7a8296', 0.24);

  // One declarative game spec, written by the agents, feeds every game
  const spec = box(2.6, 0.9, 0.06, lit(C.slab));
  spec.position.set(-0.4, 8.3, 0);
  root.add(spec);
  for (let i = 0; i < 3; i++) {
    const l = box(1.4 + (i % 2) * 0.6, 0.06, 0.02, basic(C.grey));
    l.position.set(-0.4 - (i % 2 ? 0 : 0.3), 8.5 - i * 0.2, 0.05);
    root.add(l);
  }
  labelAt(root, 'game spec · written by the agents', -0.4, 9.15, 0, '#a3a9b8', 0.26);
  for (const x of XS) root.add(line(new THREE.Vector3(-0.4, 7.85, 0), new THREE.Vector3(x, BASE_Y + 2.7, 0), C.dim));

  const tests = labelAt(root, '600+ automated tests · multi-player sessions run on their own', -0.4, 6.75, 0.2, '#5dcaa5', 0.24);
  const total = labelAt(root, '10+ games and maps in production', -0.4, 7.3, 0.2, '#eef0f5', 0.3);

  const saved = { scale: 1, pos: new THREE.Vector3() };
  const tmp = new THREE.Vector3();

  return {
    enter() {
      saved.scale = w.root.scale.x;
      saved.pos.copy(w.root.position);
      w.features.water.visible = false;
      w.root.scale.setScalar(SCALE);
      w.root.position.set(XS[1], BASE_Y + 0.12, 0);
      bots.reset();
      ctx.scene.add(root);
    },
    exit() {
      w.root.scale.setScalar(saved.scale);
      w.root.position.copy(saved.pos);
      w.features.water.visible = true;
      w.features.karts.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      // Systems come online one after the other during the build phase.
      const on = SYSTEMS.map((_, i) => p >= 0.7 + i * 0.25);
      systems.forEach((s, i) => {
        const k = easeOut((p - 0.6 - i * 0.25) / 0.2);
        s.block.visible = k > 0;
        s.block.scale.setScalar(Math.max(0.001, k));
        s.block.rotation.y = time * 0.6 + i;
        for (const l of s.links) l.color.setHex(on[i] ? C.teal : C.dim);
      });
      const ready = NEEDS.map((needs) => needs.every((n) => on[n]));
      missing.forEach((l, i) => (l.visible = !ready[i]));

      // Shooter
      for (const f of fighters) f.visible = ready[0];
      fighters[0].position.set(Math.cos(time * 0.9) * 0.9, 0.22, Math.sin(time * 0.9) * 0.9);
      fighters[1].position.set(Math.cos(time * 0.7 + 2.6) * 1.0, 0.22, Math.sin(time * 1.1 + 2.6) * 0.8);
      tracer.visible = ready[0] && Math.sin(time * 5) > 0.6;
      tmp.subVectors(fighters[1].position, fighters[0].position);
      tracer.scale.z = tmp.length();
      tracer.position.copy(fighters[0].position).addScaledVector(tmp, 0.5);
      tracer.rotation.y = Math.atan2(tmp.x, tmp.z);

      // Kart racer: the island with bots driving once vehicles and navigation exist
      w.features.karts.visible = ready[1];
      if (ready[1]) bots.update(dt);

      // Voxel world: a character hopping from block to block
      walker.visible = ready[2];
      const step = time * 1.2, a = tops[Math.floor(step) % tops.length], b = tops[(Math.floor(step) + 7) % tops.length];
      const f = step % 1;
      walker.position.lerpVectors(a, b, f);
      walker.position.y += Math.sin(f * Math.PI) * 0.35 + 0.12;

      tests.visible = p >= 1.9;
      total.visible = p >= 2.6;

      front(cam, -0.4, 4.3, 15.8);

      const running = ready.filter(Boolean).length;
      ctx.hud(
        row('shared systems', `${on.filter(Boolean).length}/4`) +
          row('games running', `${running}/3`, running === 3 ? 'ok' : 'bad') +
          (p >= 1.9 ? row('automated tests', '600+', 'ok') : ''),
      );
    },
  };
}
