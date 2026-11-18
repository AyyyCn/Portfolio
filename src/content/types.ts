export type LensId = 'benchmark' | 'profiler' | 'netcode' | 'pipelines' | 'shipping';

export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: LensId;
  title: string;
  kicker: string;
  problem: string;
  built: string;
  measured: string;
  result: string;
  metrics: Metric[];
  /** Optional before/after bar, values in percent. */
  bar?: { before: number; after: number; beforeLabel: string; afterLabel: string };
}

export interface Job {
  org: string;
  orgNote: string;
  role: string;
  dates: string;
  place: string;
  points: string[];
  metrics: Metric[];
}

export interface Content {
  lang: 'en' | 'fr';
  path: string;
  altPath: string;
  altLabel: string;
  meta: { title: string; description: string };
  nav: { work: string; earlier: string; toolbox: string; contact: string; skip: string };
  hero: { role: string; location: string; lead: string; profile: string; cta: string };
  headline: Metric[];
  arcade: { heading: string; role: string; dates: string; intro: string };
  phases: [string, string, string, string];
  cases: CaseStudy[];
  earlier: { heading: string; jobs: Job[] };
  toolbox: { heading: string; groups: { label: string; details: string }[] };
  education: { heading: string; items: { label: string; details: string }[] };
  contact: { heading: string; text: string; email: string; linkedin: string; github: string };
  footer: string;
  stage: {
    tag: string;
    aria: string;
    note: string;
    scrub: string;
    load: string;
    introTitle: string;
    introHint: string;
    /** Strings used by the 3D lenses (HUD labels, controls). */
    t: Record<string, string>;
  };
}
