import { e as createComponent, m as maybeRenderHead, r as renderTemplate, k as renderComponent } from '../../chunks/astro/server_BLjS_Fo5.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Layout_CsUgYYTq.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Visi = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="max-w-4xl mx-auto px-6 mt-6 text-sm text-gray-600"> <ol class="flex items-center space-x-2"> <li> <a href="/" class="hover:text-green-700 transition">Home</a> </li> <li>/</li> <li> <a href="/profil" class="hover:text-green-700 transition">Profil</a> </li> <li>/</li> <li class="text-green-700 font-semibold">Visi, Misi, Tujuan, dan Strategi</li> </ol> </nav> <section> <h1 class="text-4xl font-bold text-gray-800 border-l-8 border-green-600 pl-4 mt-6">
Visi Keilmuan Prodi Teknik Informatika
</h1> <p class="mt-4 text-gray-700 leading-relaxed text-lg">
Menjadi Program Studi Teknik Informatika yang unggul dalam bidang Data Analytics dan Software Development yang mengintegrasikan Informatika dan Islam di Indonesia pada tahun 2025.
</p> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/visimisi-pages/visi.astro", void 0);

const $$Misi = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> <h1 class="text-4xl font-bold text-gray-800 border-l-8 border-green-600 pl-4 mt-6">
Misi Keilmuan Prodi Teknik Informatika
</h1> <p class="mt-4 text-gray-700 leading-relaxed text-lg">
Adapun Misi Keilmuan Program Studi Teknik Informatika adalah:
</p> <ol> <li>
Menghasilkan lulusan yang memiliki pengetahuan dan kompetensi di bidang Data Analytics dan Software Development dalam rangka peningkatan daya saing lulusan di tingkat nasional maupun regional.
</li> <li>
Menghasilkan lulusan yang berkontribusi dalam pembangunan masyarakat berkeadaban dengan mengintegrasikan Informatika dan nilai-nilai keIslaman di bidang Data Analytics dan Software Development.
</li> </ol> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/visimisi-pages/misi.astro", void 0);

const $$Tujuan = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> <h1>
Tujuan Prodi Teknik Informatika
</h1> <p>
Program Studi Teknik Informatika Fakultas Sains dan Teknologi UIN Suska Riau memiliki tujuan sebagai berikut:
</p> <ol> <li>
Lulusan Program Studi memiliki kemampuan mengembangkan ilmu pengetahuan dan teknologi di bidang Data Analytics dan Software Development yang unggul dan mampu bersaing di tingkat nasional.
</li> <li>
Lulusan Program Studi memiliki karir sebagai profesional dalam bidang Data Analytics dan Software Development yang adaptif, produktif, inovatif, dan mampu berkolaborasi dalam pengembangan ilmu transdisiplin.
</li> <li>
Lulusan Program Studi memiliki kemampuan memberikan solusi pemecahan masalah di lingkungan masyarakat melalui penerapan teknologi informasi berdasarkan nilai-nilai Islam.
</li> </ol> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/visimisi-pages/tujuan.astro", void 0);

const $$Strategi = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> <h1>Strategi Pencapaian Prodi Teknik Informatika</h1> <h3>
Excellent and competitive graduates
</h3> <ol> <li>
Mengembangkan kurikulum berbasis OBE dengan berfokus pada pengembangan bidang Data Analytics dan Software Development, dan Merdeka belajar yang menyesuaikan dengan kebutuhan dan tantangan pengembangan teknologi masa depan.
</li> <li>
Meningkatkan kemampuan penelitian mahasiswa di bidang Data Analytics dan Software Development.
</li> <li>
Meningkatkan kualifikasi dan kompetensi dosen di bidang Data Analytics dan Software Developmennt dalam pengembangan pembelajaran dan penelitian.
</li> <li>
Meningkatkan jejaring dengan stakeholder untuk mendukung proses pembelajaran.
</li> <li>
Meningkatkan kerjasama di bidang pendidikan melalui Merdeka Belajar Kampus Merdeka (MBKM).
</li> <li>
Menyediakan Laboratorium yang mendukung pembelajaran Data Analytics dan Software Development.
</li> </ol> </section>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/visimisi-pages/strategi.astro", void 0);

const $$Visimisi = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Visi, Misi, Tujuan, dan Strategi" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Visi", $$Visi, {})} ${renderComponent($$result2, "Misi", $$Misi, {})} ${renderComponent($$result2, "Tujuan", $$Tujuan, {})} ${renderComponent($$result2, "Strategi", $$Strategi, {})} ` })}`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/visimisi-pages/visimisi.astro", void 0);

const $$file = "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/pages/visimisi-pages/visimisi.astro";
const $$url = "/visimisi-pages/visimisi";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Visimisi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
