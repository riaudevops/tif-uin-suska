import { e as createComponent, m as maybeRenderHead, r as renderTemplate, k as renderComponent } from '../../chunks/astro/server_BLjS_Fo5.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Layout_CsUgYYTq.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Dosen$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="bg-gradient-to-b from-gray-50 to-white py-24"> <div class="container mx-auto px-6"> <div class="max-w-4xl mx-auto text-center"> <h1 class="text-4xl font-bold text-blue-900 mb-8">
Dosen
</h1> <h2 class="text-lg text-gray-700 mb-12">
Prodi Teknik Informatika UIN Sultan Syarif Kasim Riau memiliki dosen yang berpengalaman dan kompeten dalam bidangnya yang mengajar dan melatih para mahasiswa agar menjadi lulusan yang berkualitas dan siap untuk menghadapi dunia kerja.
</h2> <img src="/public/globals/landing-pages/dosen.jpg" alt="dosen" class="mx-auto rounded-2xl shadow-lg max-h-96 object-cover"> </div> </div> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/dosen-pages/dosen.astro", void 0);

const $$Isi = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> <div> <div></div> </div> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/dosen-pages/isi.astro", void 0);

const $$Dosen = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dosen" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Dosen", $$Dosen$1, {})} ${renderComponent($$result2, "Isi", $$Isi, {})} ` })}`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/dosen-pages/dosen.astro", void 0);

const $$file = "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/dosen-pages/dosen.astro";
const $$url = "/dosen-pages/dosen";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dosen,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
