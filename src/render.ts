import type { CaseStudy, Content, Job, Metric } from './content/types';

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

function caseStudy(c: CaseStudy, i: number, content: Content): string {
  const n = String(i + 1).padStart(2, '0');
  const phases: [string, string][] = [
    [content.phases[0], c.problem],
    [content.phases[1], c.built],
    [content.phases[2], c.measured],
    [content.phases[3], c.result],
  ];
  return `<article class="case" id="case-${c.id}" data-case="${i}" data-lens="${c.id}">
    <header class="case-head">
      <p class="kicker"><span class="case-num">${n}</span> ${esc(c.kicker)}</p>
      <h3>${esc(c.title)}</h3>
    </header>
    ${phases
      .map(
        ([label, text], p) => `<section class="phase" data-phase="${p}">
      <h4>${esc(label)}</h4>
      <p>${esc(text)}</p>
      ${p === 3 ? bar(c) + metrics(c.metrics) : ''}
    </section>`,
      )
      .join('\n')}
  </article>`;
}

function job(j: Job): string {
  return `<article class="job">
    <header>
      <h3>${esc(j.org)} <span class="job-note">${esc(j.orgNote)}</span></h3>
      <p class="job-meta">${esc(j.role)} · ${esc(j.dates)} · ${esc(j.place)}</p>
    </header>
    <ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
    ${metrics(j.metrics, 'tiles tiles-inline')}
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
    sameAs: [c.contact.linkedin, c.contact.github],
    knowsAbout: c.toolbox.groups.map((g) => g.label),
  };
  return `<title>${esc(c.meta.title)}</title>
    <meta name="description" content="${esc(c.meta.description)}" />
    <meta name="author" content="Adam Ladhari" />
    <meta name="theme-color" content="#0c1016" />
    <meta name="color-scheme" content="dark" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${SITE}/" />
    <link rel="alternate" hreflang="fr" href="${SITE}/fr/" />
    <link rel="alternate" hreflang="x-default" href="${SITE}/" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${esc(c.meta.title)}" />
    <meta property="og:description" content="${esc(c.meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="${c.lang === 'fr' ? 'fr_FR' : 'en_US'}" />
    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

export function renderBody(c: Content): string {
  const stageData = {
    t: c.stage.t,
    phases: c.phases,
    introTitle: c.stage.introTitle,
    introHint: c.stage.introHint,
    cases: c.cases.map((k) => ({ id: k.id, title: k.kicker })),
  };
  return `<a class="skip" href="#main">${esc(c.nav.skip)}</a>
  <header class="top">
    <a class="brand" href="${c.path}">Adam Ladhari</a>
    <nav aria-label="Primary">
      <a href="#work">${esc(c.nav.work)}</a>
      <a href="#earlier">${esc(c.nav.earlier)}</a>
      <a href="#toolbox">${esc(c.nav.toolbox)}</a>
      <a href="#contact">${esc(c.nav.contact)}</a>
    </nav>
    <a class="lang" href="${c.altPath}" hreflang="${c.lang === 'fr' ? 'en' : 'fr'}" lang="${c.lang === 'fr' ? 'en' : 'fr'}">${esc(c.altLabel)}</a>
  </header>

  <main id="main">
    <div class="replay">
      <aside class="stage" id="stage" hidden aria-label="${esc(c.stage.aria)}">
        <div class="stage-head">
          <span class="stage-tag">${esc(c.stage.tag)}</span>
          <span class="stage-title" id="stage-title">${esc(c.stage.introTitle)}</span>
        </div>
        <div class="stage-view">
          <canvas id="stage-canvas"></canvas>
          <div class="hud" id="hud" aria-hidden="true"></div>
          <div class="stage-controls" id="stage-controls"></div>
          <button class="stage-load" id="stage-load" type="button" hidden>${esc(c.stage.load)}</button>
        </div>
        <div class="timeline" id="timeline">
          <ol class="phase-tabs">
            ${c.phases.map((p, i) => `<li><button type="button" data-goto="${i}">${esc(p)}</button></li>`).join('')}
          </ol>
          <input id="scrub" type="range" min="0" max="300" value="0" aria-label="${esc(c.stage.scrub)}" />
        </div>
        <p class="stage-note">${esc(c.stage.note)}</p>
        <script type="application/json" id="stage-data">${JSON.stringify(stageData).replace(/</g, '\\u003c')}</script>
      </aside>

      <div class="story">
        <section class="hero" id="top">
          <p class="eyebrow">${esc(c.hero.role)} · ${esc(c.hero.location)}</p>
          <h1>Adam Ladhari</h1>
          <p class="lead">${esc(c.hero.lead)}</p>
          <p class="profile">${esc(c.hero.profile)}</p>
          <p class="actions">
            <a class="btn btn-primary" href="#work">${esc(c.hero.cta)}</a>
            <a class="btn" href="mailto:${c.contact.email}">${esc(c.contact.email)}</a>
            <a class="btn" href="${c.contact.linkedin}" rel="me noopener">LinkedIn</a>
            <a class="btn" href="${c.contact.github}" rel="me noopener">GitHub</a>
          </p>
          ${metrics(c.headline, 'tiles tiles-headline')}
        </section>

        <section class="work" id="work">
          <header class="section-head">
            <h2>${esc(c.arcade.heading)}</h2>
            <p class="job-meta">${esc(c.arcade.role)} · ${esc(c.arcade.dates)}</p>
            <p>${esc(c.arcade.intro)}</p>
          </header>
          ${c.cases.map((k, i) => caseStudy(k, i, c)).join('\n')}
        </section>
      </div>
    </div>

    <section class="band" id="earlier">
      <h2>${esc(c.earlier.heading)}</h2>
      <div class="jobs">${c.earlier.jobs.map(job).join('\n')}</div>
    </section>

    <section class="band band-split">
      <div id="toolbox">
        <h2>${esc(c.toolbox.heading)}</h2>
        <dl class="defs">${c.toolbox.groups.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${esc(g.details)}</dd></div>`).join('')}</dl>
      </div>
      <div id="education">
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
      </p>
    </section>
  </main>

  <footer class="foot"><p>© Adam Ladhari. ${esc(c.footer)}</p></footer>`;
}
