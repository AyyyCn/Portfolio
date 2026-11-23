import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { C, basic, box, labelAt, sceneRoot } from '../kit';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut } from '../world';

const Y = 1.2;

type Part = 'wood' | 'metal' | 'glass' | 'brass';

/** An old lantern from simple solids. `fine` sets the tessellation: the raw mesh is very dense, the cleaned one light. */
function lanternParts(fine: boolean): { geo: THREE.BufferGeometry; part: Part }[] {
  const r = fine ? 72 : 8;
  const h = fine ? 28 : 1;
  const parts: { geo: THREE.BufferGeometry; part: Part }[] = [];
  const add = (geo: THREE.BufferGeometry, part: Part, x: number, y: number, z: number): void => {
    geo.translate(x, y, z);
    parts.push({ geo, part });
  };
  add(new THREE.CylinderGeometry(0.95, 1.02, 0.26, r, h), 'wood', 0, 0.13, 0);
  add(new THREE.CylinderGeometry(0.8, 0.8, 0.12, r, h), 'metal', 0, 0.32, 0);
  add(new THREE.CylinderGeometry(0.6, 0.6, 1.4, r, h, true), 'glass', 0, 1.08, 0);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    add(new THREE.BoxGeometry(0.1, 1.42, 0.1, fine ? 6 : 1, fine ? 40 : 1, fine ? 6 : 1), 'metal', Math.cos(a) * 0.64, 1.08, Math.sin(a) * 0.64);
  }
  add(new THREE.CylinderGeometry(0.82, 0.82, 0.12, r, h), 'metal', 0, 1.84, 0);
  add(new THREE.ConeGeometry(0.88, 0.62, r, h), 'metal', 0, 2.2, 0);
  add(new THREE.SphereGeometry(0.12, fine ? 40 : 6, fine ? 30 : 4), 'brass', 0, 2.56, 0);
  const handle = new THREE.TorusGeometry(0.32, 0.05, fine ? 24 : 4, fine ? 96 : 10, Math.PI);
  add(handle, 'brass', 0, 2.62, 0);
  return parts;
}

/** Merge parts into one mesh, as a generator outputs it. The raw one gets a little surface noise. */
function merged(parts: { geo: THREE.BufferGeometry }[], noise: number): THREE.BufferGeometry {
  const geos = parts.map(({ geo }) => {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.deleteAttribute('uv');
    return g;
  });
  const out = mergeGeometries(geos)!;
  if (noise) {
    const pos = out.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = Math.sin(x * 9.1 + y * 5.3) * Math.cos(z * 8.7 - y * 3.1) * noise;
      pos.setXYZ(i, x * (1 + n), y + n * 0.3, z * (1 + n));
    }
  }
  out.computeVertexNormals();
  return out;
}

