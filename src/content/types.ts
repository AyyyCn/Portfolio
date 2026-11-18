export type LensId = 'benchmark' | 'profiler' | 'netcode' | 'pipelines' | 'shipping' | 'textto3d' | 'learning' | 'emotion';

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

export interface WorkGroup {
  org: string;
  role: string;
  dates: string;
  intro: string;
  cases: CaseStudy[];
}

export interface Project {
  title: string;
  image: string;
  text: string;
  note?: string;
  link?: string;
}

export interface Content {
  lang: 'en' | 'fr';
  path: string;
  altPath: string;
  altLabel: string;
  meta: { title: string; description: string };
  nav: { work: string; projects: string; toolbox: string; contact: string; skip: string };
  hero: { role: string; location: string; lead: string; profile: string; cta: string };
  headline: Metric[];
  workHeading: string;
  phases: [string, string, string, string];
  work: WorkGroup[];
  projects: { heading: string; intro: string; code: string; groups: { label: string; items: Project[] }[] };
  toolbox: { heading: string; groups: { label: string; details: string }[] };
  education: { heading: string; items: { label: string; details: string }[] };
  contact: { heading: string; text: string; email: string; linkedin: string; github: string; artstation: string; youtube: string };
  footer: string;
  stage: {
    tag: string;
    aria: string;
    note: string;
    scrub: string;
    load: string;
    loading: string;
    introTitle: string;
    introHint: string;
    /** Strings used by the 3D lenses (HUD labels, controls). */
    t: Record<string, string>;
  };
}
