import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { en } from './src/content/en.ts';
import { fr } from './src/content/fr.ts';
import { renderBody, renderHead } from './src/render.ts';

// Renders the whole page to static HTML at build time, so the text is readable
// without JavaScript, WebGL or a 3D-capable device.
function staticContent(): Plugin {
  return {
    name: 'static-content',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const content = ctx.path.startsWith('/fr') ? fr : en;
        return html.replace('<!--head-->', renderHead(content)).replace('<!--body-->', renderBody(content));
      },
    },
  };
}

export default defineConfig({
  plugins: [staticContent()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        fr: resolve(import.meta.dirname, 'fr/index.html'),
      },
    },
  },
});
