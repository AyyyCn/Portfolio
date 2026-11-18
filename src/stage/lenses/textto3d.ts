import * as THREE from 'three';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { easeOut } from '../world';

const Y = 12.5;

/** Deterministic lumpy displacement, shared by the raw and the decimated mesh. */
function boulder(detail: number): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1.5, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n =
      Math.sin(v.x * 2.1 + 1) * Math.cos(v.y * 1.7) * 0.3 +
      Math.sin(v.z * 2.6 + v.x * 1.3) * 0.2 +
      Math.sin(v.y * 4.1 + v.z * 3.2) * 0.1;
    v.multiplyScalar(1.5 * (1 + n));
    v.y = Math.max(-0.75, v.y * 0.8);
    pos.setXYZ(i, v.x, v.y + 0.75, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** A prompt becomes a dense raw mesh, is decimated, then gets its materials. */
export function textto3d(ctx: Ctx): Lens {
  const root = new THREE.Group();
  root.position.y = Y;
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.7, 0.4, 28), new THREE.MeshLambertMaterial({ color: 0x1a222d, flatShading: true }));
  pedestal.position.y = -0.2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.04, 6, 40), new THREE.MeshBasicMaterial({ color: 0x5dcaa5 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.02;
  root.add(pedestal, ring);

  const turn = new THREE.Group();
  root.add(turn);
  const grey = new THREE.MeshLambertMaterial({ color: 0x9aa3ad });
  const rawGeo = boulder(26);
  const lowGeo = boulder(3);
  const raw = new THREE.Mesh(rawGeo, grey);
  const rawWire = new THREE.Mesh(rawGeo, new THREE.MeshBasicMaterial({ color: 0x12161d, wireframe: true, transparent: true, opacity: 0.35 }));
  const low = new THREE.Mesh(lowGeo, new THREE.MeshLambertMaterial({ color: 0x9aa3ad, flatShading: true }));
  const lowWire = new THREE.Mesh(lowGeo, new THREE.MeshBasicMaterial({ color: 0xf08a5d, wireframe: true }));
  lowWire.scale.setScalar(1.004);

  // Final asset: the decimated mesh with per-face colours (moss on top, rock below).
  const finalGeo = lowGeo.clone();
  finalGeo.computeVertexNormals();
  const fp = finalGeo.attributes.position as THREE.BufferAttribute;
  const fn = finalGeo.attributes.normal as THREE.BufferAttribute;
  const colors = new Float32Array(fp.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < fp.count; i += 3) {
    const up = fn.getY(i), h = fp.getY(i), shade = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    if (up > 0.45 && h > 0.7) c.setHSL(0.3, 0.42, 0.3 + Math.abs(shade) * 0.08);
    else c.setHSL(0.58, 0.06, 0.42 + Math.abs(shade) * 0.12);
    for (let k = 0; k < 3; k++) c.toArray(colors, (i + k) * 3);
  }
  finalGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const final = new THREE.Mesh(finalGeo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  for (const m of [raw, low, final]) m.castShadow = true;
  turn.add(raw, rawWire, low, lowWire, final);

  const tris = (g: THREE.BufferGeometry): number => (g.index ? g.index.count : g.attributes.position.count) / 3;
  const rawTris = tris(rawGeo), lowTris = tris(lowGeo);
  const fmt = (n: number): string => n.toLocaleString('en-US').replace(/,/g, ' ');

  return {
    enter() {
      ctx.scene.add(root);
    },
    exit() {
      ctx.scene.remove(root);
    },
    update(_dt: number, p: number, time: number, cam: CamPose) {
      const stage = p < 0.45 ? 0 : p < 1.55 ? 1 : p < 2.55 ? 2 : 3;
      raw.visible = rawWire.visible = stage === 1;
      low.visible = lowWire.visible = stage === 2;
      final.visible = stage === 3;
      const grow = stage === 1 ? easeOut((p - 0.45) / 0.3) : stage === 2 ? easeOut((p - 1.55) / 0.2) * 0.15 + 0.85 : 1;
      turn.scale.setScalar(Math.max(0.001, grow));
      turn.rotation.y = time * 0.35;

      cam.pos.set(Math.sin(time * 0.2) * 1.5, Y + 3.4, 8.2);
      cam.target.set(0, Y + 1.1, 0);

      const t = ctx.t;
      let html = row(t.prompt, t.promptText);
      if (stage === 1) html += row(t.raw, `${fmt(rawTris)} ${t.triangles}`, 'bad');
      if (stage >= 2) html += row(t.decimated, `${fmt(rawTris)} → ${fmt(lowTris)}`, 'ok') + row(t.qa, '✓', 'ok');
      if (stage === 3) html += row(t.textured, '✓', 'ok');
      ctx.hud(html);
    },
  };
}
