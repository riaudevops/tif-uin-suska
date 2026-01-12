import { e as createComponent, m as maybeRenderHead, r as renderTemplate, k as renderComponent } from '../../chunks/astro/server_BLjS_Fo5.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Layout_CsUgYYTq.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Sejarah$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="max-w-4xl mx-auto px-6 mt-6 text-sm text-gray-600"> <ol class="flex items-center space-x-2"> <li> <a href="/" class="hover:text-green-700 transition">Home</a> </li> <li>/</li> <li> <a href="/profil" class="hover:text-green-700 transition">Profil</a> </li> <li>/</li> <li class="text-green-700 font-semibold">Sejarah</li> </ol> </nav> <section class="max-w-4xl mx-auto px-6 py-16 space-y-12"> <header class="space-y-4"> <h1 class="text-4xl font-bold text-gray-800 border-l-8 border-green-600 pl-4">
Sejarah Program Studi Teknik Informatika
</h1> <p class="text-lg text-gray-600 leading-relaxed">
Program Studi Teknik Informatika telah berdiri sejak tahun 1999 dan 
      merupakan salah satu Program Studi favorit di UIN Suska Riau dengan 
      akreditasi <strong>B</strong> berdasarkan SK. BAN PT No : 
      1167/SK/BAN-PT/Akred/S/XI/2015.
</p> </header></section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/profil-pages/sejarah.astro", void 0);

const $$Tujuan = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="max-w-4xl mx-auto px-6 py-16 space-y-12"> <section class="bg-green-50 border border-green-200 rounded-xl p-6"> <h2 class="text-2xl font-semibold text-gray-800 mb-4">Tujuan Program Studi</h2> <ol class="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed"> <li>Menghasilkan lulusan unggul di bidang Informatika dan berakhlak Islami pada tahun 2033.</li> <li>Menghasilkan silabus dan kurikulum Informatika yang mengintegrasikan nilai keislaman.</li> <li>Menghasilkan karya ilmiah Informatika yang terintegrasi dengan nilai Islami.</li> <li>Berkontribusi dalam pengetahuan inovatif untuk membangun bangsa pada tahun 2033.</li> </ol> </section> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/profil-pages/tujuan.astro", void 0);

const $$Prospek = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="max-w-4xl mx-auto px-6 py-16 space-y-12"> <section class="space-y-4"> <h2 class="text-2xl font-semibold text-gray-800 border-l-4 border-green-600 pl-3">
Prospek Pekerjaan Lulusan
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"> ${[
    "IT Programmer",
    "IT Executive",
    "IT Administrator",
    "IT Manager",
    "IT Project Manager",
    "IT Support Officer",
    "IT Services",
    "System Analyst",
    "System Engineer",
    "Analyst Programmer",
    "Database Administrator",
    "Network Administrator",
    "Network Engineer",
    "Software Engineer",
    "Software Developer",
    "Web Designer",
    "Web Administrator",
    "Web Developer",
    "Helpdesk Analyst",
    "Computer Security Specialist",
    "Chief Information Officer"
  ].map((job) => renderTemplate`<div class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"> ${job} </div>`)} </div> </section> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/profil-pages/prospek.astro", void 0);

const $$Informasi = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="max-w-4xl mx-auto px-6 py-16 space-y-12"> <section class="bg-white shadow-md rounded-xl p-6 border border-gray-100"> <h2 class="text-2xl font-semibold text-gray-800 mb-4">Informasi Umum</h2> <ul class="space-y-2 text-gray-700"> <li><strong>Fakultas:</strong> Sains dan Teknologi</li> <li><strong>Perguruan Tinggi:</strong> Universitas Islam Negeri Sultan Syarif Kasim Riau</li> <li><strong>Penyelenggaraan PS Pertama:</strong> September 1999</li> <li><strong>Nomor SK Pendirian:</strong> 4469/D/T/2004 (14 Mei 1999)</li> <li><strong>Penandatangan SK:</strong> Dirjen Pembinaan Kelembagaan Agama Islam</li> <li><strong>Nomor SK Lanjutan:</strong> DJ.II/26/2006 — 12 November 2004</li> <li><strong>Penandatangan SK:</strong> Dirjen Pendidikan Tinggi Depdiknas</li> </ul> </section> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/profil-pages/informasi.astro", void 0);

const $$Sejarah = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sejarah" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Sejarah", $$Sejarah$1, {})} ${renderComponent($$result2, "Tujuan", $$Tujuan, {})} ${renderComponent($$result2, "Prospek", $$Prospek, {})} ${renderComponent($$result2, "Informasi", $$Informasi, {})} ` })}`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/profil-pages/sejarah.astro", void 0);

const $$file = "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/profil-pages/sejarah.astro";
const $$url = "/profil-pages/sejarah";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sejarah,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
