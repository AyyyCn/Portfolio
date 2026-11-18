import * as THREE from 'three';
import type { World } from './world';

export interface CamPose {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export interface Stats {
  /** Smoothed time between frames, ms. */
  frameMs: number;
  /** Smoothed CPU time spent in renderer.render, ms. */
  renderMs: number;
}

export interface Ctx {
  world: World;
  scene: THREE.Scene;
  t: Record<string, string>;
  stats: Stats;
  controls: HTMLElement;
  /** Replace the HUD contents (throttled by the stage). */
  hud(html: string): void;
}

export interface Lens {
  enter(): void;
  exit(): void;
  /** p is the replay position: 0 problem, 1 build, 2 measure, 3 result (continuous). */
  update(dt: number, p: number, time: number, cam: CamPose): void;
}

// --- HUD helpers ------------------------------------------------------------------

export const row = (label: string, value: string | number, tone = ''): string =>
  `<div class="hud-row"><span>${label}</span><span class="${tone}">${value}</span></div>`;

export const cells = (total: number, on: number): string =>
  `<div class="hud-cells">${Array.from({ length: total }, (_, i) => `<i class="${i < on ? 'on' : ''}"></i>`).join('')}</div>`;

export const bars = (items: [string, number][], scale: number): string =>
  `<div class="hud-bars">${items
    .map(([label, ms]) => `<div class="hud-bar"><span>${label}</span><span><b style="width:${Math.min(100, (ms / scale) * 100).toFixed(0)}%"></b></span><em>${ms.toFixed(2)} ms</em></div>`)
    .join('')}</div>`;

export const foot = (text: string): string => `<div class="hud-foot">${text}</div>`;

export interface Slider {
  value: number;
  touched: boolean;
  set(v: number): void;
}

export function slider(host: HTMLElement, label: string, min: number, max: number, value: number, unit: string): Slider {
  const wrap = document.createElement('label');
  wrap.className = 'ctl';
  const name = document.createElement('span');
  name.textContent = label;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);
  const out = document.createElement('output');
  out.textContent = `${value}${unit}`;
  wrap.append(name, input, out);
  host.append(wrap);
  const api: Slider = {
    value,
    touched: false,
    set(v: number) {
      const r = Math.round(v);
      if (r === api.value) return;
      api.value = r;
      input.value = String(r);
      out.textContent = `${r}${unit}`;
    },
  };
  input.addEventListener('input', () => {
    api.touched = true;
    api.value = Number(input.value);
    out.textContent = `${api.value}${unit}`;
  });
  return api;
}

// --- camera helpers ------------------------------------------------------------------

export type Key = [px: number, py: number, pz: number, tx: number, ty: number, tz: number];

const a = new THREE.Vector3();
const b = new THREE.Vector3();

/** Interpolates between camera keyframes placed at integer values of p. */
export function poseAt(keys: Key[], p: number, cam: CamPose): void {
  const i = Math.min(keys.length - 2, Math.max(0, Math.floor(p)));
  let f = Math.min(1, Math.max(0, p - i));
  f = f * f * (3 - 2 * f);
  const k0 = keys[i], k1 = keys[i + 1];
  cam.pos.lerpVectors(a.set(k0[0], k0[1], k0[2]), b.set(k1[0], k1[1], k1[2]), f);
  cam.target.lerpVectors(a.set(k0[3], k0[4], k0[5]), b.set(k1[3], k1[4], k1[5]), f);
}

/** Simple bot drivers for the four world karts. */
export class Bots {
  s = [0, 0, 0, 0];
  private base = [9.4, 9.0, 8.7, 8.3];
  constructor(private world: World) {
    this.reset();
  }
  reset(): void {
    this.s = [-2, -3.6, -5.2, -6.8];
    this.place();
  }
  update(dt: number): void {
    for (let i = 0; i < 4; i++) this.s[i] += this.base[i] * (0.86 + 0.14 * Math.sin(this.s[i] * 0.21 + i * 1.7)) * dt;
    this.place();
  }
  place(): void {
    for (let i = 0; i < 4; i++) this.world.placeOnTrack(this.world.karts[i], this.s[i], i % 2 ? 0.75 : -0.75);
  }
}
