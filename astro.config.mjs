// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';

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
	}),

	integrations: [react(),
		sitemap()
	],

	redirects: {
		"/profil/sejarah": "/profile/history",
		"/visi-misi/visimisi": "/profile/vision-mission",
		"/visimisi/visimisi": "/profile/vision-mission",
		"/rencana/rencana": "/profile/strategic-plan",
		"/panduan/panduan": "/profile/guidelines",
		"/struktur/struktur": "/profile/organization",
		"/dosen/dosen": "/profile/faculty",
		"/laboratorium/laboratorium": "/profile/laboratories",
		"/ruangkelas/ruangkelas": "/profile/classrooms",
		"/prestasi/prestasi": "/profile/achievements",
		"/kurikulum/kurikulum": "/academics/curriculum",
		"/beasiswa/beasiswa": "/academics/scholarships",
		"/tugas-akhir/tugas-akhir": "/academics/thesis",
		"/tugas/tugas-akhir": "/academics/thesis",
		"/kerja-praktik/kerja-praktik": "/academics/internship",
		"/kp/kerja-praktik": "/academics/internship",
		"/labssquad/labssquad": "/academics/labs-squad",
		"/aiorc/aiorc": "/research/aiorc",
		"/software/software": "/research/software-engineering",
		"/information/information": "/research/information-technology",
		"/berita": "/news",
		"/agenda/agenda": "/events",
		"/alumni/alumni": "/alumni",
		"/akreditasi": "/accreditation",
		"/mitra": "/partners",
	},

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
		plugins: [tailwindcss()],
	},
});
