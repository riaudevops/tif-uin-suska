import { e as createComponent, m as maybeRenderHead, r as renderTemplate, k as renderComponent } from '../../chunks/astro/server_BLjS_Fo5.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Layout_CsUgYYTq.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Panduan$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="max-w-4xl mx-auto px-6 mt-6 text-sm text-gray-600"> <ol class="flex items-center space-x-2"> <li> <a href="/" class="hover:text-green-700 transition">Home</a> </li> <li>/</li> <li> <a href="/profil" class="hover:text-green-700 transition">Profil</a> </li> <li>/</li> <li class="text-green-700 font-semibold">Panduan Pengelolaan Pendidikan</li> </ol> </nav> <section class="max-w-4xl mx-auto px-6 py-16 space-y-12"> <div class="space-y-6"> <img src="/public/globals/landing-pages/gedung-faste.jpg" alt="rencana strategi" class="w-full h-auto rounded-lg shadow-md"> <h1 class="text-4xl font-bold text-gray-800 border-l-8 border-green-600 pl-4 mt-6">
Panduan Pengelolaan Pendidikan
</h1> <p class="mt-4 text-gray-700 text-lg leading-relaxed">
Dokumen panduan pengelolaan pendidikan Program Studi Teknik Informatika dapat diunduh di sini.
</p> </div> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/panduan-pages/panduan.astro", void 0);

const $$Panduan = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Panduan Pengelolaan Pendidikan" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Panduan", $$Panduan$1, {})} ` })}`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/panduan-pages/panduan.astro", void 0);

const $$file = "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/panduan-pages/panduan.astro";
const $$url = "/panduan-pages/panduan";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Panduan,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
