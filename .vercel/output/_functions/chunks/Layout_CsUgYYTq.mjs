import { e as createComponent, m as maybeRenderHead, l as renderScript, r as renderTemplate, f as createAstro, s as spreadAttributes, h as addAttribute, n as renderSlot, k as renderComponent, o as renderHead } from './astro/server_BLjS_Fo5.mjs';
import 'piccolore';
/* empty css                         */
import 'clsx';

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70"> <!-- Top Bar --> <div class="w-full bg-[#004d2c] text-white text-sm"> <div class="container mx-auto px-4 py-2 flex justify-end items-center gap-4"> <a href="#" class="hover:underline">International Office</a> <a href="#" class="hover:underline">Akreditasi</a> <a href="#" class="hover:underline">Mitra</a> <select class="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-md focus:outline-none"> <option>ID</option> <option>EN</option> </select> </div> </div> <!-- Logo + Judul + Unggul --> <div class="container mx-auto flex items-center justify-between py-4 px-4"> <div class="flex items-center gap-4"> <!-- Logo UIN --> <img src="/logo/uin.png" alt="Logo UIN Suska Riau" class="w-10 h-10 object-contain"> <!-- Teks TEKNIK INFORMATIKA + Fakultas --> <div class="flex flex-col leading-tight"> <a href="/" class="text-base md:text-lg font-semibold text-gray-900">TEKNIK INFORMATIKA</a> <span class="text-xs md:text-sm text-gray-600">FAKULTAS SAINS DAN TEKNOLOGI</span> </div> <!-- Logo Unggul --> <img src="/logo/unggul.png" alt="Logo Unggul" class="w-10 h-10 object-contain"> </div> <!-- Menu Desktop --> <div class="hidden md:flex items-center gap-6 text-gray-800 font-medium"> <a href="/" class="hover:text-yellow-600 px-3 py-2 transition">Beranda</a> <!-- Dropdown Profil --> <div class="relative" data-dropdown> <button type="button" class="flex items-center gap-1 px-3 py-2 hover:text-yellow-600 transition" data-menu-btn="profil" aria-expanded="false" aria-controls="menu-profil">
Profil
<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg> </button> <div id="menu-profil" class="absolute bg-white shadow-xl rounded-lg p-4 w-64 mt-2 z-50 hidden" data-menu="profil" role="menu"> <a href="/profil-pages/sejarah" class="block py-2 px-3 hover:bg-gray-100 rounded">Sejarah</a> <a href="/visimisi-pages/visimisi" class="block py-2 px-3 hover:bg-gray-100 rounded">Visi, Misi, Tujuan, dan Strategi</a> <a href="/rencana-pages/rencana" class="block py-2 px-3 hover:bg-gray-100 rounded">Rencana Strategi</a> <a href="/panduan-pages/panduan" class="block py-2 px-3 hover:bg-gray-100 rounded">Panduan Pengelolaan Pendidikan</a> <a href="/struktur" class="block py-2 px-3 hover:bg-gray-100 rounded">Struktur Organisasi</a> <a href="/dosen-pages/dosen" class="block py-2 px-3 hover:bg-gray-100 rounded">Dosen</a> <a href="/laboratorium" class="block py-2 px-3 hover:bg-gray-100 rounded">Laboratorium</a> <a href="/ruang-kelas" class="block py-2 px-3 hover:bg-gray-100 rounded">Ruang Kelas</a> <a href="/prestasi" class="block py-2 px-3 hover:bg-gray-100 rounded">Prestasi</a> </div> </div> <!-- Dropdown Akademik --> <div class="relative" data-dropdown> <button type="button" class="flex items-center gap-1 px-3 py-2 hover:text-yellow-600 transition" data-menu-btn="akademik" aria-expanded="false" aria-controls="menu-akademik">
Akademik
<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg> </button> <div id="menu-akademik" class="absolute bg-white shadow-xl rounded-lg p-4 w-64 mt-2 z-50 hidden" data-menu="akademik" role="menu"> <a href="/penerimaan" class="block py-2 px-3 hover:bg-gray-100 rounded">Penerimaan</a> <a href="/pelayanan" class="block py-2 px-3 hover:bg-gray-100 rounded">Pelayanan Administrasi</a> <a href="/kurikulum" class="block py-2 px-3 hover:bg-gray-100 rounded">Kurikulum</a> <a href="/kalender" class="block py-2 px-3 hover:bg-gray-100 rounded">Kalender Akademik</a> <a href="/beasiswa" class="block py-2 px-3 hover:bg-gray-100 rounded">Beasiswa</a> <a href="/tugas-akhir" class="block py-2 px-3 hover:bg-gray-100 rounded">Info Tugas Akhir (TA)</a> <a href="/kerja-praktik" class="block py-2 px-3 hover:bg-gray-100 rounded">Info Kerja Praktik (KP)</a> <a href="/labssquad" class="block py-2 px-3 hover:bg-gray-100 rounded">Labs Squad</a> </div> </div> <!-- Dropdown Penelitian --> <div class="relative" data-dropdown> <button type="button" class="flex items-center gap-1 px-3 py-2 hover:text-yellow-600 transition" data-menu-btn="penelitian" aria-expanded="false" aria-controls="menu-penelitian">
Penelitian
<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg> </button> <div id="menu-penelitian" class="absolute bg-white shadow-xl rounded-lg p-4 w-64 mt-2 z-50 hidden" data-menu="penelitian" role="menu"> <a href="/jurnal" class="block py-2 px-3 hover:bg-gray-100 rounded">Jurnal COreIT</a> <a href="/aiorc" class="block py-2 px-3 hover:bg-gray-100 rounded">AIORC</a> <a href="/software" class="block py-2 px-3 hover:bg-gray-100 rounded">Software Engineering</a> <a href="/teknologi" class="block py-2 px-3 hover:bg-gray-100 rounded">Information Technology</a> </div> </div> <a href="/berita" class="hover:text-yellow-600 px-3 py-2 transition">Berita</a> <a href="/agenda" class="hover:text-yellow-600 px-3 py-2 transition">Agenda</a> <a href="/alumni" class="hover:text-yellow-600 px-3 py-2 transition">Alumni</a> <a href="https://hima.tif.uin-suska.ac.id/" target="_blank" class="hover:text-yellow-600 px-3 py-2 transition">HIMATIF</a> </div> <!-- Mobile Menu Button --> <button class="md:hidden text-2xl text-gray-800" id="mobile-menu-btn">☰</button> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg hidden"> <div class="container mx-auto py-4 px-4 flex flex-col gap-2"> <a href="/" class="py-2 px-3 hover:bg-gray-100 rounded">Beranda</a> <a href="/profil" class="py-2 px-3 hover:bg-gray-100 rounded">Profil</a> <a href="/akademik" class="py-2 px-3 hover:bg-gray-100 rounded">Akademik</a> <a href="/penelitian" class="py-2 px-3 hover:bg-gray-100 rounded">Penelitian</a> <a href="/berita" class="py-2 px-3 hover:bg-gray-100 rounded">Berita</a> <a href="/agenda" class="py-2 px-3 hover:bg-gray-100 rounded">Agenda</a> <a href="/alumni" class="py-2 px-3 hover:bg-gray-100 rounded">Alumni</a> <a href="https://hima.tif.uin-suska.ac.id/" target="_blank" class="py-2 px-3 hover:bg-gray-100 rounded">HIMATIF</a> </div> </div> <!-- Bottom Accent --> <div class="w-full h-4 bg-[#004d2c]"></div> </nav> ${renderScript($$result, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/globals/navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/globals/navbar.astro", void 0);

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

const $$Astro = createAstro();
const $$Icon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Icon;
  const {
    color = "currentColor",
    size = 24,
    "stroke-width": strokeWidth = 2,
    absoluteStrokeWidth = false,
    iconNode = [],
    class: className,
    ...rest
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes({
    ...defaultAttributes,
    width: size,
    height: size,
    stroke: color,
    "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
    ...rest
  })}${addAttribute(["lucide", className], "class:list")}> ${iconNode.map(([Tag, attrs]) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs })}`)} ${renderSlot($$result, $$slots["default"])} </svg>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/node_modules/@lucide/astro/src/Icon.astro", void 0);

const createLucideIcon = (iconName, iconNode) => {
  const Component = createComponent(
    ($$result, $$props, $$slots) => {
      const { class: className, ...restProps } = $$props;
      return renderTemplate`${renderComponent(
        $$result,
        "Icon",
        $$Icon,
        {
          class: mergeClasses(
            Boolean(iconName) && `lucide-${toKebabCase(iconName)}`,
            Boolean(className) && className
          ),
          iconNode,
          ...restProps
        },
        { default: () => renderTemplate`${renderSlot($$result, $$slots["default"])}` }
      )}`;
    },
    void 0,
    "none"
  );
  return Component;
};

const Facebook = createLucideIcon("facebook", [["path", { "d": "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }]]);

const Github = createLucideIcon("github", [["path", { "d": "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }], ["path", { "d": "M9 18c-4.51 2-5-2-7-2" }]]);

const Instagram = createLucideIcon("instagram", [["rect", { "width": "20", "height": "20", "x": "2", "y": "2", "rx": "5", "ry": "5" }], ["path", { "d": "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }], ["line", { "x1": "17.5", "x2": "17.51", "y1": "6.5", "y2": "6.5" }]]);

const Mail = createLucideIcon("mail", [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }]]);

const Youtube = createLucideIcon("youtube", [["path", { "d": "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" }], ["path", { "d": "m10 15 5-3-5-3z" }]]);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="relative bg-slate-900 text-slate-300 pt-20"> <div class="absolute inset-0 bg-[url('/landing-pages/gedung-faste.jpg')] bg-cover bg-center opacity-5"></div> <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12"> <div class="lg:col-span-5 flex flex-col gap-8"> <div class="flex items-center gap-6"> <div class="flex flex-col items-center border-r border-slate-700 pr-6"> <img src="/logo/uin.png" alt="Logo UIN Suska" class="h-20 w-auto"> <span class="text-[10px] font-bold text-blue-400 mt-2 uppercase tracking-tighter text-center">
UIN Suska Riau
</span> </div> <div class="flex flex-col"> <h1 class="text-2xl md:text-3xl font-bold tracking-wide text-white leading-tight uppercase">
Teknik Informatika
</h1> <h2 class="text-lg md:text-xl font-light text-slate-400 leading-tight uppercase">
Fakultas Sains dan Teknologi
</h2> </div> </div> <div class="space-y-6"> <p class="text-sm leading-relaxed text-slate-400 max-w-md">
Program Studi Teknik Informatika UIN Sultan Syarif Kasim Riau resmi memperoleh
<strong class="text-slate-200">Akreditasi Unggul</strong> dari LAM INFOKOM (2025). 
          Fokus pada integrasi teknologi informasi dengan nilai-nilai Keislaman.
</p> <div class="flex flex-wrap items-center gap-6 pt-2"> <img src="/logo/uin.png" alt="UIN Suska" class="h-8 opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0"> <img src="/logo/unggul.png" alt="Akreditasi Unggul" class="h-7 opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0"> <img src="/logo/blu.png" alt="BLU" class="h-6 opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0"> <img src="/logo/kemenag.png" alt="Kemenag" class="h-7 opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0"> </div> </div> </div> <div class="lg:col-span-3"> <h3 class="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-2">Kontak</h3> <div class="space-y-4 text-sm opacity-90"> <p class="leading-relaxed">
Jl. HR. Soebrantas No.155 KM 18<br>
Simpang Baru Panam, Pekanbaru 28293
</p> <a href="mailto:tif@uin-suska.ac.id" class="flex items-center gap-3 hover:text-blue-400 transition group"> <div class="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700"> ${renderComponent($$result, "Mail", Mail, { "size": 16 })} </div>
tif@uin-suska.ac.id
</a> <div class="flex gap-4 mt-6"> <a href="https://facebook.com/tifuinsuska" class="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition">${renderComponent($$result, "Facebook", Facebook, { "size": 18 })}</a> <a href="https://instagram.com/tifuinsuska" class="p-2 bg-slate-800 rounded-lg hover:bg-pink-600 hover:text-white transition">${renderComponent($$result, "Instagram", Instagram, { "size": 18 })}</a> <a href="https://github.com/tifuinsuska" class="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition">${renderComponent($$result, "Github", Github, { "size": 18 })}</a> <a href="https://youtube.com/tifuinsuska" class="p-2 bg-slate-800 rounded-lg hover:bg-red-600 hover:text-white transition">${renderComponent($$result, "Youtube", Youtube, { "size": 18 })}</a> </div> </div> </div> <div class="lg:col-span-2 text-sm"> <h3 class="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-2">Layanan</h3> <ul class="space-y-3"> <li><a href="#" class="hover:text-blue-400 transition">SIREG</a></li> <li><a href="https://iraisenew.uin-suska.ac.id" class="hover:text-blue-400 transition">IRaise</a></li> <li><a href="https://elearning.uin-suska.ac.id/login/index.php" class="hover:text-blue-400 transition">E-Learning</a></li> <li><a href="https://dashboard.tif.uin-suska.ac.id/" class="hover:text-blue-400 transition">Dashboard TIF</a></li> </ul> </div> <div class="lg:col-span-2 text-sm font-medium"> <h3 class="text-lg font-semibold text-white mb-6 border-b border-slate-800 pb-2">LabsSquad</h3> <ul class="space-y-3"> <li><a href="https://riaudevops.id/" class="hover:text-emerald-400 transition">Riau DevOps</a></li> <li><a href="https://www.instagram.com/alisi.usr/" class="hover:text-emerald-400 transition">Aliansi Siber</a></li> <li><a href="#" class="hover:text-emerald-400 transition">Figma Squad</a></li> <li><a href="#" class="hover:text-emerald-400 transition">AIOT</a></li> </ul> </div> </div> <div class="max-w-7xl mx-auto px-6 mt-16 pt-10 border-t border-slate-800/50"> <div class="flex flex-col md:flex-row justify-center gap-12 lg:gap-24 items-start"> <div class="flex flex-col items-center"> <h3 class="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 text-center">Lokasi Kampus</h3> <div class="w-[280px] h-[150px] rounded-xl overflow-hidden border border-slate-700 grayscale hover:grayscale-0 transition duration-500"> <iframe src="https://www.google.com/maps/embed?..." class="w-full h-full" loading="lazy">
          </iframe> </div> </div> <div class="flex flex-col items-center text-center"> <h3 class="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Layanan Administrasi</h3> <div class="bg-white p-2 rounded-lg w-[120px]"> <img src="/qr/qrcode-tif-e1732246849890.png" alt="QR Administrasi" class="w-full h-auto"> </div> <p class="text-[10px] mt-3 text-slate-500 max-w-[150px]">Scan QR untuk akses cepat layanan administrasi akademik</p> </div> </div> </div> <div class="mt-20 bg-slate-950 border-t border-slate-800"> <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-[11px] md:text-xs tracking-wide"> <p class="text-slate-500 text-center md:text-left">
&copy; 2025 <span class="text-slate-300 font-medium">Teknik Informatika UIN Suska Riau</span>. All rights reserved.
</p> <div class="flex gap-6 mt-4 md:mt-0 text-slate-500"> <a href="#" class="hover:text-white transition">Privacy Policy</a> <a href="#" class="hover:text-white transition">Terms of Service</a> </div> </div> </div> </footer>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/pages/landing-pages/footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Search = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<!-- ---\nconst placeholder = "Cari halaman...";\n---\n\n<div class="w-full max-w-xl mx-auto mt-10 relative">\n  <input\n    id="searchBox"\n    type="text"\n    placeholder={placeholder}\n    class="w-full px-4 py-2 rounded-lg border bg-white shadow"\n  />\n\n  <div\n    id="results"\n    class="hidden absolute z-50 w-full mt-2 bg-white shadow-lg rounded-lg max-h-64 overflow-auto"\n  ></div>\n</div>\n\n<script is:inline>\n  document.addEventListener("DOMContentLoaded", () => {\n    const box = document.getElementById("searchBox");\n    const results = document.getElementById("results");\n\n    let data = [];\n\n    fetch("/api/search")\n      .then(res => res.json())\n      .then(json => data = json);\n\n    function debounce(fn, delay = 300) {\n      let timer;\n      return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), delay);\n      };\n    }\n\n    function highlight(text, keyword) {\n      if (!keyword) return text;\n      const escaped = keyword.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");\n      return text.replace(\n        new RegExp(`(${escaped})`, "gi"),\n        `<mark class="bg-yellow-200">$1</mark>`\n      );\n    }\n\n    const handleSearch = debounce(() => {\n      const q = box.value.toLowerCase().trim();\n\n      if (!q) {\n        results.classList.add("hidden");\n        results.innerHTML = "";\n        return;\n      }\n\n      const filtered = data.filter(\n        item =>\n          item.title.toLowerCase().includes(q) ||\n          item.text.toLowerCase().includes(q)\n      );\n\n      if (!filtered.length) {\n        results.innerHTML =\n          `<div class="px-4 py-2 text-gray-500">Tidak ada hasil</div>`;\n        results.classList.remove("hidden");\n        return;\n      }\n\n      results.innerHTML = filtered.slice(0, 10).map(item => `\n        <a href="${item.path}" class="block px-4 py-2 hover:bg-gray-100">\n          <div class="font-semibold">\n            ${highlight(item.title, q)}\n          </div>\n          <p class="text-sm text-gray-600">\n            ${highlight(item.text.slice(0, 100), q)}...\n          </p>\n        </a>\n      `).join("");\n\n      results.classList.remove("hidden");\n    }, 300);\n\n    box.addEventListener("input", handleSearch);\n  });\n<\/script> -->'], ['<!-- ---\nconst placeholder = "Cari halaman...";\n---\n\n<div class="w-full max-w-xl mx-auto mt-10 relative">\n  <input\n    id="searchBox"\n    type="text"\n    placeholder={placeholder}\n    class="w-full px-4 py-2 rounded-lg border bg-white shadow"\n  />\n\n  <div\n    id="results"\n    class="hidden absolute z-50 w-full mt-2 bg-white shadow-lg rounded-lg max-h-64 overflow-auto"\n  ></div>\n</div>\n\n<script is:inline>\n  document.addEventListener("DOMContentLoaded", () => {\n    const box = document.getElementById("searchBox");\n    const results = document.getElementById("results");\n\n    let data = [];\n\n    fetch("/api/search")\n      .then(res => res.json())\n      .then(json => data = json);\n\n    function debounce(fn, delay = 300) {\n      let timer;\n      return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), delay);\n      };\n    }\n\n    function highlight(text, keyword) {\n      if (!keyword) return text;\n      const escaped = keyword.replace(/[.*+?^\\${}()|[\\\\]\\\\\\\\]/g, "\\\\\\\\$&");\n      return text.replace(\n        new RegExp(\\`(\\${escaped})\\`, "gi"),\n        \\`<mark class="bg-yellow-200">$1</mark>\\`\n      );\n    }\n\n    const handleSearch = debounce(() => {\n      const q = box.value.toLowerCase().trim();\n\n      if (!q) {\n        results.classList.add("hidden");\n        results.innerHTML = "";\n        return;\n      }\n\n      const filtered = data.filter(\n        item =>\n          item.title.toLowerCase().includes(q) ||\n          item.text.toLowerCase().includes(q)\n      );\n\n      if (!filtered.length) {\n        results.innerHTML =\n          \\`<div class="px-4 py-2 text-gray-500">Tidak ada hasil</div>\\`;\n        results.classList.remove("hidden");\n        return;\n      }\n\n      results.innerHTML = filtered.slice(0, 10).map(item => \\`\n        <a href="\\${item.path}" class="block px-4 py-2 hover:bg-gray-100">\n          <div class="font-semibold">\n            \\${highlight(item.title, q)}\n          </div>\n          <p class="text-sm text-gray-600">\n            \\${highlight(item.text.slice(0, 100), q)}...\n          </p>\n        </a>\n      \\`).join("");\n\n      results.classList.remove("hidden");\n    }, 300);\n\n    box.addEventListener("input", handleSearch);\n  });\n<\/script> -->'])));
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/components/globals/search.astro", void 0);

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><link rel="stylesheet" href="../styles/global.css">${renderHead()}</head> <body> <main> ${renderComponent($$result, "Navbar", $$Navbar, {})} ${renderComponent($$result, "Search", $$Search, {})} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, {})} </main> </body></html>`;
}, "C:/Users/ASUS/Aidil/RDO/ProfileKampus/profile/src/layouts/Layout.astro", void 0);

export { $$Layout as $, $$Navbar as a };
