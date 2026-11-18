import { Bots, row, type CamPose, type Ctx, type Lens } from '../types';
import { FEATURES } from '../world';

const STEP = 0.32;

/**
 * Opening: the island is generated piece by piece, like a build log, then
 * bots race on it while the camera orbits.
 */
export function overview(ctx: Ctx): Lens {
  const w = ctx.world;
  const bots = new Bots(w);
  let clock = 0;
  let built = false;

  return {
    enter() {
      bots.reset();
      clock = built ? 99 : 0;
    },
    exit() {
      built = true;
      w.setAll('solid');
    },
    update(dt: number, _p: number, time: number, cam: CamPose) {
      clock += dt;
      const done = Math.min(FEATURES.length, Math.floor(clock / STEP));
      FEATURES.forEach((id, i) => {
        const k = (clock - i * STEP) / 0.45;
        if (k <= 0) w.setFeature(id, 'hidden');
        else w.setFeature(id, 'solid', k);
      });
      if (done >= FEATURES.length) {
        built = true;
        bots.update(dt);
      } else bots.reset();

      const a = time * 0.07 + 0.9;
      cam.pos.set(Math.cos(a) * 40, 21, Math.sin(a) * 40);
      cam.target.set(0, 1, 0);

      if (done < FEATURES.length) {
        const recent = FEATURES.slice(Math.max(0, done - 3), done);
        ctx.hud(row('build', '"a kart island"') + recent.map((id) => row(id, '✓', 'ok')).join('') + row(FEATURES[done] ?? '', '…'));
      } else ctx.hud('');
    },
  };
}
