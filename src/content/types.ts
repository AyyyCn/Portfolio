export type LensId = 'harness' | 'vfx' | 'netcode' | 'engine' | 'shaders' | 'vehicles' | 'textto3d' | 'learning' | 'emotion';

export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: LensId;
  title: string;
  kicker: string;
  /** One plain sentence a non-specialist can read on its own. */
  summary: string;
  /** One plain line per step, shown under the 3D scene. */
  captions: [string, string, string, string];
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

export interface Job {
  org: string;
  orgNote: string;
  role: string;
  dates: string;
  place: string;
  points: string[];
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
  nav: { about: string; experience: string; work: string; projects: string; contact: string; skip: string };
  hero: { greeting: string; role: string; location: string; lead: string; intro: string; cta: string; cta2: string; viewer: string };
  about: { heading: string; paragraphs: string[]; facts: { label: string; value: string }[] };
  experience: { heading: string; jobs: Job[] };
  workSection: { heading: string; intro: string; demo: string; read: string; close: string; prev: string; next: string };
  phases: [string, string, string, string];
  work: WorkGroup[];
  projects: { heading: string; intro: string; code: string; groups: { label: string; items: Project[] }[] };
  toolbox: { heading: string; groups: { label: string; details: string }[] };
  education: { heading: string; items: { label: string; details: string }[] };
  contact: { heading: string; text: string; email: string; linkedin: string; github: string; artstation: string; youtube: string };
  footer: string;
  stage: {
    introCaption: string;
    prev: string;
    next: string;
    /** Short phase names for the timeline tabs. */
    phases: [string, string, string, string];
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
