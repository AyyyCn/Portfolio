import type { LensId } from './content/types';
import type { Stage } from './stage';

// The page is complete static HTML. This adds the 3D: an island in the hero,
// and one interactive demo per piece of work, opened on demand in a dialog.

interface StageData {
  t: Record<string, string>;
  phases: string[];
  introHint: string;
  cases: { id: LensId; title: string; org: string; kicker: string; captions: string[] }[];
}

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const params = new URLSearchParams(location.search);
const dataEl = document.getElementById('stage-data');
const data = JSON.parse(dataEl?.textContent ?? '{}') as StageData;

function webglAvailable(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

const viewer = $('viewer');
const heroSlot = $('hero-slot');
const demoSlot = $('demo-slot');
const narrow = window.matchMedia('(max-width: 899px)');
let stage: Stage | null = null;

async function loadStage(): Promise<Stage> {
  if (stage) return stage;
  const loading = $('stage-loading');
  loading.hidden = false;
  // The 3D labels are drawn to canvases, so their font has to be loaded first.
  const [{ createStage }] = await Promise.all([
    import('./stage'),
    document.fonts.load('500 44px "Geist Mono Variable"').catch(() => []),
  ]);
  if (stage) return stage;
  stage = createStage({
    canvas: $<HTMLCanvasElement>('stage-canvas'),
    hud: $('hud'),
    controls: $('stage-controls'),
    t: { ...data.t, introHint: data.introHint },
    lowPower: narrow.matches || (navigator.hardwareConcurrency ?? 8) <= 4,
    onReady: () => {
      loading.hidden = true;
      document.documentElement.classList.add('stage-ready');
    },
  });
  // Moving the viewer between the hero and the dialog can queue several entries: the last one is current.
  new IntersectionObserver((entries) => stage?.setVisible(entries[entries.length - 1].isIntersecting)).observe(viewer);
  return stage;
}

/** Capture mode renders one scene full-window, for the static thumbnails. */
function capture(): void {
  document.documentElement.classList.add('capture');
  viewer.hidden = false;
  document.body.append(viewer);
  const lens = params.get('capture') as LensId | 'intro';
  const p = Number(params.get('p') ?? 3);
  void loadStage().then((s) => s.setState(lens, p));
}

function start(): void {
  document.documentElement.classList.add('has-stage');
  viewer.hidden = false;
  heroSlot.append(viewer);
  document.querySelectorAll<HTMLElement>('[data-open]').forEach((b) => {
    b.hidden = false;
    b.tabIndex = 0;
  });

  // The hero island loads right away unless the visitor asked for less motion or data.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches || conn?.saveData;
  if (!quiet) void loadStage().then((s) => s.setState('intro', 0));

  // --- demo dialog --------------------------------------------------------------
  const dialog = $<HTMLDialogElement>('demo');
  const kicker = $('demo-kicker');
  const title = $('demo-title');
  const caption = $('demo-caption');
  const text = $('demo-text');
  const stepBtns = [...dialog.querySelectorAll<HTMLButtonElement>('[data-step]')];
  const prev = $<HTMLButtonElement>('demo-prev');
  const next = $<HTMLButtonElement>('demo-next');

  let current = -1;
  let target = 0;
  let p = 0;
  let autoplay = true;
  let stepTimer = 0;
  // Manual control pauses the replay; it carries on by itself after a quiet spell.
  let idle = 0;
  const STEP_SECONDS = 5;
  const RESUME_AFTER = 8;
  const pause = (): void => {
    autoplay = false;
    idle = 0;
  };
  let raf = 0;
  let last = 0;

  const show = (step: number, user: boolean): void => {
    target = Math.max(0, Math.min(3, step));
    if (user) pause();
    stepTimer = 0;
    stepBtns.forEach((b, k) => {
      b.classList.toggle('on', k === target);
      b.classList.toggle('done', k < target);
      b.style.setProperty('--fill', '0');
      if (k === target) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    prev.disabled = target === 0;
    next.disabled = target === 3;
    if (current < 0) return;
    caption.textContent = data.cases[current].captions[target];
    const card = document.querySelectorAll<HTMLElement>('.work-card')[current];
    const section = card.querySelector<HTMLElement>(`.step[data-step="${target}"]`);
    text.replaceChildren(...(section ? [section.cloneNode(true)] : []));
  };

  // Moves the replay towards the chosen step at a steady pace, so each step plays out.
  const tick = (now: number): void => {
    // Real elapsed time, so autoplay keeps its pace even when frames are throttled.
    const elapsed = Math.max(0, (now - last) / 1000 || 0);
    const dt = Math.min(0.25, elapsed);
    last = now;
    const speed = 0.7;
    p = p < target ? Math.min(target, p + speed * dt) : Math.max(target, p - speed * 2 * dt);
    stage?.setState(data.cases[current].id, p);
    if (!autoplay && target < 3) {
      idle += elapsed;
      if (idle > RESUME_AFTER) autoplay = true;
    }
    if (autoplay && target < 3 && Math.abs(p - target) < 1e-3) {
      stepTimer += elapsed;
      if (stepTimer > STEP_SECONDS) show(target + 1, false);
    }
    // The active step fills up as the replay moves on, so the advance is visible.
    const fill = autoplay && target < 3 ? Math.min(1, stepTimer / STEP_SECONDS) : 0;
    stepBtns[target]?.style.setProperty('--fill', fill.toFixed(3));
    raf = requestAnimationFrame(tick);
  };

  const open = async (index: number): Promise<void> => {
    current = index;
    const c = data.cases[index];
    kicker.textContent = `${c.org} · ${c.kicker}`;
    title.textContent = c.title;
    p = 0;
    autoplay = true;
    show(0, false);
    demoSlot.append(viewer);
    dialog.showModal();
    const s = await loadStage();
    s.setState(c.id, 0);
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  };

  const close = (): void => {
    // A late close event must not undo a demo that was opened again since.
    if (dialog.open) return;
    cancelAnimationFrame(raf);
    heroSlot.append(viewer);
    stage?.setState('intro', 0);
    current = -1;
  };

  document.querySelectorAll<HTMLElement>('[data-open]').forEach((b) =>
    b.addEventListener('click', () => void open(Number(b.dataset.open))),
  );
  stepBtns.forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.step), true)));
  prev.addEventListener('click', () => show(target - 1, true));
  next.addEventListener('click', () => show(target + 1, true));
  $('demo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', close);
  // A click on the backdrop closes the dialog.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') show(target + 1, true);
    else if (e.key === 'ArrowLeft') show(target - 1, true);
  });
  // Any interaction with the scene itself stops the autoplay.
  viewer.addEventListener('pointerdown', () => {
    if (current >= 0) pause();
  });
}

if (dataEl && webglAvailable() && !params.has('static')) {
  if (params.has('capture')) capture();
  else start();
}
