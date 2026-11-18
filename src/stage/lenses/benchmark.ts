import { Bots, cells, poseAt, row, type CamPose, type Ctx, type Key, type Lens } from '../types';
import { FEATURES } from '../world';

// 12 requested features. The "schema-valid" build only contains the terrain
// (1/12 = 8%); the checklist build lands 11 of them (11/12 = 92%).
const KEYS: Key[] = [
  [36, 25, 38, 0, 0, 0],
  [-32, 21, 36, 0, 0.5, 0],
  [3, 54, 24, 0, 0, 2],
  [25, 7, 14, 16.5, 1.4, -1],
];

export function benchmark(ctx: Ctx): Lens {
  const w = ctx.world;
  const bots = new Bots(w);
  const rest = FEATURES.slice(1, 11);

  return {
    enter() {
      bots.reset();
    },
    exit() {
      w.setAll('solid');
    },
    update(dt: number, p: number, _time: number, cam: CamPose) {
      let present = 1;
      w.setFeature('terrain', 'solid', 1);
      if (p < 0.45) {
        // The schema-valid build: terrain only, everything else requested but missing.
        for (const id of FEATURES.slice(1)) w.setFeature(id, 'ghost', 1);
      } else {
        const q = (p - 0.45) / 1.25;
        rest.forEach((id, i) => {
          const start = (i / rest.length) * 0.86;
          if (q >= start) {
            w.setFeature(id, 'solid', (q - start) / 0.14);
            present++;
          } else w.setFeature(id, 'ghost', 1);
        });
        w.setFeature('items', 'ghost', 1);
      }
      if (p > 2.5) bots.update(dt);
      else bots.reset();

      poseAt(KEYS, p, cam);

      const pct = Math.round((present / FEATURES.length) * 100);
      ctx.hud(
        row(ctx.t.schema, `${ctx.t.valid} ✓`, 'ok') +
          row(ctx.t.requested, FEATURES.length) +
          row(ctx.t.present, present) +
          cells(FEATURES.length, present) +
          row(ctx.t.coverage, `${pct}%`, pct < 50 ? 'bad' : 'ok'),
      );
    },
  };
}
