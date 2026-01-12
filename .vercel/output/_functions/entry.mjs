import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_B5A5SS1-.mjs';
import { manifest } from './manifest_DOE1AUfa.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/search.astro.mjs');
const _page2 = () => import('./pages/dosen-pages/dosen.astro.mjs');
const _page3 = () => import('./pages/panduan-pages/panduan.astro.mjs');
const _page4 = () => import('./pages/profil-pages/sejarah.astro.mjs');
const _page5 = () => import('./pages/rencana-pages/rencana.astro.mjs');
const _page6 = () => import('./pages/visimisi-pages/visimisi.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/search.js", _page1],
    ["src/pages/dosen-pages/dosen.astro", _page2],
    ["src/pages/panduan-pages/panduan.astro", _page3],
    ["src/pages/profil-pages/sejarah.astro", _page4],
    ["src/pages/rencana-pages/rencana.astro", _page5],
    ["src/pages/visimisi-pages/visimisi.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "40043731-052a-42ae-82cf-e4d2736a477e",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
