// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { LEGACY_REDIRECTS } from './src/lib/legacy-redirects.js';

// https://astro.build/config
export default defineConfig({
	site: "https://tif.uin-suska.ac.id",
	output: "server",

	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},

	adapter: node({
		mode: "standalone",
		// No upload/form endpoints exist: reject oversized bodies early instead
		// of buffering up to the 1 GB adapter default.
		bodySizeLimit: 256 * 1024,
	}),

<<<<<<< HEAD
	integrations: [react(),
		sitemap()
	],

	redirects: {
		"/profil/sejarah": "/profile/history",
		"/profil": "/profile/history",
		"/visi-misi/visimisi": "/profile/vision-mission",
		"/visimisi/visimisi": "/profile/vision-mission",
		"/visi-misi": "/profile/vision-mission",
		"/visimisi": "/profile/vision-mission",
		"/profil/visi-misi": "/profile/vision-mission",
		"/profil/visimisi": "/profile/vision-mission",
		"/rencana/rencana": "/profile/strategic-plan",
		"/rencana": "/profile/strategic-plan",
		"/panduan/panduan": "/profile/guidelines",
		"/panduan": "/profile/guidelines",
		"/struktur/struktur": "/profile/organization",
		"/struktur": "/profile/organization",
		"/dosen/dosen": "/profile/faculty",
		"/dosen": "/profile/faculty",
		"/laboratorium/laboratorium": "/profile/laboratories",
		"/laboratorium": "/profile/laboratories",
		"/ruangkelas/ruangkelas": "/profile/classrooms",
		"/ruangkelas": "/profile/classrooms",
		"/prestasi/prestasi": "/profile/achievements",
		"/prestasi": "/profile/achievements",
		"/kurikulum/kurikulum": "/academics/curriculum",
		"/kurikulum": "/academics/curriculum",
		"/beasiswa/beasiswa": "/academics/scholarships",
		"/beasiswa": "/academics/scholarships",
		"/tugas-akhir/tugas-akhir": "/academics/thesis",
		"/tugas/tugas-akhir": "/academics/thesis",
		"/tugas-akhir": "/academics/thesis",
		"/kerja-praktik/kerja-praktik": "/academics/internship",
		"/kp/kerja-praktik": "/academics/internship",
		"/kerja-praktik": "/academics/internship",
		"/labssquad/labssquad": "/academics/labs-squad",
		"/labssquad": "/academics/labs-squad",
		"/aiorc/aiorc": "/research/aiorc",
		"/aiorc": "/research/aiorc",
		"/software/software": "/research/software-engineering",
		"/software": "/research/software-engineering",
		"/information/information": "/research/information-technology",
		"/information": "/research/information-technology",
		"/berita": "/news",
		"/agenda/agenda": "/events",
		"/agenda": "/events",
		"/alumni/alumni": "/alumni",
		"/akreditasi": "/accreditation",
		"/mitra": "/partners",
=======
	// Lock down request handling:
	// - checkOrigin: reject cross-origin form posts (CSRF defence)
	// - allowedDomains: ignore spoofed X-Forwarded-Host headers
	security: {
		checkOrigin: true,
		allowedDomains: [
			{ hostname: "tif.uin-suska.ac.id", protocol: "https" },
			{ hostname: "www.tif.uin-suska.ac.id", protocol: "https" },
			{ hostname: "localhost" },
			{ hostname: "127.0.0.1" },
		],
>>>>>>> 075a2d7 (after review)
	},

	// Emit stylesheets as files so the CSP can use `style-src 'self'`
	// without `'unsafe-inline'`.
	build: {
		inlineStylesheets: "never",
	},

	// The site never uses Astro sessions; skipping the filesystem session store
	// removes an unused stateful surface from the SSR bundle.
	session: false,

	redirects: LEGACY_REDIRECTS,

	i18n: {
		defaultLocale: "en",
		locales: ["en", "id"],
		fallback: {
			id: "en",
		},
		routing: {
			prefixDefaultLocale: false,
			fallbackType: "rewrite",
		},
	},

	vite: {
		resolve: {
			alias: {
				"@": new URL("./src", import.meta.url).pathname,
			},
		},
		// Never inline small scripts/assets as data: URIs. Keeps every script
		// on its own cacheable URL and avoids inline <script> blocks that
		// would force a CSP exception.
		build: {
			assetsInlineLimit: 0,
		},
		plugins: [tailwindcss()],
	},
});
