import * as THREE from 'three';

/** The 12 things the "prompt" asked for. Lens 1 (benchmark) reveals them one by one. */
export const FEATURES = [
  'terrain', 'water', 'track', 'arch', 'checkpoints', 'trees',
  'rocks', 'houses', 'lighthouse', 'lamps', 'karts', 'items',
] as const;
export type FeatureId = (typeof FEATURES)[number];
export type FeatureState = 'hidden' | 'ghost' | 'solid';

// --- deterministic noise ----------------------------------------------------

export function rng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (x: number, y: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
function noise2(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x: number, y: number): number => noise2(x, y) * 0.6 + noise2(x * 2.1, y * 2.1) * 0.3 + noise2(x * 4.3, y * 4.3) * 0.1;
const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
export const easeOut = (x: number): number => 1 - Math.pow(1 - clamp01(x), 3);

// --- world --------------------------------------------------------------------

const SIZE = 64;
const GRID = 80;
const lambert = (color: number, extra: THREE.MeshLambertMaterialParameters = {}): THREE.MeshLambertMaterial =>
  new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });

export class World {
  readonly root = new THREE.Group();
  readonly features = {} as Record<FeatureId, THREE.Group>;
  readonly curve: THREE.CatmullRomCurve3;
  readonly trackLength: number;
  readonly karts: THREE.Group[] = [];
  readonly items: THREE.Mesh[] = [];
  readonly checkpoints: { s: number; mat: THREE.MeshLambertMaterial }[] = [];

  private trackXZ: Float32Array;
  private heights = new Float32Array((GRID + 1) * (GRID + 1));
  private states = {} as Record<FeatureId, FeatureState>;
  private originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  private ghostMat = new THREE.MeshBasicMaterial({ color: 0xf08a5d, wireframe: true, transparent: true, opacity: 0.55 });
  private tmpP = new THREE.Vector3();
  private tmpT = new THREE.Vector3();

  constructor(shadows: boolean) {
    for (const id of FEATURES) {
      const g = new THREE.Group();
      g.name = id;
      this.features[id] = g;
      this.states[id] = 'solid';
      this.root.add(g);
    }

    // Track: a wobbly closed loop. Height follows a gentle base surface.
    const pts: THREE.Vector3[] = [];
    const N = 12;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 1 + 0.16 * Math.sin(3 * a + 1) + 0.06 * Math.sin(5 * a);
      const x = Math.cos(a) * 16 * r, z = Math.sin(a) * 11.5 * r;
      pts.push(new THREE.Vector3(x, this.baseHeight(x, z) + 0.06, z));
    }
    this.curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
    this.curve.arcLengthDivisions = 400;
    this.trackLength = this.curve.getLength();
    const samples = 240;
    this.trackXZ = new Float32Array(samples * 2);
    for (let i = 0; i < samples; i++) {
      const p = this.curve.getPointAt(i / samples);
      this.trackXZ[i * 2] = p.x;
      this.trackXZ[i * 2 + 1] = p.z;
    }
    for (let j = 0; j <= GRID; j++) {
      for (let i = 0; i <= GRID; i++) {
        const x = (i / GRID - 0.5) * SIZE, z = (j / GRID - 0.5) * SIZE;
        this.heights[j * (GRID + 1) + i] = this.computeHeight(x, z);
      }
    }

    this.buildTerrain();
    this.buildWater();
    this.buildTrack();
    this.buildArch();
    this.buildCheckpoints();
    this.buildScatter();
    this.buildHouses();
    this.buildLighthouse();
    this.buildLamps();
    this.buildKarts();
    this.buildItems();

