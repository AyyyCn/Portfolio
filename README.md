# adam-ladhari.me

Personal portfolio of Adam Ladhari. Case studies with measured results, each
replayed in a small procedural 3D world (Three.js).

- **Content** lives in `src/content/en.ts` and `src/content/fr.ts` and mirrors
  the CV. It is rendered to static HTML at build time (`src/render.ts`, wired in
  `vite.config.ts`), so every page is readable without JavaScript or WebGL.
- **3D replay** lives in `src/stage/`: `world.ts` builds the island, and each
  file in `lenses/` is one case study's replay. It loads as a separate chunk
  after the text.
- `/` is English, `/fr/` is French. Add `?static` to any URL to see the
  text-only page a device without WebGL gets.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```
