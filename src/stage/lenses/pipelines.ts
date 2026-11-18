import * as THREE from 'three';
import { row, type CamPose, type Ctx, type Lens } from '../types';
import { clamp01, easeOut, rng } from '../world';

const N = 6;
const Y = 12.5;

/**
 * Generated props arrive in arbitrary orientations and are snapped to a grip
 * contract (an origin and three axes), then an effect goes through revisions.
 */
export function pipelines(ctx: Ctx): Lens {
  const rand = rng(5);
  const root = new THREE.Group();
  root.position.y = Y;

  const slab = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.3, 3.4), new THREE.MeshLambertMaterial({ color: 0x1a222d, flatShading: true }));
  slab.position.y = -0.15;
  slab.receiveShadow = true;
  root.add(slab);

  const flat = (c: number): THREE.MeshLambertMaterial => new THREE.MeshLambertMaterial({ color: c, flatShading: true });
  const palette = [0x8fa3b8, 0xd8573a, 0xf2c14e, 0x9b7bea, 0x5dcaa5, 0xe8edf2];
  const props: { holder: THREE.Group; tumble: THREE.Quaternion; from: THREE.Vector3; ring: THREE.MeshBasicMaterial; gizmo: THREE.Group }[] = [];
  const identity = new THREE.Quaternion();

  for (let i = 0; i < N; i++) {
    const x = (i - (N - 1) / 2) * 2.1;
    const slot = new THREE.Group();
    slot.position.set(x, 0, 0);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3a4656 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.035, 6, 28), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;

    // Grip contract gizmo: origin + axes.
    const gizmo = new THREE.Group();
    gizmo.position.y = 0.9;
    for (const [axis, col] of [['x', 0xe24b4a], ['y', 0x5dcaa5], ['z', 0x378add]] as const) {
      const stick = new THREE.Mesh(new THREE.BoxGeometry(axis === 'x' ? 0.5 : 0.03, axis === 'y' ? 0.5 : 0.03, axis === 'z' ? 0.5 : 0.03), new THREE.MeshBasicMaterial({ color: col }));
      stick.position[axis] = 0.25;
      gizmo.add(stick);
    }

    // A blocky prop with a body, a barrel along +z and a grip below the origin.
    const holder = new THREE.Group();
    holder.position.y = 0.9;
    const len = 0.9 + rand() * 0.5, tall = 0.2 + rand() * 0.12;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.2, tall, len), flat(palette[i]));
    body.position.set(0, 0.12, len * 0.22);
    const barrelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5 + rand() * 0.3, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, flat(0x2a313b));
    barrel.position.set(0, 0.14, len * 0.72 + 0.2);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.2), flat(0x2a313b));
    grip.position.set(0, -0.2, -0.02);
    grip.rotation.x = 0.25;
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.3), flat(0xe8edf2));
    top.position.set(0, 0.12 + tall / 2 + 0.04, len * 0.2);
    holder.add(body, barrel, grip, top);
    holder.traverse((o) => (o.castShadow = true));

    const tumble = new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6.28, rand() * 6.28, rand() * 6.28));
    const from = new THREE.Vector3((rand() - 0.5) * 0.7, 0.35 + rand() * 0.5, (rand() - 0.5) * 0.9);
    slot.add(ring, gizmo, holder);
    root.add(slot);
    props.push({ holder, tumble, from, ring: ringMat, gizmo });
  }

  // VFX: a fountain from the first prop's barrel, in three revisions.
  const COUNT = 160;
  const pos = new Float32Array(COUNT * 3), vel = new Float32Array(COUNT * 3), life = new Float32Array(COUNT);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pmat = new THREE.PointsMaterial({ size: 0.12, color: 0x9aa7b4, transparent: true, opacity: 0.9, depthWrite: false });
  const points = new THREE.Points(geo, pmat);
  points.frustumCulled = false;
  root.add(points);
  const REV = [
    { color: 0x9aa7b4, size: 0.08, spread: 0.25, speed: 1.6, rate: 0.25 },
    { color: 0xf08a5d, size: 0.13, spread: 0.7, speed: 3.2, rate: 0.6 },
    { color: 0x5dcaa5, size: 0.17, spread: 1.1, speed: 4.4, rate: 1 },
  ];
  const muzzle = new THREE.Vector3((-(N - 1) / 2) * 2.1, 1.05, 1.3);
  let vfxTime = 0;

  return {
    enter() {
      ctx.scene.add(root);
      vfxTime = 0;
      life.fill(0);
    },
    exit() {
      ctx.scene.remove(root);
    },
    update(dt: number, p: number, time: number, cam: CamPose) {
      let aligned = 0;
      props.forEach((pr, i) => {
        const arrive = easeOut((p - i * 0.09) / 0.3);
        const k = easeOut((p - 1.55 - i * 0.2) / 0.3);
        if (k >= 1) aligned++;
        pr.holder.visible = arrive > 0;
        pr.holder.scale.setScalar(Math.max(0.001, arrive));
        pr.holder.quaternion.slerpQuaternions(pr.tumble, identity, k);
        pr.holder.position.set(pr.from.x * (1 - k), 0.9 + pr.from.y * (1 - k) + (1 - arrive) * 3, pr.from.z * (1 - k));
        if (p > 3) pr.holder.rotation.y = Math.sin(time * 0.6 + i) * 0.25 * clamp01(p - 3 + 0.4);
        const g = easeOut((p - 0.85 - i * 0.05) / 0.3);
        pr.gizmo.visible = g > 0;
        pr.gizmo.scale.setScalar(Math.max(0.001, g));
        pr.ring.color.setHex(k >= 1 ? 0x5dcaa5 : g > 0 ? 0xf08a5d : 0x3a4656);
      });

      // Particles
      const on = p > 2.55;
      points.visible = on;
      let rev = 0;
      if (on) {
        vfxTime += dt;
        rev = Math.min(2, Math.floor(vfxTime / 2.6));
        const r = REV[rev];
        pmat.color.setHex(r.color);
        pmat.size = r.size;
        for (let i = 0; i < COUNT; i++) {
          life[i] -= dt;
          if (life[i] <= 0 && Math.random() < r.rate * 0.2) {
            life[i] = 0.7 + Math.random() * 0.6;
            pos[i * 3] = muzzle.x;
            pos[i * 3 + 1] = muzzle.y;
            pos[i * 3 + 2] = muzzle.z;
            vel[i * 3] = (Math.random() - 0.5) * r.spread;
            vel[i * 3 + 1] = Math.random() * r.spread + 0.6;
            vel[i * 3 + 2] = r.speed * (0.6 + Math.random() * 0.5);
          }
          if (life[i] > 0) {
            vel[i * 3 + 1] -= 3.2 * dt;
            pos[i * 3] += vel[i * 3] * dt;
            pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
            pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
          } else pos[i * 3 + 1] = -50;
        }
        geo.attributes.position.needsUpdate = true;
      } else vfxTime = 0;

      const sway = Math.sin(time * 0.25) * 1.2;
      if (p < 2.6) {
        cam.pos.set(sway, Y + 4.6, 12.5);
        cam.target.set(0, Y + 0.7, 0);
      } else {
        cam.pos.set(-9.5 + sway * 0.3, Y + 2.8, 8.5);
        cam.target.set(-3.2, Y + 1, 1);
      }

      ctx.hud(
        row(ctx.t.aligned, `${aligned}/${N}`, aligned === N ? 'ok' : aligned ? '' : 'bad') +
          (on ? row(ctx.t.revision, `${rev + 1}/3`, rev === 2 ? 'ok' : '') : ''),
      );
    },
  };
}