/** A generated reference image: a lantern sketch, varied per candidate. */
function sketch(seed: number): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const g = cv.getContext('2d')!;
  const bgs = ['#eef1e6', '#f3ece4', '#eaf0f5', '#f1eef4'];
  g.fillStyle = bgs[seed % 4];
  g.fillRect(0, 0, 256, 256);
  const w = [70, 92, 80, 64][seed], hgt = [96, 80, 104, 120][seed];
  const cx = 128, base = 210;
  const metal = ['#56514b', '#3c3f47', '#6b5a3e', '#4a4f57'][seed];
  // glow
  const glow = g.createRadialGradient(cx, base - 30 - hgt / 2, 4, cx, base - 30 - hgt / 2, 90);
  glow.addColorStop(0, 'rgba(255,200,110,0.55)');
  glow.addColorStop(1, 'rgba(255,200,110,0)');
  g.fillStyle = glow;
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#8a6a4a';
  g.fillRect(cx - w / 2 - 12, base - 14, w + 24, 14);
  g.fillStyle = '#ffd98a';
  g.fillRect(cx - w / 2, base - 18 - hgt, w, hgt);
  g.fillStyle = '#ff9f43';
  g.beginPath();
  g.ellipse(cx, base - 18 - hgt / 2, 8, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = metal;
  for (const x of [cx - w / 2 - 4, cx + w / 2 - 4]) g.fillRect(x, base - 22 - hgt, 8, hgt + 8);
  g.fillRect(cx - w / 2 - 8, base - 26 - hgt, w + 16, 8);
  g.beginPath();
  g.moveTo(cx - w / 2 - 10, base - 26 - hgt);
  g.lineTo(cx, base - 64 - hgt);
  g.lineTo(cx + w / 2 + 10, base - 26 - hgt);
  g.fill();
  g.strokeStyle = '#b08a3a';
  g.lineWidth = 6;
  g.beginPath();
  g.arc(cx, base - 70 - hgt, 16, Math.PI, 0);
  g.stroke();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A prompt becomes a dense raw mesh, is cleaned up, then gets its materials. */
function build(ctx: Ctx): Lens {
  const scene = sceneRoot();
  const root = new THREE.Group();
  root.position.y = Y;
  scene.add(root);

  // Reference images generated from the prompt; the ranking keeps one.
  const cards = [0, 1, 2, 3].map((i) => {
    const g = new THREE.Group();
    g.position.set((i - 1.5) * 1.9, Y + 5.6, -1);
    const back = box(1.56, 1.56, 0.04, basic(0xd5dbe3));
    back.position.set(0.04, -0.05, -0.03);
    const img = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: sketch(i) }));
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.62, 1.62, 0.06)), new THREE.LineBasicMaterial({ color: C.teal }));
    g.add(back, img, frame);
    scene.add(g);
    return { g, frame };
  });
  const BEST = 2;
  labelAt(scene, 'reference images · ranked', 0, Y + 6.85, -1, '#a3a9b8', 0.28);
  labelAt(scene, 'prompt → image → mesh → retopology → materials → GLB', 0, 0.35, 3.2, '#7a8296', 0.24);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.3, 0.4, 40), new THREE.MeshLambertMaterial({ color: 0xf4f6f9 }));
  pedestal.position.y = -0.2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.04, 6, 48), new THREE.MeshBasicMaterial({ color: 0x5dcaa5 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.02;
  root.add(pedestal, ring);

  const turn = new THREE.Group();
  root.add(turn);

  const rawGeo = merged(lanternParts(true), 0.035);
  const lowParts = lanternParts(false);
  const lowGeo = merged(lanternParts(false), 0);
  const grey = new THREE.MeshLambertMaterial({ color: 0x9aa3ad });
  const raw = new THREE.Mesh(rawGeo, grey);
  const rawWire = new THREE.Mesh(rawGeo, new THREE.MeshBasicMaterial({ color: 0x12161d, wireframe: true, transparent: true, opacity: 0.22 }));
  const low = new THREE.Mesh(lowGeo, new THREE.MeshLambertMaterial({ color: 0x9aa3ad, flatShading: true }));
  const lowWire = new THREE.Mesh(lowGeo, new THREE.MeshBasicMaterial({ color: 0xe0795a, wireframe: true }));
  lowWire.scale.setScalar(1.004);

  // Final asset: the clean mesh with its materials, and a flame lighting it from inside.
  const mats: Record<Part, THREE.Material> = {
    wood: new THREE.MeshLambertMaterial({ color: 0x8a6243 }),
    metal: new THREE.MeshLambertMaterial({ color: 0x3f3b38 }),
    brass: new THREE.MeshLambertMaterial({ color: 0xc9a04a, emissive: 0x3a2a08 }),
    glass: new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }),
  };
  const final = new THREE.Group();
  for (const { geo, part } of lowParts) final.add(new THREE.Mesh(geo, mats[part]));
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), basic(0xff9f43));
  flame.scale.set(1, 1.9, 1);
  flame.position.y = 1.0;
  const glow = new THREE.PointLight(0xffb45a, 3, 5, 1.5);
  glow.position.y = 1.1;
  final.add(flame, glow);
  for (const m of [raw, low]) m.castShadow = true;
  turn.add(raw, rawWire, low, lowWire, final);
  turn.scale.setScalar(1.15);

  const tris = (g: THREE.BufferGeometry): number => (g.index ? g.index.count : g.attributes.position.count) / 3;
  const rawTris = tris(rawGeo), lowTris = tris(lowGeo);
  const fmt = (n: number): string => n.toLocaleString('en-US').replace(/,/g, ' ');

  return {
    enter() {
      ctx.world.root.visible = false;
      ctx.scene.add(scene);
    },
    exit() {
      ctx.world.root.visible = true;
      ctx.scene.remove(scene);
    },
    update(_dt: number, p: number, time: number, cam: CamPose) {
      const stage = p < 0.45 ? 0 : p < 1.55 ? 1 : p < 2.55 ? 2 : 3;
      raw.visible = rawWire.visible = stage === 1;
      low.visible = lowWire.visible = stage === 2;
      final.visible = stage === 3;
      const grow = stage === 1 ? easeOut((p - 0.45) / 0.3) : stage === 2 ? easeOut((p - 1.55) / 0.2) * 0.15 + 0.85 : 1;
      turn.scale.setScalar(1.15 * Math.max(0.001, grow));
      turn.rotation.y = time * 0.35;
      flame.scale.set(1 + Math.sin(time * 13) * 0.06, 1.9 + Math.sin(time * 9) * 0.15, 1);
      glow.intensity = 3 + Math.sin(time * 11) * 0.3;

      cards.forEach((c, i) => {
        const ranked = p >= 0.25;
        c.frame.visible = ranked && i === BEST;
        c.g.scale.setScalar(ranked && i !== BEST ? 0.78 : 1);
        c.g.position.y = Y + 5.6 + Math.sin(time * 1.2 + i) * 0.05;
      });

      cam.pos.set(0, Y + 3.6, 12.2);
      cam.target.set(0, Y + 2.9, 0);

      const t = ctx.t;
      let html = row(t.prompt, t.promptText);
      if (stage === 1) html += row(t.raw, `${fmt(rawTris)} ${t.triangles}`, 'bad');
      if (stage >= 2) html += row(t.decimated, `${fmt(rawTris)} → ${fmt(lowTris)}`, 'ok') + row(t.qa, '✓', 'ok');
      if (stage === 3) html += row(t.textured, '✓', 'ok');
      ctx.hud(html);
    },
  };
}

/** The dense mesh is only generated the first time this replay is shown. */
export function textto3d(ctx: Ctx): Lens {
  let lens: Lens | null = null;
  const get = (): Lens => (lens ??= build(ctx));
  return {
    enter: () => get().enter(),
    exit: () => lens?.exit(),
    update: (dt, p, time, cam) => get().update(dt, p, time, cam),
  };
}