    this.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      this.originals.set(m, m.material);
      if (shadows) {
        m.castShadow = m.parent?.name !== 'terrain' && m.parent?.name !== 'water';
        m.receiveShadow = true;
      }
    });
  }

  // --- queries ---------------------------------------------------------------

  private baseHeight(x: number, z: number): number {
    return 0.55 + 0.45 * Math.sin(x * 0.12) * Math.cos(z * 0.15);
  }

  private trackDistance(x: number, z: number): number {
    let best = Infinity;
    const t = this.trackXZ;
    for (let i = 0; i < t.length; i += 2) {
      const dx = t[i] - x, dz = t[i + 1] - z;
      const d = dx * dx + dz * dz;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }

  private computeHeight(x: number, z: number): number {
    const r = Math.hypot(x, z * 1.25);
    const edge = smooth(28, 21, r);
    const d = this.trackDistance(x, z);
    const hills = fbm(x * 0.085 + 3, z * 0.085 + 7) * 6.5 * smooth(2.6, 8, d);
    return (this.baseHeight(x, z) + hills) * edge - 1.4 * (1 - edge);
  }

  /** Bilinear lookup in the precomputed height grid. */
  heightAt(x: number, z: number): number {
    const fx = clamp01(x / SIZE + 0.5) * GRID, fz = clamp01(z / SIZE + 0.5) * GRID;
    const i = Math.min(GRID - 1, Math.floor(fx)), j = Math.min(GRID - 1, Math.floor(fz));
    const u = fx - i, v = fz - j, w = GRID + 1, h = this.heights;
    const a = h[j * w + i], b = h[j * w + i + 1], c = h[(j + 1) * w + i], d = h[(j + 1) * w + i + 1];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  /** Position and yaw on the track at arc length s (metres), offset sideways by lane. */
  trackPose(s: number, lane: number, out: THREE.Vector3): number {
    const u = (((s / this.trackLength) % 1) + 1) % 1;
    this.curve.getPointAt(u, this.tmpP);
    this.curve.getTangentAt(u, this.tmpT);
    out.set(this.tmpP.x - this.tmpT.z * lane, this.tmpP.y, this.tmpP.z + this.tmpT.x * lane);
    return Math.atan2(this.tmpT.x, this.tmpT.z);
  }

  placeOnTrack(obj: THREE.Object3D, s: number, lane = 0, lift = 0): void {
    obj.rotation.y = this.trackPose(s, lane, obj.position);
    obj.position.y += lift;
  }

  // --- feature states (used by the benchmark lens) -----------------------------

  setFeature(id: FeatureId, state: FeatureState, drop = 1): void {
    const g = this.features[id];
    if (this.states[id] !== state) {
      this.states[id] = state;
      g.visible = state !== 'hidden';
      g.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.material = state === 'ghost' ? this.ghostMat : this.originals.get(m)!;
      });
    }
    const k = easeOut(drop);
    if (id === 'terrain') g.scale.y = 0.02 + 0.98 * k;
    else g.position.y = (1 - k) * 7;
  }

  setAll(state: FeatureState): void {
    for (const id of FEATURES) this.setFeature(id, state, 1);
  }

  // --- construction ------------------------------------------------------------

  private buildTerrain(): void {
    const plane = new THREE.PlaneGeometry(SIZE, SIZE, GRID, GRID);
    plane.rotateX(-Math.PI / 2);
    const pos = plane.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, this.heightAt(pos.getX(i), pos.getZ(i)));
    // Keep only the island: drop triangles that sit on the sea bed.
    const full = plane.toNonIndexed().attributes.position as THREE.BufferAttribute;
    const kept: number[] = [];
    for (let i = 0; i < full.count; i += 3) {
      if (Math.max(full.getY(i), full.getY(i + 1), full.getY(i + 2)) < -1.1) continue;
      for (let k = 0; k < 3; k++) kept.push(full.getX(i + k), full.getY(i + k), full.getZ(i + k));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(kept, 3));
    const p = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(p.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < p.count; i += 3) {
      const h = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
      const span = Math.max(p.getY(i), p.getY(i + 1), p.getY(i + 2)) - Math.min(p.getY(i), p.getY(i + 1), p.getY(i + 2));
      const n = hash(p.getX(i) * 3.1, p.getZ(i) * 2.7);
      if (h < 0.12) c.setHex(0xd8c48a);
      else if (h > 4.6) c.setHex(0xe4eaee);
      else if (span > 0.95 || h > 3.4) c.setHex(n > 0.5 ? 0x7c8794 : 0x6c7683);
      else c.setHex(n > 0.66 ? 0x4f9a5c : n > 0.33 ? 0x45904f : 0x3d8548);
      for (let k = 0; k < 3; k++) c.toArray(colors, (i + k) * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    this.features.terrain.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
  }

  private buildWater(): void {
    const geo = new THREE.PlaneGeometry(420, 420);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: 0x174c60, transparent: true, opacity: 0.94 }));
    mesh.position.y = -0.28;
    this.features.water.add(mesh);
  }

  private ribbon(offset: number, half: number, lift: number, color: number): THREE.Mesh {
    const n = 260;
    const verts: number[] = [];
    const idx: number[] = [];
    const p = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i <= n; i++) {
      this.curve.getPointAt((i % n) / n, p);
      this.curve.getTangentAt((i % n) / n, t);
      const nx = -t.z, nz = t.x;
      verts.push(p.x + nx * (offset - half), p.y + lift, p.z + nz * (offset - half));
      verts.push(p.x + nx * (offset + half), p.y + lift, p.z + nz * (offset + half));
      if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide }));
  }

  private buildTrack(): void {
    const g = this.features.track;
    g.add(this.ribbon(0, 1.7, 0.03, 0x3a3f4b));
    g.add(this.ribbon(-1.6, 0.09, 0.05, 0xe8edf2));
    g.add(this.ribbon(1.6, 0.09, 0.05, 0xe8edf2));
    const dash = new THREE.BoxGeometry(0.1, 0.02, 0.9);
    const count = 44;
    const dashes = new THREE.InstancedMesh(dash, new THREE.MeshLambertMaterial({ color: 0xf2c14e }), count);
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      this.placeOnTrack(o, (i / count) * this.trackLength, 0, 0.05);
      o.updateMatrix();
      dashes.setMatrixAt(i, o.matrix);
    }
    g.add(dashes);
  }

  private buildArch(): void {
    const arch = new THREE.Group();
    const post = new THREE.BoxGeometry(0.28, 3, 0.28);
    const white = lambert(0xe8edf2);
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(post, white);
      m.position.set(side * 2.05, 1.5, 0);
      arch.add(m);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.6, 0.3), lambert(0x5dcaa5));
    beam.position.y = 3.1;
    arch.add(beam);
    for (let i = 0; i < 8; i++) {
      const sq = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.26, 0.32), lambert(i % 2 ? 0x12161d : 0xe8edf2));
      sq.position.set(-1.75 + i * 0.5, 3.1 + (i % 2 ? 0.13 : -0.13), 0);
      arch.add(sq);
    }
    this.placeOnTrack(arch, 0);
    this.features.arch.add(arch);
  }

  private buildCheckpoints(): void {
    const n = 6;
    for (let i = 0; i < n; i++) {
      const s = ((i + 0.5) / n) * this.trackLength;
      const cp = new THREE.Group();
      const mat = lambert(0xf2c14e, { emissive: 0xf2c14e, emissiveIntensity: 0 });
      for (const side of [-1, 1]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6), lambert(0xcfd6dd));
        pole.position.set(side * 2.1, 1.1, 0);
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.05), mat);
        flag.position.set(side * 2.1 - side * 0.38, 1.95, 0);
        cp.add(pole, flag);
      }
      this.placeOnTrack(cp, s);
      this.features.checkpoints.add(cp);
      this.checkpoints.push({ s, mat });
    }
  }

  private buildScatter(): void {
    const rand = rng(7);
    const o = new THREE.Object3D();
    const color = new THREE.Color();

    const maxTrees = 130;
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.15, 0.7, 5), lambert(0x6b4a2f), maxTrees);
    const crowns = new THREE.InstancedMesh(new THREE.ConeGeometry(0.75, 1.9, 6), lambert(0xffffff), maxTrees);
    let n = 0;
    for (let tries = 0; tries < 2600 && n < maxTrees; tries++) {
      const x = (rand() - 0.5) * 54, z = (rand() - 0.5) * 44;
      const h = this.heightAt(x, z);
      if (h < 0.25 || h > 3.3 || this.trackDistance(x, z) < 3.2) continue;
      if (fbm(x * 0.15, z * 0.15) < 0.42) continue;
      const sc = 0.7 + rand() * 0.8;
      o.rotation.set(0, rand() * 6.28, 0);
      o.scale.setScalar(sc);
      o.position.set(x, h + 0.35 * sc, z);
      o.updateMatrix();
      trunks.setMatrixAt(n, o.matrix);
      o.position.y = h + 1.5 * sc;
      o.updateMatrix();
      crowns.setMatrixAt(n, o.matrix);
      crowns.setColorAt(n, color.setHSL(0.36 + rand() * 0.06, 0.45, 0.24 + rand() * 0.1));
      n++;
    }
    trunks.count = crowns.count = n;
    this.features.trees.add(trunks, crowns);

    const maxRocks = 34;
    const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.5, 0), lambert(0x8a94a0), maxRocks);
    n = 0;
    for (let tries = 0; tries < 900 && n < maxRocks; tries++) {
      const x = (rand() - 0.5) * 56, z = (rand() - 0.5) * 46;
      const h = this.heightAt(x, z);
      if (h < -0.1 || this.trackDistance(x, z) < 2.6) continue;
      o.rotation.set(rand() * 3, rand() * 3, rand() * 3);
      o.scale.set(0.5 + rand() * 1.1, 0.4 + rand() * 0.8, 0.5 + rand() * 1.1);
      o.position.set(x, h + 0.1, z);
      o.updateMatrix();
      rocks.setMatrixAt(n++, o.matrix);
    }
    rocks.count = n;
    this.features.rocks.add(rocks);
  }

  private buildHouses(): void {
    const rand = rng(21);
    const walls = [0xf0e6d2, 0xe8d9c0, 0xdfe6ea];
    const roofs = [0xd8573a, 0xc94f6d, 0x3f7fbf];
    const p = new THREE.Vector3();
    for (let i = 0; i < 6; i++) {
      const s = ((i + 0.3) / 6) * this.trackLength;
      const side = i % 2 ? 1 : -1;
      const yaw = this.trackPose(s, side * (4.4 + rand() * 0.8), p);
      const house = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.2, 1.4), lambert(walls[i % 3]));
      body.position.y = 0.6;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.95, 4), lambert(roofs[i % 3]));
      roof.position.y = 1.67;
      roof.rotation.y = Math.PI / 4;
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.6, 0.06), lambert(0x5a3d28));
      door.position.set(0, 0.3, 0.72);
      house.add(body, roof, door);
      house.position.set(p.x, this.heightAt(p.x, p.z) - 0.05, p.z);
      house.rotation.y = yaw + (side > 0 ? -Math.PI / 2 : Math.PI / 2);
      this.features.houses.add(house);
    }
  }

  private buildLighthouse(): void {
    const g = new THREE.Group();
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, 4.6, 10), lambert(0xf2f5f7));
    tower.position.y = 2.3;
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.9, 10), lambert(0xd8573a));
    band.position.y = 2.0;
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.6, 8), new THREE.MeshBasicMaterial({ color: 0xffe9a3 }));
    lamp.position.y = 4.9;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.7, 8), lambert(0xd8573a));
    cap.position.y = 5.55;
    g.add(tower, band, lamp, cap);
    const x = 22.6, z = -1.5;
    g.position.set(x, Math.max(0, this.heightAt(x, z)) - 0.1, z);
    this.features.lighthouse.add(g);
  }

  private buildLamps(): void {
    const count = 16;
    const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.04, 0.05, 1.6, 5), lambert(0x2a313b), count);
    const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.14, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe9a3 }), count);
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      this.placeOnTrack(o, ((i + 0.25) / count) * this.trackLength, i % 2 ? 2.2 : -2.2, 0.8);
      o.updateMatrix();
      poles.setMatrixAt(i, o.matrix);
      o.position.y += 0.85;
      o.updateMatrix();
      bulbs.setMatrixAt(i, o.matrix);
    }
    this.features.lamps.add(poles, bulbs);
  }

  makeKart(color: number): THREE.Group {
    const kart = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.26, 1.2), lambert(color));
    body.position.y = 0.3;
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.4), lambert(color));
    nose.position.set(0, 0.24, 0.72);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 0.16), lambert(0x12161d));
    seat.position.set(0, 0.55, -0.42);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), lambert(0xf2f5f7));
    head.position.set(0, 0.72, -0.2);
    kart.add(body, nose, seat, head);
    const wheel = new THREE.CylinderGeometry(0.19, 0.19, 0.16, 8);
    wheel.rotateZ(Math.PI / 2);
    const tyre = lambert(0x12161d);
    for (const [x, z] of [[-0.44, 0.42], [0.44, 0.42], [-0.44, -0.42], [0.44, -0.42]]) {
      const w = new THREE.Mesh(wheel, tyre);
      w.position.set(x, 0.19, z);
      kart.add(w);
    }
    return kart;
  }

  private buildKarts(): void {
    for (const [i, color] of [0xe24b4a, 0x378add, 0xf2c14e, 0xe8edf2].entries()) {
      const kart = this.makeKart(color);
      this.placeOnTrack(kart, -2 - i * 1.6, i % 2 ? 0.7 : -0.7);
      this.karts.push(kart);
      this.features.karts.add(kart);
    }
  }

  private buildItems(): void {
    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(geo, lambert(0x9b7bea, { emissive: 0x4b2fb0, emissiveIntensity: 0.6 }));
      this.placeOnTrack(m, ((i + 0.75) / 8) * this.trackLength, (i % 3) - 1, 0.75);
      this.items.push(m);
      this.features.items.add(m);
    }
  }

  update(time: number): void {
    for (const [i, m] of this.items.entries()) {
      m.rotation.y = time * 1.4 + i;
      m.rotation.x = time * 0.9 + i;
    }
  }
}
