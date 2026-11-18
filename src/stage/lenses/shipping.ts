import * as THREE from 'three';
import { C, basic, box, front, labelAt, line, lit, sceneRoot } from '../kit';
import { Bots, row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut, rng } from '../world';

/**
 * Three shipped games as dioramas (a shooter arena, the kart island, a voxel
 * world). Each one exposes a gap; the gap is closed by a block from the shared
 * rack of engine primitives, and an external coding agent inspects them live.
 */
export function shipping(ctx: Ctx): Lens {
  const w = ctx.world;
  const root = sceneRoot();
  const rand = rng(3);
  const bots = new Bots(w);
  const XS = [-4.6, -0.4, 3.8];
  const BASE_Y = 2.6;

  const plinths = XS.map((x, i) => {
    const pl = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 2.1, 0.3, 28), lit(C.slab));
    pl.position.set(x, BASE_Y - 0.15, 0);
    root.add(pl);
    labelAt(root, ['tactical shooter', 'kart racer', 'voxel world'][i], x, BASE_Y - 0.75, 0.5, '#9aa7b4', 0.26);
    return pl;
  });

  // Shooter arena
  const arena = new THREE.Group();
  arena.position.set(XS[0], BASE_Y, 0);
  for (let i = 0; i < 6; i++) {
    const wall = box(0.25 + rand() * 0.7, 0.45, 0.2, lit(C.grey));
    wall.position.set((rand() - 0.5) * 2.2, 0.22, (rand() - 0.5) * 2.2);
    wall.rotation.y = rand() > 0.5 ? 0 : Math.PI / 2;
    arena.add(wall);
  }
  const fighters = [C.red, C.blue].map((c) => {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.22, 2, 6), lit(c));
    arena.add(m);
    return m;
  });
  const tracer = box(0.03, 0.03, 1, basic(C.sun));
  arena.add(tracer);
  root.add(arena);

  // Voxel world
  const voxels = new THREE.Group();
  voxels.position.set(XS[2], BASE_Y, 0);
  const cube = new THREE.BoxGeometry(0.34, 0.34, 0.34);
  const cubes: THREE.Mesh[] = [];
  for (let x = -3; x < 3; x++) {
    for (let z = -3; z < 3; z++) {
      if (Math.hypot(x + 0.5, z + 0.5) > 3.2) continue;
      const h = 1 + Math.floor((Math.sin(x * 0.9) + Math.cos(z * 0.8) + 2) * 0.9);
      for (let y = 0; y < h; y++) {
        const m = new THREE.Mesh(cube, lit(y === h - 1 ? 0x4f9a5c : y > 0 ? 0x8a6b4a : 0x7c8794));
        m.position.set((x + 0.5) * 0.36, 0.17 + y * 0.35, (z + 0.5) * 0.36);
        m.userData.order = cubes.length;
        voxels.add(m);
        cubes.push(m);
      }
    }
  }
  voxels.scale.setScalar(1.3);
  root.add(voxels);

  // Gaps and the shared rack of engine primitives
  const rackY = 0.5;
  labelAt(root, 'engine primitives · shared by every game', -0.4, rackY - 0.65, 2.4, '#9aa7b4', 0.28);
  const gapPos = [new THREE.Vector3(XS[0] + 0.9, BASE_Y + 1.5, 0.3), new THREE.Vector3(XS[1] + 1.0, BASE_Y + 1.7, 0.3), new THREE.Vector3(XS[2] - 0.9, BASE_Y + 1.9, 0.3)];
  const prims = gapPos.map((gp, i) => {
    const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, 0.5, 0.5)), new THREE.LineBasicMaterial({ color: C.orange }));
    ghost.position.copy(gp);
    const block = box(0.46, 0.46, 0.46, lit([C.teal, C.blue, C.violet][i]));
    const home = new THREE.Vector3(-1.4 + i * 1.0, rackY, 2.4);
    const stay = box(0.46, 0.46, 0.46, lit([C.teal, C.blue, C.violet][i]));
    stay.position.copy(home);
    root.add(ghost, block, stay);
    return { ghost, block, stay, home, gp };
  });

  // External coding agent over MCP
  const agent = new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), lit(C.white));
  agent.position.set(-0.4, 7.6, 0);
  root.add(agent);
  const agentLabel = labelAt(root, 'coding agent · MCP', -0.4, 8.25, 0, '#9aa7b4', 0.28);
  const links = XS.map((x) => {
    const l = line(agent.position, new THREE.Vector3(x, BASE_Y + 2.2, 0), C.dim);
    root.add(l);
    return l;
  });
  const probe = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), basic(C.white));
  root.add(probe);
  const total = labelAt(root, '10+ games and maps in production', -0.4, 9.1, 0, '#5dcaa5', 0.32);

  const saved = { scale: 1, pos: new THREE.Vector3() };
  const tmp = new THREE.Vector3();

  return {
    enter() {
      saved.scale = w.root.scale.x;
      saved.pos.copy(w.root.position);
      w.features.water.visible = false;
      w.root.scale.setScalar(0.088);
      w.root.position.set(XS[1], BASE_Y + 0.12, 0);
      bots.reset();
      ctx.scene.add(root);
    },
    exit() {
      w.root.scale.setScalar(saved.scale);
      w.root.position.copy(saved.pos);
      w.features.water.visible = true;
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      const built = easeOut((p - 0.1) / 0.8);
      bots.update(dt);

      arena.scale.setScalar(Math.max(0.001, built) * 1.35);
      fighters[0].position.set(Math.cos(time * 0.9) * 0.9, 0.22, Math.sin(time * 0.9) * 0.9);
      fighters[1].position.set(Math.cos(time * 0.7 + 2.6) * 1.0, 0.22, Math.sin(time * 1.1 + 2.6) * 0.8);
      const firing = Math.sin(time * 5) > 0.6;
      tracer.visible = firing;
      tmp.subVectors(fighters[1].position, fighters[0].position);
      tracer.scale.z = tmp.length();
      tracer.position.copy(fighters[0].position).addScaledVector(tmp, 0.5);
      tracer.lookAt(tmp.add(arena.position).add(fighters[0].position));

      const shown = Math.floor(built * cubes.length);
      for (const c of cubes) c.visible = c.userData.order < shown;
      w.root.scale.setScalar(0.088 * Math.max(0.02, built));

      // Gaps appear once the games exist, then get filled from the rack.
      let closed = 0;
      prims.forEach((pr, i) => {
        const k = easeOut((p - 1.5 - i * 0.25) / 0.4);
        pr.ghost.visible = p >= 0.9 && k < 1;
        pr.ghost.rotation.y = time * 0.8;
        pr.stay.visible = p >= 1.3;
        pr.block.visible = k > 0;
        pr.block.position.lerpVectors(pr.home, pr.gp, k);
        pr.block.rotation.y = time * 0.8;
        if (k >= 1) closed++;
      });

      const inspecting = p >= 1;
      agent.visible = agentLabel.visible = probe.visible = inspecting;
      for (const l of links) l.visible = inspecting;
      agent.rotation.y = time;
      const target = Math.floor(time * 0.7) % 3, f = (time * 0.7) % 1;
      probe.position.lerpVectors(agent.position, tmp.set(XS[target], BASE_Y + 2.2, 0), f);
      total.visible = p >= 2.5;

      front(cam, -0.4, 4.2, 13.6, time, 0.9);
      for (const pl of plinths) pl.rotation.y = 0;

      ctx.hud(row('games on the bench', built > 0.5 ? 3 : 0) + row('gaps found', p >= 0.9 ? 3 : 0, p >= 0.9 && closed < 3 ? 'bad' : '') + row('closed by a primitive', closed, closed === 3 ? 'ok' : ''));
    },
  };
}
