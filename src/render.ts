import type { CaseStudy, Content, Job, Metric, Project } from './content/types';

const SITE = 'https://adam-ladhari.me';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function metrics(list: Metric[], cls = 'tiles'): string {
  if (!list.length) return '';
  return `<dl class="${cls}">${list
    .map((m) => `<div class="tile"><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`)
    .join('')}</dl>`;
}

function bar(c: CaseStudy): string {
  if (!c.bar) return '';
  const b = c.bar;
  return `<div class="bars">
    <div class="bar"><span class="bar-label">${esc(b.beforeLabel)}</span><span class="bar-track"><span class="bar-fill bar-before" style="width:${b.before}%"></span></span><span class="bar-value">${b.before}%</span></div>
    <div class="bar"><span class="bar-label">${esc(b.afterLabel)}</span><span class="bar-track"><span class="bar-fill bar-after" style="width:${b.after}%"></span></span><span class="bar-value">${b.after}%</span></div>
  </div>`;
}

function workCard(c: CaseStudy, org: string, i: number, content: Content): string {
  const w = content.workSection;
  const steps: string[] = [c.problem, c.built, c.measured, c.result];
  return `<article class="work-card" id="case-${c.id}" data-case="${i}" data-lens="${c.id}">
    <button class="work-thumb" type="button" data-open="${i}" aria-label="${esc(w.demo)}: ${esc(c.title)}" tabindex="-1">
      <img src="/work/${c.id}.jpg" alt="" loading="lazy" decoding="async" width="1200" height="675" />
    </button>
    <div class="work-body">
      <p class="kicker">${esc(org)} · ${esc(c.kicker)}</p>
      <h3>${esc(c.title)}</h3>
      <p class="work-summary">${esc(c.summary)}</p>
      ${c.metrics.length ? `<p class="work-figure"><strong>${esc(c.metrics[0].value)}</strong> ${esc(c.metrics[0].label)}</p>` : ''}
      <p class="work-actions">
        <button class="btn btn-primary btn-sm" type="button" data-open="${i}" hidden>${esc(w.demo)}</button>
      </p>
      <details class="work-details">
        <summary>${esc(w.read)}</summary>
        ${steps
          .map(
            (text, k) => `<section class="step" data-step="${k}">
          <h4>${esc(content.phases[k])}</h4>
          <p>${esc(text)}</p>
          ${k === 3 ? bar(c) + metrics(c.metrics) : ''}
        </section>`,
          )
          .join('')}
      </details>
    </div>
  </article>`;
}

/** A bullet that opens with a short topic ("Vehicles: …") gets that topic as a lead-in. */
function point(p: string): string {
  const m = /^([^:.]{2,40}?)\s?:\s(.+)$/s.exec(p);
  // Sentences that start with a verb ("Built a pipeline: …") keep their colon.
  const verb = m && /^(Built|Designed|Set up|Construit|Conçu|Mis en place)\b/.test(m[1]);
  return m && !verb ? `<li><strong>${esc(m[1])}</strong> ${esc(m[2])}</li>` : `<li>${esc(p)}</li>`;
}

function job(j: Job): string {
  return `<li class="job">
    <div class="job-when"><span>${esc(j.dates)}</span><span>${esc(j.place)}</span></div>
    <div class="job-what">
      <h3>${esc(j.role)}</h3>
      <p class="job-org"><strong>${esc(j.org)}</strong> · ${esc(j.orgNote)}</p>
      ${j.points.length ? `<ul>${j.points.map(point).join('')}</ul>` : ''}
    </div>
  </li>`;
}

function project(p: Project, code: string): string {
  return `<article class="project">
    <img src="/projects/${p.image}.jpg" alt="" loading="lazy" decoding="async" width="880" height="495" />
    <div class="project-body">
      <h4>${esc(p.title)}</h4>
      ${p.note ? `<p class="project-note">${esc(p.note)}</p>` : ''}
      <p>${esc(p.text)}</p>
      ${p.link ? `<p><a href="${p.link}" rel="noopener">${esc(code)} · GitHub</a></p>` : ''}
    </div>
  </article>`;
}

