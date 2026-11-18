import { Bots, foot, type CamPose, type Ctx, type Lens } from '../types';

/** Intro state: the finished island with bots racing and a slow orbit. */
export function overview(ctx: Ctx): Lens {
  const bots = new Bots(ctx.world);
  return {
    enter() {
      bots.reset();
    },
    exit() {},
    update(dt: number, _p: number, time: number, cam: CamPose) {
      bots.update(dt);
      const a = time * 0.07 + 0.9;
      cam.pos.set(Math.cos(a) * 40, 21, Math.sin(a) * 40);
      cam.target.set(0, 1, 0);
      ctx.hud(foot(ctx.t.introHint));
    },
  };
}
