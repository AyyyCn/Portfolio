import * as THREE from 'three';
import type { LensId } from '../content/types';
import { benchmark } from './lenses/benchmark';
import { netcode } from './lenses/netcode';
import { overview } from './lenses/overview';
import { pipelines } from './lenses/pipelines';
import { profiler } from './lenses/profiler';
import { shipping } from './lenses/shipping';
import type { CamPose, Ctx, Lens } from './types';
import { World } from './world';

export interface Stage {
  /** lens: 'intro' or a case id; p: replay position 0..3. */
  setState(lens: LensId | 'intro', p: number): void;
  setVisible(visible: boolean): void;
}

export interface StageOptions {
  canvas: HTMLCanvasElement;
  hud: HTMLElement;
  controls: HTMLElement;
  t: Record<string, string>;
  lowPower: boolean;
}

const BG = 0x0a0e14;

export function createStage(opts: StageOptions): Stage {
  const { canvas, lowPower } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.shadowMap.enabled = !lowPower;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 75, 160);
  scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x2c3a2c, 1.25));
  const sun = new THREE.DirectionalLight(0xfff0d2, 2.4);
  sun.position.set(28, 42, 16);
  if (!lowPower) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const c = sun.shadow.camera;
    c.left = c.bottom = -36;
    c.right = c.top = 36;
    c.near = 5;
    c.far = 120;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.04;
  }
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 400);
  camera.position.set(44, 26, 44);

  const world = new World(!lowPower);
  scene.add(world.root);

  let hudHtml = '', hudShown = '', hudAt = 0;
  const ctx: Ctx = {
    world,
    scene,
    t: opts.t,
    stats: { frameMs: 16.7, renderMs: 0 },
    controls: opts.controls,
    hud(html: string) {
      hudHtml = html;
    },
  };

  const lenses: Record<LensId | 'intro', Lens> = {
    intro: overview(ctx),
    benchmark: benchmark(ctx),
    profiler: profiler(ctx),
    netcode: netcode(ctx),
    pipelines: pipelines(ctx),
    shipping: shipping(ctx),
  };

  let current: LensId | 'intro' = 'intro';
  let wanted: LensId | 'intro' = 'intro';
  let progress = 0;
  let visible = true;
  let snap = true;
  lenses.intro.enter();

  // Size follows the canvas box.
  const resize = (): void => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  // Drag to orbit around the current target; the offset relaxes after release.
  let yaw = 0, dragging = false, lastX = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    yaw -= (e.clientX - lastX) * 0.006;
    lastX = e.clientX;
  });
  const release = (): void => {
    dragging = false;
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());

  const goal: CamPose = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  const target = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  let time = 0;
  let lastNow = performance.now();

  const frame = (): void => {
    requestAnimationFrame(frame);
    const nowMs = performance.now();
    const raw = (nowMs - lastNow) / 1000;
    lastNow = nowMs;
    if (!visible || document.hidden) return;
    const dt = Math.min(raw, 0.05);
    time += dt;
    ctx.stats.frameMs += (raw * 1000 - ctx.stats.frameMs) * (raw > 0.25 ? 0 : 0.08);

    if (wanted !== current) {
      lenses[current].exit();
      opts.controls.replaceChildren();
      world.setAll('solid');
      current = wanted;
      lenses[current].enter();
      yaw = 0;
    }

    world.update(time);
    lenses[current].update(dt, progress, time, goal);

    // Narrow viewports pull the camera back so the subject still fits.
    const zoom = Math.min(1.7, Math.max(1, 1.45 / camera.aspect));
    if (!dragging) yaw *= Math.exp(-dt * 0.5);
    offset.copy(goal.pos).sub(goal.target).multiplyScalar(zoom).applyAxisAngle(up, yaw);
    const k = snap ? 1 : 1 - Math.exp(-dt * 3.2);
    snap = false;
    target.lerp(goal.target, k);
    camera.position.lerp(offset.add(goal.target), k);
    camera.lookAt(target);

    const t0 = performance.now();
    renderer.render(scene, camera);
    ctx.stats.renderMs += (performance.now() - t0 - ctx.stats.renderMs) * 0.08;

    if (hudHtml !== hudShown && t0 - hudAt > 110) {
      opts.hud.innerHTML = hudShown = hudHtml;
      hudAt = t0;
    }
  };
  requestAnimationFrame(frame);

  return {
    setState(lens, p) {
      wanted = lens;
      progress = p;
    },
    setVisible(v) {
      visible = v;
    },
  };
}