export function renderHead(c: Content): string {
  const url = SITE + c.path;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Adam Ladhari',
    jobTitle: c.hero.role,
    description: c.meta.description,
    url,
    email: `mailto:${c.contact.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
    worksFor: { '@type': 'Organization', name: 'Arcade AI' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'INSAT Tunis' },
    sameAs: [c.contact.linkedin, c.contact.github, c.contact.artstation, c.contact.youtube],
    knowsAbout: c.toolbox.groups.map((g) => g.label),
  };
  return `<title>${esc(c.meta.title)}</title>
    <meta name="description" content="${esc(c.meta.description)}" />
    <meta name="author" content="Adam Ladhari" />
    <meta name="theme-color" content="#f7f6f2" />
    <meta name="color-scheme" content="light" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${SITE}/" />
    <link rel="alternate" hreflang="fr" href="${SITE}/fr/" />
    <link rel="alternate" hreflang="x-default" href="${SITE}/" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${esc(c.meta.title)}" />
    <meta property="og:description" content="${esc(c.meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:locale" content="${c.lang === 'fr' ? 'fr_FR' : 'en_US'}" />
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

export function renderBody(c: Content): string {
  const all = c.work.flatMap((g) => g.cases.map((k) => ({ k, org: g.org.split(' · ')[0] })));
  const stageData = {
    t: c.stage.t,
    phases: c.phases,
    introHint: c.stage.introHint,
    cases: all.map(({ k, org }) => ({ id: k.id, title: k.title, org, kicker: k.kicker, captions: k.captions })),
  };
  const w = c.workSection;
  return `<a class="skip" href="#main">${esc(c.nav.skip)}</a>
  <header class="top">
    <a class="brand" href="${c.path}">Adam Ladhari</a>
    <nav aria-label="Primary">
      <a href="#about">${esc(c.nav.about)}</a>
      <a href="#experience">${esc(c.nav.experience)}</a>
      <a href="#work">${esc(c.nav.work)}</a>
      <a href="#projects">${esc(c.nav.projects)}</a>
      <a href="#contact">${esc(c.nav.contact)}</a>
    </nav>
    <a class="lang" href="${c.altPath}" hreflang="${c.lang === 'fr' ? 'en' : 'fr'}" lang="${c.lang === 'fr' ? 'en' : 'fr'}">${esc(c.altLabel)}</a>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="hero-text">
        <p class="eyebrow">${esc(c.hero.role)} · ${esc(c.hero.location)}</p>
        <h1>${esc(c.hero.greeting)}</h1>
        <p class="lead">${esc(c.hero.lead)}</p>
        <p class="intro">${esc(c.hero.intro)}</p>
        <p class="actions">
          <a class="btn btn-primary" href="#work">${esc(c.hero.cta)}</a>
          <a class="btn" href="#contact">${esc(c.hero.cta2)}</a>
        </p>
        <p class="links">
          <a href="${c.contact.linkedin}" rel="me noopener">LinkedIn</a>
          <a href="${c.contact.github}" rel="me noopener">GitHub</a>
          <a href="mailto:${c.contact.email}">${esc(c.contact.email)}</a>
        </p>
      </div>
      <figure class="hero-visual">
        <div class="viewer-slot" id="hero-slot">
          <img class="viewer-poster" src="/og-island.jpg" alt="" width="1200" height="900" />
        </div>
        <figcaption>${esc(c.hero.viewer)}</figcaption>
      </figure>
    </section>

    <section class="band about" id="about">
      <h2>${esc(c.about.heading)}</h2>
      <div class="about-grid">
        <div class="about-text">${c.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <dl class="facts">${c.about.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>
      </div>
    </section>

    <section class="band" id="experience">
      <h2>${esc(c.experience.heading)}</h2>
      <ol class="timeline-list">${c.experience.jobs.map(job).join('')}</ol>
    </section>

    <section class="band" id="work">
      <h2>${esc(w.heading)}</h2>
      <p class="band-intro">${esc(w.intro)}</p>
      <div class="work-grid">${all.map(({ k, org }, i) => workCard(k, org, i, c)).join('')}</div>
    </section>

    <section class="band" id="projects">
      <h2>${esc(c.projects.heading)}</h2>
      <p class="band-intro">${esc(c.projects.intro)}</p>
      ${c.projects.groups
        .map(
          (g) => `<section class="project-group">
        <h3>${esc(g.label)}</h3>
        <div class="projects">${g.items.map((p) => project(p, c.projects.code)).join('')}</div>
      </section>`,
        )
        .join('')}
    </section>

    <section class="band band-split">
      <div id="skills">
        <h2>${esc(c.toolbox.heading)}</h2>
        <dl class="defs">${c.toolbox.groups.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${esc(g.details)}</dd></div>`).join('')}</dl>
      </div>
      <div id="awards">
        <h2>${esc(c.education.heading)}</h2>
        <dl class="defs">${c.education.items.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${esc(g.details)}</dd></div>`).join('')}</dl>
      </div>
    </section>

    <section class="band contact" id="contact">
      <h2>${esc(c.contact.heading)}</h2>
      <p>${esc(c.contact.text)}</p>
      <p class="actions">
        <a class="btn btn-primary" href="mailto:${c.contact.email}">${esc(c.contact.email)}</a>
        <a class="btn" href="${c.contact.linkedin}" rel="me noopener">LinkedIn</a>
        <a class="btn" href="${c.contact.github}" rel="me noopener">GitHub</a>
        <a class="btn" href="${c.contact.artstation}" rel="me noopener">ArtStation</a>
        <a class="btn" href="${c.contact.youtube}" rel="me noopener">YouTube</a>
      </p>
    </section>
  </main>

  <footer class="foot"><p>© Adam Ladhari. ${esc(c.footer)}</p></footer>

  <div class="viewer" id="viewer" hidden>
    <canvas id="stage-canvas" aria-label="${esc(c.stage.aria)}"></canvas>
    <div class="hud" id="hud" aria-hidden="true"></div>
    <div class="stage-controls" id="stage-controls"></div>
    <p class="stage-loading" id="stage-loading" hidden>${esc(c.stage.loading)}</p>
  </div>

  <dialog class="demo" id="demo" aria-labelledby="demo-title">
    <div class="demo-inner">
      <header class="demo-head">
        <div>
          <p class="kicker" id="demo-kicker"></p>
          <h2 id="demo-title"></h2>
        </div>
        <button class="icon-btn" type="button" id="demo-close" aria-label="${esc(w.close)}">✕</button>
      </header>
      <div class="demo-stage">
        <div class="viewer-slot" id="demo-slot"></div>
        <p class="demo-caption" id="demo-caption" aria-live="polite"></p>
      </div>
      <nav class="demo-steps" aria-label="${esc(c.stage.scrub)}">
        <button class="icon-btn" type="button" id="demo-prev" aria-label="${esc(w.prev)}">←</button>
        <ol>${c.phases.map((p, i) => `<li><button type="button" data-step="${i}"><span class="step-num">${i + 1}</span>${esc(p)}</button></li>`).join('')}</ol>
        <button class="icon-btn" type="button" id="demo-next" aria-label="${esc(w.next)}">→</button>
      </nav>
      <div class="demo-text" id="demo-text"></div>
    </div>
  </dialog>
  <script type="application/json" id="stage-data">${JSON.stringify(stageData).replace(/</g, '\\u003c')}</script>`;
}
