import type { LensId } from './content/types';
import type { Stage } from './stage';

// The page is complete static HTML. Everything here is enhancement: scroll
// tracking for the case studies and, when the device can do it, the 3D replay.

interface StageData {
  t: Record<string, string>;
  phases: string[];
  introTitle: string;
  introHint: string;
  cases: { id: LensId; title: string }[];
}

const stageEl = document.getElementById('stage');
const dataEl = document.getElementById('stage-data');

function webglAvailable(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

// ?static forces the text-only page (what a device without WebGL gets).
const forceStatic = new URLSearchParams(location.search).has('static');

if (stageEl && dataEl && !forceStatic && webglAvailable()) start(stageEl, JSON.parse(dataEl.textContent ?? '{}') as StageData);

function start(stageEl: HTMLElement, data: StageData): void {
  const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
  const canvas = $<HTMLCanvasElement>('stage-canvas');
  const title = $('stage-title');
  const timeline = $('timeline');
  const scrub = $<HTMLInputElement>('scrub');
  const loadBtn = $<HTMLButtonElement>('stage-load');
  const tabs = [...timeline.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  const cases = [...document.querySelectorAll<HTMLElement>('.case')].map((el) => ({
    el,
    phases: [...el.querySelectorAll<HTMLElement>('.phase')],
  }));
  const narrow = window.matchMedia('(max-width: 899px)');

  stageEl.hidden = false;
  document.documentElement.classList.add('has-stage');

  let stage: Stage | null = null;
  let active = -1;
  let p = 0;
  let scrubbing = false;

  /** The viewport line the story is "read" at: mid-screen, or mid-way below the pinned stage. */
  const refY = (): number => {
    if (!narrow.matches) return window.innerHeight * 0.5;
    const bottom = stageEl.getBoundingClientRect().bottom;
    return bottom + (window.innerHeight - bottom) * 0.45;
  };
  const centre = (el: HTMLElement): number => {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  };

  const render = (): void => {
    const ref = refY();
    let next = -1;
    cases.forEach((c, i) => {
      if (c.el.getBoundingClientRect().top <= ref) next = i;
    });
    let np = 0;
    if (next >= 0) {
      const cs = cases[next].phases.map(centre);
      if (ref >= cs[3]) np = 3;
      else if (ref > cs[0]) {
        const k = cs.findIndex((c, i) => i < 3 && ref >= c && ref < cs[i + 1]);
        np = k + (ref - cs[k]) / (cs[k + 1] - cs[k]);
      }
    }
    const phase = Math.round(np);
    if (next !== active) {
      title.textContent = next < 0 ? data.introTitle : `${String(next + 1).padStart(2, '0')} · ${data.cases[next].title}`;
      timeline.classList.toggle('off', next < 0);
    }
    cases.forEach((c, i) => c.phases.forEach((el, k) => el.classList.toggle('on', i === next && k === phase)));
    tabs.forEach((b, k) => b.classList.toggle('on', next >= 0 && k === phase));
    if (!scrubbing) scrub.value = String(Math.round(np * 100));
    active = next;
    p = np;
    stage?.setState(next < 0 ? 'intro' : data.cases[next].id, np);
  };

  let queued = false;
  const onScroll = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      render();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /** Scroll so that replay position q of the active case sits on the reading line. */
  const goto = (q: number, smooth: boolean): void => {
    if (active < 0) return;
    const cs = cases[active].phases.map(centre);
    const k = Math.min(2, Math.floor(q));
    const y = cs[k] + (cs[k + 1] - cs[k]) * (q - k);
    window.scrollTo({ top: window.scrollY + y - refY(), behavior: smooth ? 'smooth' : 'instant' });
  };
  scrub.addEventListener('input', () => {
    scrubbing = true;
    goto(Number(scrub.value) / 100, false);
  });
  scrub.addEventListener('change', () => (scrubbing = false));
  tabs.forEach((b) => b.addEventListener('click', () => goto(Number(b.dataset.goto), true)));

  const load = async (): Promise<void> => {
    loadBtn.hidden = true;
    const loading = $('stage-loading');
    loading.hidden = false;
    // The 3D labels are drawn to canvases, so their font has to be loaded first.
    const [{ createStage }] = await Promise.all([import('./stage'), document.fonts.load('500 44px "Geist Mono Variable"').catch(() => [])]);
    const t0 = performance.now();
    stage = createStage({
      canvas,
      hud: $('hud'),
      controls: $('stage-controls'),
      t: { ...data.t, introHint: data.introHint },
      lowPower: narrow.matches || (navigator.hardwareConcurrency ?? 8) <= 4,
      onReady: () => {
        loading.hidden = true;
        performance.measure('stage-first-frame', { start: t0, end: performance.now() });
      },
    });
    performance.measure('stage-init', { start: t0, end: performance.now() });
    new IntersectionObserver(([e]) => stage?.setVisible(e.isIntersecting)).observe(stageEl);
    stage.setState(active < 0 ? 'intro' : data.cases[active].id, p);
  };

  render();
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || conn?.saveData) {
    loadBtn.hidden = false;
    loadBtn.addEventListener('click', () => void load(), { once: true });
  } else void load();
}
