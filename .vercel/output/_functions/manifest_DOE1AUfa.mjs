import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_BLjS_Fo5.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_ays4qUET.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/","cacheDir":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/node_modules/.astro/","outDir":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/dist/","srcDir":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/","publicDir":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/public/","buildClientDir":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/dist/client/","buildServerDir":"file:///C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/search","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/search\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/search.js","pathname":"/api/search","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dosen.DWtNX24b.css"}],"routeData":{"route":"/dosen-pages/dosen","isIndex":false,"type":"page","pattern":"^\\/dosen-pages\\/dosen\\/?$","segments":[[{"content":"dosen-pages","dynamic":false,"spread":false}],[{"content":"dosen","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dosen-pages/dosen.astro","pathname":"/dosen-pages/dosen","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dosen.DWtNX24b.css"}],"routeData":{"route":"/panduan-pages/panduan","isIndex":false,"type":"page","pattern":"^\\/panduan-pages\\/panduan\\/?$","segments":[[{"content":"panduan-pages","dynamic":false,"spread":false}],[{"content":"panduan","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/panduan-pages/panduan.astro","pathname":"/panduan-pages/panduan","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dosen.DWtNX24b.css"}],"routeData":{"route":"/profil-pages/sejarah","isIndex":false,"type":"page","pattern":"^\\/profil-pages\\/sejarah\\/?$","segments":[[{"content":"profil-pages","dynamic":false,"spread":false}],[{"content":"sejarah","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profil-pages/sejarah.astro","pathname":"/profil-pages/sejarah","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dosen.DWtNX24b.css"}],"routeData":{"route":"/rencana-pages/rencana","isIndex":false,"type":"page","pattern":"^\\/rencana-pages\\/rencana\\/?$","segments":[[{"content":"rencana-pages","dynamic":false,"spread":false}],[{"content":"rencana","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rencana-pages/rencana.astro","pathname":"/rencana-pages/rencana","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dosen.DWtNX24b.css"}],"routeData":{"route":"/visimisi-pages/visimisi","isIndex":false,"type":"page","pattern":"^\\/visimisi-pages\\/visimisi\\/?$","segments":[[{"content":"visimisi-pages","dynamic":false,"spread":false}],[{"content":"visimisi","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/visimisi-pages/visimisi.astro","pathname":"/visimisi-pages/visimisi","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dosen.DWtNX24b.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/dosen-pages/dosen.astro",{"propagation":"none","containsHead":true}],["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/panduan-pages/panduan.astro",{"propagation":"none","containsHead":true}],["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/profil-pages/sejarah.astro",{"propagation":"none","containsHead":true}],["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/rencana-pages/rencana.astro",{"propagation":"none","containsHead":true}],["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/visimisi-pages/visimisi.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/search@_@js":"pages/api/search.astro.mjs","\u0000@astro-page:src/pages/dosen-pages/dosen@_@astro":"pages/dosen-pages/dosen.astro.mjs","\u0000@astro-page:src/pages/panduan-pages/panduan@_@astro":"pages/panduan-pages/panduan.astro.mjs","\u0000@astro-page:src/pages/profil-pages/sejarah@_@astro":"pages/profil-pages/sejarah.astro.mjs","\u0000@astro-page:src/pages/rencana-pages/rencana@_@astro":"pages/rencana-pages/rencana.astro.mjs","\u0000@astro-page:src/pages/visimisi-pages/visimisi@_@astro":"pages/visimisi-pages/visimisi.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DOE1AUfa.mjs","C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BcFx4lf-.mjs","@astrojs/react/client.js":"_astro/client.C3DCzcxU.js","C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/globals/navbar.astro?astro&type=script&index=0&lang.ts":"_astro/navbar.astro_astro_type_script_index_0_lang.CngpTDkK.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/globals/navbar.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const o=Array.from(document.querySelectorAll(\"[data-menu-btn]\")),a=Array.from(document.querySelectorAll(\"[data-menu]\"));function s(){a.forEach(e=>{e.classList.add(\"hidden\");const n=e.getAttribute(\"data-menu\"),d=document.querySelector(`[data-menu-btn=\"${n}\"]`);d&&d.setAttribute(\"aria-expanded\",\"false\")})}o.forEach(e=>{e.addEventListener(\"click\",n=>{n.stopPropagation();const d=e.getAttribute(\"data-menu-btn\");if(!d)return;const t=document.querySelector(`[data-menu=\"${d}\"]`);if(!t)return;a.forEach(i=>{i!==t&&i.classList.add(\"hidden\")}),t.classList.contains(\"hidden\")?(t.classList.remove(\"hidden\"),e.setAttribute(\"aria-expanded\",\"true\"),t.focus?.()):(t.classList.add(\"hidden\"),e.setAttribute(\"aria-expanded\",\"false\"))})}),a.forEach(e=>{e.addEventListener(\"click\",n=>{n.stopPropagation()})}),document.addEventListener(\"click\",()=>{s()}),document.addEventListener(\"keydown\",e=>{e.key===\"Escape\"&&s()})});"]],"assets":["/_astro/dosen.DWtNX24b.css","/aidil.png","/aidil1.png","/aidil22.png","/favicon.svg","/dosen-pages/dosen.jpg","/news-pages/tes.jpg","/logo/blu.png","/logo/kemenag.png","/logo/uin.png","/logo/unggul.png","/landing-pages/aidil.png","/landing-pages/gedung-faste.jpg","/landing-pages/gedung.jpg","/landing-pages/Pertemuan.png","/qr/qrcode-tif-e1732246849890.png","/prestasi-pages/innovasi.jpg","/prestasi-pages/prestasi.jpg","/_astro/client.C3DCzcxU.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"3jzIqr+arOYDapnePacZqHRYA/hHTEQB5GzktjDIQKw="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
